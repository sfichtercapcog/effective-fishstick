"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import L from "leaflet";
import { FeatureCollection } from "geojson";
import MapContainer from "./MapContainer";
import HeatmapLayer from "./HeatmapLayer";
import JsonLayer from "./JsonLayer";
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

export default function CrashMap() {
  const [geojson, setGeojson] = useState<GeoJsonData | null>(null);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedCrashSeverities, setSelectedCrashSeverities] = useState<
    string[]
  >(["Fatal", "Serious Injury"]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Record<
    string,
    any
  > | null>(null);

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data/compressed-crashes.json");
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
      new Set(geojson.features.map((f) => f.properties.municipality))
    );
    const named = all
      .filter((m) => !m.toLowerCase().startsWith("unincorporated"))
      .sort();
    const unincorporated = all
      .filter((m) => m.toLowerCase().startsWith("unincorporated"))
      .sort();
    return [...named, ...unincorporated];
  }, [geojson]);

  const severityOptions = useMemo(() => {
    if (!geojson) return [];
    const areaFiltered = geojson.features.filter((f) => {
      return (
        (!selectedCounty || f.properties.county === selectedCounty) &&
        (!selectedMunicipality ||
          f.properties.municipality === selectedMunicipality)
      );
    });
    const severities = Array.from(
      new Set(areaFiltered.map((f) => f.properties.crash_severity))
    ).filter((s): s is string => !!s);
    return severities;
  }, [geojson, selectedCounty, selectedMunicipality]);

  const filteredFeatures: CrashFeature[] = useMemo(() => {
    if (!geojson) return [];
    return geojson.features.filter((f) => {
      const matchesCounty =
        !selectedCounty || f.properties.county === selectedCounty;
      const matchesMuni =
        !selectedMunicipality ||
        f.properties.municipality === selectedMunicipality;
      const matchesSeverity =
        selectedCrashSeverities.length === 0 ||
        selectedCrashSeverities.includes(f.properties.crash_severity || "");
      return matchesCounty && matchesMuni && matchesSeverity;
    });
  }, [geojson, selectedCounty, selectedMunicipality, selectedCrashSeverities]);

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
        padding: [60, 60],
        duration: 1.5,
        maxZoom: 14,
      });
    }
  };

  const renderPopup = (props: Record<string, any>) => {
    const rows = [
      ["Crash ID", props.Crash_ID],
      ["Severity", props.crash_severity],
      ["County", props.county],
      ["Municipality", props.municipality],
    ]
      .filter(([_, val]) => val !== null && val !== undefined)
      .map(([label, val]) => `<div><strong>${label}:</strong> ${val}</div>`)
      .join("");

    return `<div style="font-size: 0.85rem; line-height: 1.4;">${rows}</div>`;
  };

  const filteredGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: filteredFeatures,
  };

  return (
    <div>
      <MapFilterControls
        countyOptions={countyOptions}
        municipalityOptions={municipalityOptions}
        selectedCounty={selectedCounty}
        selectedMunicipality={selectedMunicipality}
        onSelectCounty={setSelectedCounty}
        onSelectMunicipality={setSelectedMunicipality}
        onZoomToExtent={handleZoomToExtent}
        selectedCrashSeverities={selectedCrashSeverities}
        onSelectCrashSeverities={setSelectedCrashSeverities}
        severityOptions={severityOptions}
        selectedLayers={selectedLayers}
        onSelectLayers={setSelectedLayers}
      />

      <MapContainer center={[30.2672, -97.7431]} zoom={9} mapRef={mapRef}>
        {selectedLayers.includes("heatmap") && heatmapPoints.length > 0 && (
          <HeatmapLayer points={heatmapPoints} />
        )}

        {selectedLayers.includes("points") && filteredFeatures.length > 0 && (
          <JsonLayer
            map={mapRef.current}
            data={filteredGeoJson} // ✅ fixed typing
            selectedFeature={selectedFeature}
            onSelect={setSelectedFeature}
            renderPopup={renderPopup}
          />
        )}
      </MapContainer>

      <div style={{ marginTop: "1rem" }}>
        <FeatureDetailCard
          properties={
            selectedFeature
              ? Object.fromEntries(
                  Object.entries(selectedFeature).filter(
                    ([key]) => key !== "OBJECTID"
                  )
                )
              : null
          }
        />
      </div>
    </div>
  );
}
