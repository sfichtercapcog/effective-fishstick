// components/MapContext.tsx

"use client";

import { createContext, useContext } from "react";
import L from "leaflet";

type MapContextType = {
  map: L.Map | null;
};

const MapContext = createContext<MapContextType>({ map: null });

export function MapProvider({
  map,
  children,
}: {
  map: L.Map | null;
  children: React.ReactNode;
}) {
  return <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context.map;
}
