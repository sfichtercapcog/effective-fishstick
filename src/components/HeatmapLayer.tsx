// components/HeatmapLayer.tsx

"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "./MapContext";

type HeatmapPoint = [number, number, number]; // lat, lng, intensity

type HeatmapLayerProps = {
  points: HeatmapPoint[];
  options?: { radius?: number; blur?: number; maxZoom?: number };
};

export default function HeatmapLayer({
  points,
  options = { radius: 8, blur: 12, maxZoom: 11 },
}: HeatmapLayerProps) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !points.length) return;

    heatLayerRef.current?.remove();

    heatLayerRef.current = (L as any).heatLayer(points, options).addTo(map);

    return () => {
      heatLayerRef.current?.remove();
    };
  }, [map, points, options]);

  return null;
}
