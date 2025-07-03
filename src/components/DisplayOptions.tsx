// components/DisplayOptions.tsx
import React from 'react';

interface DisplayOptionsProps {
  showHeatmap: boolean;
  showFeatureLayer: boolean;
  setShowHeatmap: (b: boolean) => void;
  setShowFeatureLayer: (b: boolean) => void;
}

export default function DisplayOptions({
  showHeatmap,
  showFeatureLayer,
  setShowHeatmap,
  setShowFeatureLayer,
}: DisplayOptionsProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Display Options</h4>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => setShowFeatureLayer(!showFeatureLayer)}>
          {showFeatureLayer ? 'Hide' : 'Show'} Location of Crashes
        </button>
        <button onClick={() => setShowHeatmap(!showHeatmap)}>
          {showHeatmap ? 'Hide' : 'Show'} Crashes Heat Map
        </button>
      </div>
    </div>
  );
}