// src/styles/jsonMarkerStyles.ts

import L from "leaflet";

export const defaultMarkerStyle = {
  radius: 6,
  color: "#0078FF",       // stroke color
  fillColor: "#0078FF",   // fill color
  fillOpacity: 0.9,
  weight: 2,
};

export const selectedMarkerStyle = {
  radius: 6,
  color: "#FF5722",       // stroke color for selected
  fillColor: "#FF5722",   // fill color for selected
  fillOpacity: 0.9,
  weight: 2,
};

// Optional: function-based style if you want dynamic logic
export function getMarkerStyle(isSelected: boolean): L.PathOptions {
  return isSelected ? selectedMarkerStyle : defaultMarkerStyle;
}