'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import FilterControls, { Option } from './FilterControls';
import DisplayOptions from './DisplayOptions';

interface CrashRow {
  lat: number;
  lng: number;
  city_id: string;
  county_id: string;
  year: number;
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function CrashMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heatLayerRef = useRef<any>(null);
  const featureLayerRef = useRef<any>(null);

  const [scriptsReady, setScriptsReady] = useState(false);
  const [showFeatureLayer, setShowFeatureLayer] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [data, setData] = useState<CrashRow[]>([]);
  const [syncFilters, setSyncFilters] = useState(true);

  const [cityNames, setCityNames] = useState<Record<string, string>>({});
  const [countyNames, setCountyNames] = useState<Record<string, string>>({});
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [countyOptions, setCountyOptions] = useState<Option[]>([]);
  const [yearOptions, setYearOptions] = useState<Option[]>([]);

  const [heatCityIds, setHeatCityIds] = useState<string[]>([]);
  const [heatCountyIds, setHeatCountyIds] = useState<string[]>([]);
  const [heatYears, setHeatYears] = useState<string[]>([]);
  const [featureCityIds, setFeatureCityIds] = useState<string[]>([]);
  const [featureCountyIds, setFeatureCountyIds] = useState<string[]>([]);
  const [featureYears, setFeatureYears] = useState<string[]>([]);

  const esriToken = process.env.NEXT_PUBLIC_ESRI_TOKEN;
  const FEATURE_SERVICE_URL =
    'https://services5.arcgis.com/8DjE4f6iFLArDhsU/ArcGIS/rest/services/MyProject_gdb/FeatureServer/0';

