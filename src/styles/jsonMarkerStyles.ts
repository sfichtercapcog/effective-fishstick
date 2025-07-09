// src/styles/jsonMarkerStyles.ts
import { CircleMarkerOptions } from "leaflet";

export const defaultMarkerStyle: CircleMarkerOptions = {
  radius: 8,
  color: "#0078FF",
  fillColor: "#0078FF",
  fillOpacity: 0.85,
  weight: 2,
  opacity: 0.7,
};

export const selectedMarkerStyle: CircleMarkerOptions = {
  radius: 8,
  color: "#FF5722",
  fillColor: "#FF5722",
  fillOpacity: 0.85,
  weight: 2,
  opacity: 0.9,
};

export const getMarkerStyle = (isSelected: boolean): CircleMarkerOptions =>
  isSelected ? selectedMarkerStyle : defaultMarkerStyle;