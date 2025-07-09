// components/DisplayOptions.tsx

import React from "react";

interface DisplayOptionsProps {
  showHeatmap: boolean;
  showFeatureLayer: boolean;
  setShowHeatmap: (b: boolean) => void;
  setShowFeatureLayer: (b: boolean) => void;
  onZoomToExtent?: () => void; // ✅ New prop
}

export default function DisplayOptions({
  showHeatmap,
  showFeatureLayer,
  setShowHeatmap,
  setShowFeatureLayer,
  onZoomToExtent,
}: DisplayOptionsProps) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h4>Display Options</h4>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => setShowFeatureLayer(!showFeatureLayer)}>
          {showFeatureLayer ? "Hide" : "Show"} Location of Crashes
        </button>
        <button onClick={() => setShowHeatmap(!showHeatmap)}>
          {showHeatmap ? "Hide" : "Show"} Crashes Heat Map
        </button>
        {onZoomToExtent && (
          <button onClick={onZoomToExtent}>Zoom to Extent</button>
        )}
      </div>
    </div>
  );
}
