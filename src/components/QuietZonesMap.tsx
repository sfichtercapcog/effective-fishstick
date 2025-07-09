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

  const renderPopup = (props: Record<string, any>) => {
    const fields = {
      "Railroad Name": props.Railroad_Name,
      "Crossing ID": props.Crossing_ID,
      "Warning Device Code": props.Warning_Device_Code,
    };

    const rows = Object.entries(fields)
      .filter(([_, val]) => val !== null && val !== undefined)
      .map(([label, value]) => `<div><strong>${label}:</strong> ${value}</div>`)
      .join("");

    return `<div style="font-size: 0.85rem; line-height: 1.4;">${rows}</div>`;
  };

  return (
    <>
      <MapContainer mapRef={mapRef} />
      {geojson && (
        <JsonLayer
          map={mapRef.current}
          data={geojson}
          markerColor="#B22222"
          onSelect={setSelected}
          renderPopup={renderPopup}
        />
      )}
      <FeatureDetailCard
        properties={
          selected
            ? Object.fromEntries(
                Object.entries(selected).filter(([key]) => key !== "OBJECTID")
              )
            : null
        }
      />
    </>
  );
}
