// components/MapContainer.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapProvider } from "./MapContext";

type MapContainerProps = {
  center?: [number, number];
  zoom?: number;
  withGeosearch?: boolean;
  children?: React.ReactNode;
  mapRef?: React.MutableRefObject<L.Map | null>;
};

export default function MapContainer({
  center = [30.2672, -97.7431],
  zoom = 8,
  withGeosearch = true,
  children,
  mapRef,
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [scriptsReady, setScriptsReady] = useState(false);

  const esriToken = process.env.NEXT_PUBLIC_ESRI_TOKEN;

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });

    const loadCSS = (href: string) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    };

    (async () => {
      try {
        loadCSS(
          "https://unpkg.com/esri-leaflet-geocoder@3.1.4/dist/esri-leaflet-geocoder.css"
        );
        await loadScript(
          "https://unpkg.com/esri-leaflet@3.0.12/dist/esri-leaflet.js"
        );
        await loadScript(
          "https://unpkg.com/esri-leaflet-vector@4.2.5/dist/esri-leaflet-vector.js"
        );
        if (withGeosearch) {
          await loadScript(
            "https://unpkg.com/esri-leaflet-geocoder@3.1.4/dist/esri-leaflet-geocoder.js"
          );
        }
        setScriptsReady(true);
      } catch (e) {
        console.error("Failed to load Esri scripts:", e);
      }
    })();
  }, [withGeosearch]);

  useEffect(() => {
    if (!scriptsReady || map || !containerRef.current) return;

    const leafletMap = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView(center, zoom);

    const LEsri = (window as any).L?.esri;
    if (LEsri?.Vector?.vectorBasemapLayer && esriToken) {
      LEsri.Vector.vectorBasemapLayer("ArcGIS:Streets", {
        apiKey: esriToken,
      }).addTo(leafletMap);
    } else {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMap);
    }

    if (withGeosearch && LEsri?.Geocoding?.geosearch) {
      const searchControl = LEsri.Geocoding.geosearch({
        position: "topright",
        providers: [
          LEsri.Geocoding.arcgisOnlineProvider({ apikey: esriToken }),
        ],
      }).addTo(leafletMap);

      const results = L.layerGroup().addTo(leafletMap);
      searchControl.on("results", (e: any) => {
        results.clearLayers();
        e.results.forEach((r: any) => L.marker(r.latlng).addTo(results));
      });
    }

    setMap(leafletMap);
    if (mapRef) mapRef.current = leafletMap;
  }, [scriptsReady, center, zoom, esriToken, withGeosearch, mapRef, map]);

  if (!scriptsReady) {
    return <p style={{ padding: 20 }}>🌀 Loading map…</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        style={{
          height: "800px",
          width: "100%",
          borderRadius: "0.5rem",
          zIndex: 0,
        }}
      />
      {map && <MapProvider map={map}>{children}</MapProvider>}
    </div>
  );
}
