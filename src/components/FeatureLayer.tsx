// components/FeatureLayer.tsx

"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "./MapContext";

type FeatureLayerProps = {
  esriUrl: string;
  cityIds?: string[];
  countyIds?: string[];
  years?: string[];
  syncFilters?: boolean;
  esriToken?: string;
};

export default function FeatureLayer({
  esriUrl,
  cityIds = [],
  countyIds = [],
  years = [],
  syncFilters = true,
  esriToken,
}: FeatureLayerProps) {
  const map = useMap();
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !(window as any).L?.esri) return;

    const clauses: string[] = [];
    if (cityIds.length) clauses.push(`CITY_ID IN ('${cityIds.join("','")}')`);
    if (countyIds.length)
      clauses.push(`CNTY_ID IN ('${countyIds.join("','")}')`);
    if (years.length) clauses.push(`YEAR IN (${years.join(",")})`);

    const where = clauses.length ? clauses.join(" AND ") : "1=1";

    const layer = (window as any).L.esri
      .featureLayer({
        url: esriUrl,
        where,
        token: esriToken,
        pointToLayer: (_geo: any, latlng: any) =>
          L.circleMarker(latlng, {
            radius: 4,
            color: "#FF5500",
            fillColor: "#FF5500",
            fillOpacity: 0.8,
            weight: 0,
          }),
        maxFeatures: 400000,
      })
      .addTo(map);

    layerRef.current = layer;

    return () => {
      layerRef.current?.remove();
    };
  }, [map, cityIds, countyIds, years, syncFilters, esriUrl, esriToken]);

  return null;
}
