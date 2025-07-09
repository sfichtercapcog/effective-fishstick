"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  defaultMarkerStyle,
  selectedMarkerStyle,
} from "@/styles/jsonMarkerStyles";

type PointData = {
  lat: number;
  lng: number;
  popup?: string;
};

type JsonLayerProps = {
  map: L.Map | null;
  data: GeoJSON.GeoJsonObject | PointData[];
  selectedFeature?: Record<string, any> | null;
  onSelect?: (props: Record<string, any>) => void;
  renderPopup?: (props: Record<string, any>) => string;
};

export default function JsonLayer({
  map,
  data,
  selectedFeature,
  onSelect,
  renderPopup,
}: JsonLayerProps) {
  useEffect(() => {
    if (!map || !data) return;

    let layer: L.Layer | null = null;

    if (Array.isArray(data)) {
      const markers = data.map((d) => {
        const marker = L.circleMarker([d.lat, d.lng], defaultMarkerStyle).on(
          "click",
          (e) => {
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
          }
        );
        return marker;
      });

      layer = L.featureGroup(markers).addTo(map);
    } else {
      layer = L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
          const props = feature.properties || {};
          const isSelected = selectedFeature === props;

          const marker = L.circleMarker(latlng, {
            ...defaultMarkerStyle,
            ...(isSelected ? selectedMarkerStyle : {}),
          });

          marker.on("click", (e) => {
            const popupContent = renderPopup
              ? renderPopup(props)
              : `<div style="font-size: 0.85rem"><pre>${JSON.stringify(
                  props,
                  null,
                  2
                )}</pre></div>`;

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
  }, [map, data, selectedFeature, onSelect, renderPopup]);

  return null;
}