  if (!esriToken) {
    console.warn('❗ Missing ESRI token – check your .env or Amplify env variables');
  }

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) return res();
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => res();
        s.onerror = () => rej();
        document.body.appendChild(s);
      });

    const loadCSS = (href: string) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        document.head.appendChild(l);
      }
    };

    (async () => {
      try {
        loadCSS('https://unpkg.com/esri-leaflet-geocoder@3.1.4/dist/esri-leaflet-geocoder.css');
        await loadScript('https://unpkg.com/esri-leaflet@3.0.12/dist/esri-leaflet.js');
        await loadScript('https://unpkg.com/esri-leaflet-vector@4.2.5/dist/esri-leaflet-vector.js');
        await loadScript('https://unpkg.com/esri-leaflet-geocoder@3.1.4/dist/esri-leaflet-geocoder.js');
        setScriptsReady(true);
      } catch (e) {
        console.error('Esri load error', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!scriptsReady || mapRef.current || !containerRef.current || !esriToken) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([30.2672, -97.7431], 8);

    (window as any).L.esri.Vector.vectorBasemapLayer('ArcGIS:Streets', {
      apiKey: esriToken,
    }).addTo(map);

    try {
      const LEsri = (window as any).L.esri;
      const geo = LEsri?.Geocoding;
      if (LEsri && geo && typeof geo.geosearch === 'function') {
        const searchControl = geo.geosearch({
          position: 'topright',
          providers: [geo.arcgisOnlineProvider({ apikey: esriToken })],
        }).addTo(map);

        const results = L.layerGroup().addTo(map);
        searchControl.on('results', (r: any) => {
          results.clearLayers();
          r.results.forEach((res: any) => L.marker(res.latlng).addTo(results));
        });
      }
    } catch {
      console.warn('Geosearch plugin not available');
    }

    mapRef.current = map;
  }, [scriptsReady, esriToken]);

  useEffect(() => {
    (async () => {
      try {
        const [crRes, dictRes] = await Promise.all([
          fetch('/data/crashes.json'),
          fetch('/data/dictionary.csv'),
        ]);
        const crashJson: CrashRow[] = await crRes.json();
        setData(crashJson);

        const yrs = Array.from(new Set(crashJson.map(d => d.year.toString())))
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(v => ({ value: v, label: v }));
        setYearOptions(yrs);

        const text = await dictRes.text();
        const lines = text.trim().split('\n');
        const cMap: Record<string, string> = {};
        const cntMap: Record<string, string> = {};

        for (let i = 1; i < lines.length; i++) {
          const [col, id, desc] = lines[i].split(',');
          if (!desc) continue;
          const name = toTitleCase(desc);
          if (col === 'CITY_ID') cMap[id] = name;
          else if (col === 'CNTY_ID') cntMap[id] = name;
        }

        setCityNames(cMap);
        setCountyNames(cntMap);

        const cities = Array.from(new Set(crashJson.map(d => d.city_id)))
          .map(id => ({ value: id, label: `City of ${cMap[id] || id}` }))
          .sort((a, b) => a.label.localeCompare(b.label));

        const counties = Array.from(new Set(crashJson.map(d => d.county_id)))
          .map(id => ({ value: id, label: `${cntMap[id] || id} County` }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCityOptions(cities);
        setCountyOptions(counties);
      } catch (e) {
        console.error('Error loading data or dictionary:', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    heatLayerRef.current?.remove();
    if (!showHeatmap) return;

    let filtered = data;
    const cities = syncFilters ? featureCityIds : heatCityIds;
    const counties = syncFilters ? featureCountyIds : heatCountyIds;
    const years = syncFilters ? featureYears : heatYears;

    if (cities.length) filtered = filtered.filter(d => cities.includes(d.city_id));
    if (counties.length) filtered = filtered.filter(d => counties.includes(d.county_id));
    if (years.length) filtered = filtered.filter(d => years.includes(d.year.toString()));

    const points: [number, number, number][] = filtered.map(d => [d.lat, d.lng, 0.25]);

    if (points.length) {
      heatLayerRef.current = (L as any).heatLayer(points, {
        radius: 8,
        blur: 12,
        maxZoom: 11,
      }).addTo(mapRef.current);
      const bounds = L.latLngBounds(points.map(p => [p[0], p[1]] as [number, number]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [
    data,
    heatCityIds, heatCountyIds, heatYears,
    featureCityIds, featureCountyIds, featureYears,
    showHeatmap, syncFilters,
  ]);

  useEffect(() => {
    if (!scriptsReady || !mapRef.current || !(window as any).L?.esri) return;

    featureLayerRef.current?.remove();
    if (!showFeatureLayer) return;

    const cities = syncFilters ? heatCityIds : featureCityIds;
    const counties = syncFilters ? heatCountyIds : featureCountyIds;
    const years = syncFilters ? heatYears : featureYears;

    const clauses: string[] = [];
    if (cities.length) clauses.push(`CITY_ID IN ('${cities.join("','")}')`);
    if (counties.length) clauses.push(`CNTY_ID IN ('${counties.join("','")}')`);
    if (years.length) clauses.push(`YEAR IN (${years.join(',')})`);
    const where = clauses.length ? clauses.join(' AND ') : '1=1';

    featureLayerRef.current = (window as any).L.esri.featureLayer({
      url: FEATURE_SERVICE_URL,
      where,
      pointToLayer: (_g: any, latlng: any) =>
        L.circleMarker(latlng, {
          radius: 4,
          color: '#FF5500',
          fillColor: '#FF5500',
          fillOpacity: 0.8,
          weight: 0,
        }),
      maxFeatures: 400000,
    }).addTo(mapRef.current);
  }, [
    scriptsReady,
    showFeatureLayer,
    heatCityIds, heatCountyIds, heatYears,
    featureCityIds, featureCountyIds, featureYears,
    syncFilters,
  ]);

  useEffect(() => {
    const iv = setInterval(() => {
      document.querySelector('.esri-dynamic-attribution')?.remove();
    }, 500);
    return () => clearInterval(iv);
  }, []);

  if (!scriptsReady) {
    return <p style={{ padding: 20 }}>🌀 Loading map…</p>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={syncFilters}
            onChange={e => setSyncFilters(e.target.checked)}
          />
          Sync Filters for Both Layers
        </label>
      </div>

      <FilterControls
        cityOptions={cityOptions}
        countyOptions={countyOptions}
        yearOptions={yearOptions}
        heatCityIds={heatCityIds}
        heatCountyIds={heatCountyIds}
        heatYears={heatYears}
        featureCityIds={featureCityIds}
        featureCountyIds={featureCountyIds}
        featureYears={featureYears}
        syncFilters={syncFilters}
        setHeatCityIds={setHeatCityIds}
        setHeatCountyIds={setHeatCountyIds}
        setHeatYears={setHeatYears}
        setFeatureCityIds={setFeatureCityIds}
        setFeatureCountyIds={setFeatureCountyIds}
        setFeatureYears={setFeatureYears}
      />

      <DisplayOptions
        showHeatmap={showHeatmap}
        showFeatureLayer={showFeatureLayer}
        setShowHeatmap={setShowHeatmap}
        setShowFeatureLayer={setShowFeatureLayer}
      />

      <div
        ref={containerRef}
        style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
      />
    </div>
  );
}