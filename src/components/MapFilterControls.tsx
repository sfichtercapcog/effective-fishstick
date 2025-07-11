"use client";

import React, { useMemo } from "react";
import Select, { MultiValue } from "react-select";
import styles from "../styles/MapFilterControls.module.css";

// Define the type of a crash feature
interface CrashFeature {
  properties: {
    county: string;
    municipality: string;
    crash_severity?: string;
  } | null;
}

type Option = { value: string; label: string };

type Props = {
  countyOptions: string[];
  allMunicipalityOptions: string[];
  crashFeatures: CrashFeature[];
  selectedCounty: string;
  selectedMunicipality: string;
  selectedCrashSeverities: string[];
  onSelectCounty: (county: string) => void;
  onSelectMunicipality: (muni: string) => void;
  onZoomToExtent: () => void;
  onSelectCrashSeverities: (severities: string[]) => void;
  severityOptions: string[];
  selectedLayers: string[];
  onSelectLayers: (layers: string[]) => void;
};

export default function MapFilterControls({
  countyOptions,
  allMunicipalityOptions,
  crashFeatures,
  selectedCounty,
  selectedMunicipality,
  onSelectCounty,
  onSelectMunicipality,
  onZoomToExtent,
  selectedCrashSeverities,
  onSelectCrashSeverities,
  severityOptions,
  selectedLayers,
  onSelectLayers,
}: Props) {
  const severityRank: { [key: string]: number } = {
    Fatal: 6,
    "Serious Injury": 5,
    "Minor Injury": 4,
    "Possible Injury": 3,
    "No Injury": 2,
    Unknown: 1,
  };

  const sortedSeverityOptions = [...severityOptions].sort(
    (a, b) => (severityRank[b] || 0) - (severityRank[a] || 0)
  );

  const countySelectOptions: Option[] = countyOptions.map((c) => ({
    value: c,
    label: c,
  }));

  const placesInCounty = useMemo(() => {
    if (!selectedCounty) return allMunicipalityOptions;
    const filtered = crashFeatures
      .filter((f) => f.properties?.county === selectedCounty)
      .map((f) => f.properties!.municipality);

    const unique = Array.from(new Set(filtered));

    const named = unique
      .filter((m) => !m.toLowerCase().startsWith("unincorporated"))
      .sort();

    const unincorporated = unique
      .filter((m) => m.toLowerCase().startsWith("unincorporated"))
      .sort();

    return [...named, ...unincorporated];
  }, [crashFeatures, selectedCounty, allMunicipalityOptions]);

  const municipalitySelectOptions: Option[] = placesInCounty.map((m) => ({
    value: m,
    label: m,
  }));

  const severitySelectOptions: Option[] = sortedSeverityOptions.map((s) => ({
    value: s,
    label: s,
  }));

  const layerSelectOptions: Option[] = [
    { value: "heatmap", label: "Heatmap" },
    { value: "points", label: "Points" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Map Filters</h2>

      {/* Map Layers */}
      <h3 className={styles.sectionTitle}>Map Layers</h3>
      <div className={styles.controls}>
        <div className={styles.select}>
          <label>Layers</label>
          <Select
            isMulti
            options={layerSelectOptions}
            value={layerSelectOptions.filter((opt) =>
              selectedLayers.includes(opt.value)
            )}
            onChange={(opts) => onSelectLayers(opts.map((opt) => opt.value))}
            placeholder="Select layers..."
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : undefined
            }
          />
          <small>Toggle heatmap and/or individual crash points.</small>
        </div>
      </div>

      {/* Location Filters */}
      <h3 className={styles.sectionTitle}>Location Filters</h3>
      <div className={styles.controls}>
        <div className={styles.select}>
          <label>County</label>
          <Select
            options={[
              { value: "", label: "Entire Region" },
              ...countySelectOptions,
            ]}
            value={
              selectedCounty
                ? { value: selectedCounty, label: selectedCounty }
                : { value: "", label: "Entire Region" }
            }
            onChange={(opt) => onSelectCounty(opt?.value || "")}
            placeholder="Select a county..."
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : undefined
            }
          />
          <small>
            Filter by county. You can also select a place inside that county to
            narrow further.
          </small>
        </div>

        <div className={styles.select}>
          <label>Place</label>
          <Select
            options={[
              { value: "", label: "Entire Region" },
              ...municipalitySelectOptions,
            ]}
            value={
              selectedMunicipality
                ? {
                    value: selectedMunicipality,
                    label: selectedMunicipality,
                  }
                : { value: "", label: "Entire Region" }
            }
            onChange={(opt) => onSelectMunicipality(opt?.value || "")}
            placeholder="Select a place..."
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : undefined
            }
          />
          <small>
            Filter by a municipality. If a county is also selected, only places
            with crashes in that county will be listed.
          </small>
        </div>
      </div>

      {/* Severity */}
      <h3 className={styles.sectionTitle}>Crash Severity</h3>
      <div className={styles.controls}>
        <div className={styles.select}>
          <label>Severity</label>
          <Select
            isMulti
            options={severitySelectOptions}
            value={severitySelectOptions.filter((opt) =>
              selectedCrashSeverities.includes(opt.value)
            )}
            onChange={(opts) =>
              onSelectCrashSeverities(opts.map((o) => o.value))
            }
            placeholder="Select severity levels..."
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : undefined
            }
          />
          <small>
            Start with most severe crashes. You can select more levels to
            broaden the results.
          </small>
        </div>
      </div>

      {/* Actions */}
      <h3 className={styles.sectionTitle}>Actions</h3>
      <div className={styles.controls}>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={onZoomToExtent}>
            Zoom to Extent
          </button>
        </div>
      </div>
    </div>
  );
}
