"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import L from "leaflet";
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
  >([]);
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

  const severityOptions = useMemo(() => {
    if (!geojson) return ["All"];
    const severities = Array.from(
      new Set(geojson.features.map((f) => f.properties.crash_severity))
    )
      .filter((s): s is string => s !== undefined && s !== null)
      .sort();
    return ["All", ...severities];
  }, [geojson]);

  useEffect(() => {
    // Set default selectedCrashSeverities when severityOptions is available
    const defaultSeverities = ["Fatal", "Serious Injury"].filter((s) =>
      severityOptions.includes(s)
    );
    setSelectedCrashSeverities((prev) =>
      prev.length === 0 ? defaultSeverities : prev
    );
  }, [severityOptions]);

  const filteredFeatures = useMemo(() => {
    if (!geojson) return [];
    return geojson.features.filter((f) => {
      const countyMatch = selectedCounty
        ? f.properties.county === selectedCounty
        : true;
      const muniMatch = selectedMunicipality
        ? f.properties.municipality === selectedMunicipality
        : true;
      const severityMatch =
        selectedCrashSeverities.length === 0 ||
        selectedCrashSeverities.includes(f.properties.crash_severity || "");
      return countyMatch && muniMatch && severityMatch;
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

  const handleSelectCounty = (county: string) => {
    setSelectedCounty(county);
    setSelectedMunicipality("");
  };

  const handleSelectCrashSeverities = (severities: string[]) => {
    setSelectedCrashSeverities(severities);
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
        selectedCrashSeverities={selectedCrashSeverities}
        onSelectCrashSeverities={handleSelectCrashSeverities}
        severityOptions={severityOptions}
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
