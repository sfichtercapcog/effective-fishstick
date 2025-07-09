"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import MapContainer from "./MapContainer";
import HeatmapLayer from "./HeatmapLayer";
import JsonLayer from "./JsonLayer";
import L from "leaflet";
import MapFilterControls from "./MapFilterControls";
import FeatureDetailCard from "./FeatureDetailCard";

type CrashFeature = GeoJSON.Feature<
  GeoJSON.Point,
  {
    county: string;
    municipality: string;
    Latitude: number;
    Longitude: number;
    Crash_ID?: number;
    crash_severity?: string;
    OBJECTID?: number;
  }
>;

type GeoJsonData = {
  type: "FeatureCollection";
  features: CrashFeature[];
};

export default function GeoJsonHeatmap() {
  const [geojson, setGeojson] = useState<GeoJsonData | null>(null);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showPointLayer, setShowPointLayer] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Record<
    string,
    any
  > | null>(null);

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data/compressed-data.json");
        const json: GeoJsonData = await res.json();
        setGeojson(json);
      } catch (err) {
        console.error("Failed to load geojson:", err);
      }
    };
    loadData();
  }, []);

  const countyOptions = useMemo(() => {
    if (!geojson) return [];
    return Array.from(
      new Set(geojson.features.map((f) => f.properties.county))
    ).sort();
  }, [geojson]);

  const municipalityOptions = useMemo(() => {
    if (!geojson) return [];
    const all = Array.from(
      new Set(
        geojson.features
          .filter(
            (f) => !selectedCounty || f.properties.county === selectedCounty
          )
          .map((f) => f.properties.municipality)
      )
    );

    const named = all
      .filter((m) => !m.toLowerCase().startsWith("unincorporated"))
      .sort();
    const unincorporated = all
      .filter((m) => m.toLowerCase().startsWith("unincorporated"))
      .sort();

    return [...named, ...unincorporated];
  }, [geojson, selectedCounty]);

  const filteredFeatures = useMemo(() => {
    if (!geojson) return [];
    return geojson.features.filter((f) => {
      const countyMatch = selectedCounty
        ? f.properties.county === selectedCounty
        : true;
      const muniMatch = selectedMunicipality
        ? f.properties.municipality === selectedMunicipality
        : true;
      return countyMatch && muniMatch;
    });
  }, [geojson, selectedCounty, selectedMunicipality]);

  const heatmapPoints = useMemo(() => {
    return filteredFeatures.map((f) => [
      f.geometry.coordinates[1],
      f.geometry.coordinates[0],
      0.5,
    ]) as [number, number, number][];
  }, [filteredFeatures]);

  const handleZoomToExtent = () => {
    if (!mapRef.current || filteredFeatures.length === 0) return;
    const latlngs = filteredFeatures.map((f) => [
      f.geometry.coordinates[1],
      f.geometry.coordinates[0],
    ]) as [number, number][];
    const bounds = L.latLngBounds(latlngs);
    if (bounds.isValid()) {
      mapRef.current.flyToBounds(bounds, {
        padding: [40, 40],
        duration: 1,
      });
    }
  };

  const handleSelectCounty = (county: string) => {
    setSelectedCounty(county);
    setSelectedMunicipality(""); // clear muni dropdown
  };

  return (
    <div>
      <MapFilterControls
        countyOptions={countyOptions}
        municipalityOptions={municipalityOptions}
        selectedCounty={selectedCounty}
        selectedMunicipality={selectedMunicipality}
        showHeatmap={showHeatmap}
        showPointLayer={showPointLayer}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        onTogglePointLayer={() => setShowPointLayer(!showPointLayer)}
        onSelectCounty={handleSelectCounty}
        onSelectMunicipality={setSelectedMunicipality}
        onZoomToExtent={handleZoomToExtent}
      />

      <MapContainer center={[30.2672, -97.7431]} zoom={9} mapRef={mapRef}>
        {showHeatmap && heatmapPoints.length > 0 && (
          <HeatmapLayer points={heatmapPoints} />
        )}
        {showPointLayer && filteredFeatures.length > 0 && (
          <JsonLayer
            map={mapRef.current}
            data={
              {
                type: "FeatureCollection",
                features: filteredFeatures,
              } as GeoJSON.FeatureCollection
            }
            markerColor="#0078FF"
            selectedFeatureId={selectedFeature?.Crash_ID}
            onSelect={(props) => {
              const { OBJECTID, ...rest } = props; // exclude OBJECTID
              setSelectedFeature(rest);
            }}
          />
        )}
      </MapContainer>

      <div style={{ marginTop: "1rem" }}>
        <FeatureDetailCard properties={selectedFeature} />
      </div>
    </div>
  );
}
