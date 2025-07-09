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
  renderPopup?: (props: Record<string, any>) => string;
};

export default function JsonLayer({
  map,
  data,
  markerColor = "#0078FF",
  selectedFeatureId,
  onSelect,
  renderPopup,
}: JsonLayerProps) {
  useEffect(() => {
    if (!map || !data) return;
    let layer: L.Layer | null = null;

    if (Array.isArray(data)) {
      const markers = data.map((d) => {
        const marker = L.circleMarker([d.lat, d.lng], {
          radius: 8,
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.8,
          weight: 1.5,
        }).on("click", (e) => {
          const popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(
              d.popup ??
                `<div style="font-size: 0.85rem"><strong>Latitude:</strong> ${d.lat}<br/><strong>Longitude:</strong> ${d.lng}</div>`
            )
            .openOn(map);

          onSelect?.({
            Latitude: d.lat,
            Longitude: d.lng,
            ...(d.popup ? { Note: d.popup } : {}),
          });
        });

        return marker;
      });

      layer = L.featureGroup(markers).addTo(map);
    } else {
      layer = L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
          const props = feature.properties || {};
          const isSelected = props?.Crash_ID === selectedFeatureId;

          const marker = L.circleMarker(latlng, {
            radius: 8,
            color: isSelected ? "#FF5722" : markerColor,
            fillColor: isSelected ? "#FF5722" : markerColor,
            fillOpacity: 0.85,
            weight: 2,
            opacity: 0.7,
          });

          marker.on("click", (e) => {
            const popupContent = renderPopup
              ? renderPopup(props)
              : `<div style="font-size: 0.85rem"><strong>Crash ID:</strong> ${
                  props.Crash_ID ?? "N/A"
                }<br/><strong>County:</strong> ${
                  props.county ?? ""
                }<br/><strong>Municipality:</strong> ${
                  props.municipality ?? ""
                }</div>`;

            L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);

            onSelect?.(props);
          });

          return marker;
        },
      }).addTo(map);
    }

    return () => {
      if (layer) map.removeLayer(layer);
    };
  }, [map, data, markerColor, selectedFeatureId, onSelect, renderPopup]);

  return null;
}
