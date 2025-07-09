// components/CrashMap.tsx

"use client";

import { useMemo, useRef, useState } from "react";
import L from "leaflet";
import useCrashData from "./useCrashData";
import FilterControls from "./FilterControls";
import DisplayOptions from "./DisplayOptions";
import SyncToggle from "./SyncToggle";
import MapContainer from "./MapContainer";
import HeatmapLayer from "./HeatmapLayer";
import FeatureLayer from "./FeatureLayer";

export default function CrashMap() {
  const { data, cityOptions, countyOptions, yearOptions } = useCrashData();

  const mapRef = useRef<L.Map | null>(null);

  const [syncFilters, setSyncFilters] = useState(true);
  const [heatCityIds, setHeatCityIds] = useState<string[]>([]);
  const [heatCountyIds, setHeatCountyIds] = useState<string[]>([]);
  const [heatYears, setHeatYears] = useState<string[]>([]);
  const [featureCityIds, setFeatureCityIds] = useState<string[]>([]);
  const [featureCountyIds, setFeatureCountyIds] = useState<string[]>([]);
  const [featureYears, setFeatureYears] = useState<string[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showFeatureLayer, setShowFeatureLayer] = useState(false);

  const esriToken = process.env.NEXT_PUBLIC_ESRI_TOKEN;
  const FEATURE_SERVICE_URL =
    "https://services5.arcgis.com/8DjE4f6iFLArDhsU/ArcGIS/rest/services/MyProject_gdb/FeatureServer/0";

  const filteredData = useMemo(() => {
    const cities = syncFilters ? featureCityIds : heatCityIds;
    const counties = syncFilters ? featureCountyIds : heatCountyIds;
    const years = syncFilters ? featureYears : heatYears;

    let filtered = data;
    if (cities.length)
      filtered = filtered.filter((d) => cities.includes(d.city_id));
    if (counties.length)
      filtered = filtered.filter((d) => counties.includes(d.county_id));
    if (years.length)
      filtered = filtered.filter((d) => years.includes(d.year.toString()));

    return filtered;
  }, [
    data,
    heatCityIds,
    heatCountyIds,
    heatYears,
    featureCityIds,
    featureCountyIds,
    featureYears,
    syncFilters,
  ]);

  const filteredHeatmapPoints = useMemo(() => {
    return filteredData.map((d) => [d.lat, d.lng, 0.25]) as [
      number,
      number,
      number
    ][];
  }, [filteredData]);

  const handleZoomToExtent = () => {
    const latlngs = filteredData
      .filter((d) => typeof d.lat === "number" && typeof d.lng === "number")
      .map((d) => [d.lat, d.lng] as [number, number]);

    if (!mapRef.current || latlngs.length === 0) return;

    const bounds = L.latLngBounds(latlngs);
    if (bounds.isValid()) {
      mapRef.current.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 1,
        easeLinearity: 0.1,
      });
    }
  };

  return (
    <div>
      <SyncToggle syncFilters={syncFilters} setSyncFilters={setSyncFilters} />

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
        onZoomToExtent={handleZoomToExtent}
      />

      <MapContainer mapRef={mapRef}>
        {showHeatmap && filteredHeatmapPoints.length > 0 && (
          <HeatmapLayer points={filteredHeatmapPoints} />
        )}

        {showFeatureLayer && (
          <FeatureLayer
            esriUrl={FEATURE_SERVICE_URL}
            cityIds={syncFilters ? heatCityIds : featureCityIds}
            countyIds={syncFilters ? heatCountyIds : featureCountyIds}
            years={syncFilters ? heatYears : featureYears}
            esriToken={esriToken}
          />
        )}
      </MapContainer>
    </div>
  );
}
