"use client";

import React from "react";
import Select, { MultiValue } from "react-select";
import styles from "../styles/CrashDashboard.module.css";

type Option = { value: string; label: string };

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
  selectedCrashSeverities: string[];
  onSelectCrashSeverities: (severities: string[]) => void;
  severityOptions: string[];
  selectedLayers: string[]; // New prop
  onSelectLayers: (layers: string[]) => void; // New prop
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
  selectedCrashSeverities,
  onSelectCrashSeverities,
  severityOptions,
  selectedLayers,
  onSelectLayers,
}: Props) {
  // Define severity order ranking
  const severityRank: { [key: string]: number } = {
    Fatal: 6,
    "Serious Injury": 5,
    "Minor Injury": 4,
    "Possible Injury": 3,
    "No Injury": 2,
    Unknown: 1,
  };

  // Sort severityOptions by rank
  const sortedSeverityOptions = [...severityOptions].sort((a, b) => {
    return (severityRank[b] || 0) - (severityRank[a] || 0);
  });

  // Sort municipality options
  const sortedMunicipalityOptions = [
    ...municipalityOptions
      .filter((m) => !m.toLowerCase().startsWith("unincorporated"))
      .sort(),
    ...municipalityOptions
      .filter((m) => m.toLowerCase().startsWith("unincorporated"))
      .sort(),
  ];

  // Transform options for react-select
  const countySelectOptions: Option[] = countyOptions.map((c) => ({
    value: c,
    label: c,
  }));
  const municipalitySelectOptions: Option[] = sortedMunicipalityOptions.map(
    (m) => ({
      value: m,
      label: m,
    })
  );
  const severitySelectOptions: Option[] = sortedSeverityOptions.map((s) => ({
    value: s,
    label: s,
  }));
  const layerSelectOptions: Option[] = [
    { value: "heatmap", label: "Heatmap" },
    { value: "points", label: "Points" },
  ];

  // Handle select changes
  const handleCountyChange = (selectedOption: Option | null) => {
    onSelectCounty(selectedOption?.value || "");
  };
  const handleMunicipalityChange = (selectedOption: Option | null) => {
    onSelectMunicipality(selectedOption?.value || "");
  };
  const handleSeverityChange = (selectedOptions: MultiValue<Option>) => {
    const selectedValues = selectedOptions.map((opt) => opt.value);
    onSelectCrashSeverities(selectedValues);
  };
  const handleLayerChange = (selectedOptions: MultiValue<Option>) => {
    const selectedValues = selectedOptions.map((opt) => opt.value);
    onSelectLayers(selectedValues);
  };

  // Selected values for react-select
  const selectedCountyOption =
    countySelectOptions.find((opt) => opt.value === selectedCounty) || null;
  const selectedMunicipalityOption =
    municipalitySelectOptions.find(
      (opt) => opt.value === selectedMunicipality
    ) || null;
  const selectedSeverityOptions = severitySelectOptions.filter((opt) =>
    selectedCrashSeverities.includes(opt.value)
  );
  const selectedLayerOptions = layerSelectOptions.filter((opt) =>
    selectedLayers.includes(opt.value)
  );

  return (
    <div className={styles.controls}>
      <div className={styles.selector}>
        <label>
          <strong>Map Layers:</strong>
        </label>
        <Select
          isMulti
          options={layerSelectOptions}
          value={selectedLayerOptions}
          onChange={handleLayerChange}
          placeholder="Select layers..."
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : undefined
          }
        />
        <small>
          Choose one or more layers to display on the map (e.g., Heatmap,
          Points).
        </small>
      </div>
      <div className={styles.selector}>
        <label>
          <strong>County:</strong>
        </label>
        <Select
          options={countySelectOptions}
          value={selectedCountyOption}
          onChange={handleCountyChange}
          placeholder="Select a county..."
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : undefined
          }
        />
        <small>Filter crashes by selecting a specific county.</small>
      </div>
      <div className={styles.selector}>
        <label>
          <strong>Place:</strong>
        </label>
        <Select
          options={municipalitySelectOptions}
          value={selectedMunicipalityOption}
          onChange={handleMunicipalityChange}
          placeholder="Select a place..."
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : undefined
          }
        />
        <small>
          Narrow down crashes to a specific city or unincorporated area.
        </small>
      </div>
      <div className={styles.selector}>
        <label>
          <strong>Severity:</strong>
        </label>
        <Select
          isMulti
          options={severitySelectOptions}
          value={selectedSeverityOptions}
          onChange={handleSeverityChange}
          placeholder="Select severities..."
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : undefined
          }
        />
        <small>
          Choose one or more severity levels to filter crash data (e.g., Fatal,
          Injury).
        </small>
      </div>
      <div className={styles.toggleGroup}>
        <label>
          <strong>Actions:</strong>
        </label>
        <div>
          <button className="btn" onClick={onZoomToExtent}>
            Zoom to Extent
          </button>
        </div>
        <small>Zoom to show all filtered crashes.</small>
      </div>
    </div>
  );
}
