"use client";

import React from "react";

type Props = {
  countyOptions: string[];
  municipalityOptions: string[];
  selectedCounty: string;
  selectedMunicipality: string;
  showHeatmap: boolean;
  showPointLayer: boolean;
  onToggleHeatmap: () => void;
  onTogglePointLayer: () => void;
  onSelectCounty: (county: string) => void;
  onSelectMunicipality: (muni: string) => void;
  onZoomToExtent: () => void;
};

export default function MapFilterControls({
  countyOptions,
  municipalityOptions,
  selectedCounty,
  selectedMunicipality,
  showHeatmap,
  showPointLayer,
  onToggleHeatmap,
  onTogglePointLayer,
  onSelectCounty,
  onSelectMunicipality,
  onZoomToExtent,
}: Props) {
  const sortedMunicipalityOptions = [
    ...municipalityOptions
      .filter((m) => !m.toLowerCase().startsWith("unincorporated"))
      .sort(),
    ...municipalityOptions
      .filter((m) => m.toLowerCase().startsWith("unincorporated"))
      .sort(),
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1rem",
      }}
    >
      <div>
        <label>
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={onToggleHeatmap}
          />
          Show Heatmap
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showPointLayer}
            onChange={onTogglePointLayer}
          />
          Show Points
        </label>
      </div>
      <div>
        <label>
          County:&nbsp;
          <select
            value={selectedCounty}
            onChange={(e) => onSelectCounty(e.target.value)}
            style={{ padding: "0.25rem", minWidth: "150px" }}
          >
            <option value="">All</option>
            {countyOptions.sort().map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Place:&nbsp;
          <select
            value={selectedMunicipality}
            onChange={(e) => onSelectMunicipality(e.target.value)}
            style={{ padding: "0.25rem", minWidth: "200px" }}
          >
            <option value="">All</option>
            {sortedMunicipalityOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <button onClick={onZoomToExtent} style={{ padding: "0.25rem 0.75rem" }}>
          Zoom to Extent
        </button>
      </div>
    </div>
  );
}
