// components/QuietZonesMap.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import MapContainer from "./MapContainer";
import JsonLayer from "./JsonLayer";
import FeatureDetailCard from "./FeatureDetailCard";

type GeoJson = GeoJSON.GeoJsonObject;

export default function QuietZonesMap() {
  const mapRef = useRef<L.Map | null>(null);
  const [geojson, setGeojson] = useState<GeoJson | null>(null);
  const [selected, setSelected] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetch("/data/quiet_zone_crossings.json")
      .then((res) => res.json())
      .then(setGeojson)
      .catch((e) => console.error("Error loading GeoJSON:", e));
  }, []);

  return (
    <>
      <MapContainer mapRef={mapRef} />
      {geojson && (
        <JsonLayer
          map={mapRef.current}
          data={geojson}
          markerColor="#B22222"
          onSelect={setSelected}
        />
      )}
      <FeatureDetailCard properties={selected} />
    </>
  );
}
