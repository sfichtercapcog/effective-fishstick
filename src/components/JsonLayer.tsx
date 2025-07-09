"use client";

import { useEffect } from "react";
import L from "leaflet";

type PointData = {
  lat: number;
  lng: number;
  popup?: string;
};

type JsonLayerProps = {
  map: L.Map | null;
  data: GeoJSON.GeoJsonObject | PointData[];
  markerColor?: string;
  selectedFeatureId?: number;
  onSelect?: (props: Record<string, any>) => void;
};

export default function JsonLayer({
  map,
  data,
  markerColor = "#0078FF",
  selectedFeatureId,
  onSelect,
}: JsonLayerProps) {
  useEffect(() => {
    if (!map || !data) return;

    let layer: L.Layer | null = null;

    if (Array.isArray(data)) {
      const markers = data.map((d) =>
        L.circleMarker([d.lat, d.lng], {
          radius: 5,
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.8,
          weight: 1,
        }).on("click", () => {
          if (onSelect) {
            onSelect({
              Latitude: d.lat,
              Longitude: d.lng,
              ...(d.popup ? { Note: d.popup } : {}),
            });
          }
        })
      );
      layer = L.featureGroup(markers).addTo(map);
    } else {
      layer = L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
          const props = feature.properties || {};
          const isSelected = props?.Crash_ID === selectedFeatureId;

          const circle = L.circleMarker(latlng, {
            radius: 6,
            color: isSelected ? "#FF5722" : markerColor,
            fillColor: isSelected ? "#FF5722" : markerColor,
            fillOpacity: 0.9,
            weight: 2,
          });

          const popupHtml = `
            <div style="font-size: 0.85rem;">
              <strong>Crash ID:</strong> ${props.Crash_ID ?? "N/A"}<br/>
              <strong>Severity:</strong> ${
                props.crash_severity ?? "Unknown"
              }<br/>
              <strong>County:</strong> ${props.county ?? ""}<br/>
              <strong>Municipality:</strong> ${props.municipality ?? ""}
            </div>
          `;

          circle.bindPopup(popupHtml);

          circle.on("click", () => {
            if (onSelect) onSelect(props);
          });

          return circle;
        },
      }).addTo(map);
    }

    return () => {
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [map, data, markerColor, onSelect, selectedFeatureId]);

  return null;
}
