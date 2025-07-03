import React from 'react';
import Select, { MultiValue } from 'react-select';

export type Option = { value: string; label: string };

interface FilterControlsProps {
  cityOptions: Option[];
  countyOptions: Option[];
  yearOptions: Option[];
  heatCityIds: string[];
  heatCountyIds: string[];
  heatYears: string[];
  featureCityIds: string[];
  featureCountyIds: string[];
  featureYears: string[];
  syncFilters: boolean;
  setHeatCityIds: (ids: string[]) => void;
  setHeatCountyIds: (ids: string[]) => void;
  setHeatYears: (ys: string[]) => void;
  setFeatureCityIds: (ids: string[]) => void;
  setFeatureCountyIds: (ids: string[]) => void;
  setFeatureYears: (ys: string[]) => void;
}

const selectStyles = {
  container: (base: any) => ({ ...base, minWidth: 200, zIndex: 1000 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 1000 }),
};

export default function FilterControls({
  cityOptions,
  countyOptions,
  yearOptions,
  heatCityIds,
  heatCountyIds,
  heatYears,
  featureCityIds,
  featureCountyIds,
  featureYears,
  syncFilters,
  setHeatCityIds,
  setHeatCountyIds,
  setHeatYears,
  setFeatureCityIds,
  setFeatureCountyIds,
  setFeatureYears,
}: FilterControlsProps) {
  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      {syncFilters ? (
        <div style={{ marginBottom: '1rem' }}>
          <h4>Filter Crashes (Both Layers)</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Select<Option, true>
              isMulti
              options={cityOptions}
              value={cityOptions.filter(o => heatCityIds.includes(o.value))}
              onChange={(sel: MultiValue<Option>) => {
                const vals = sel.map(o => o.value);
                setHeatCityIds(vals);
                setFeatureCityIds(vals);
              }}
              placeholder="Cities"
              styles={selectStyles}
              menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
              menuPosition="fixed"
            />
            <Select<Option, true>
              isMulti
              options={countyOptions}
              value={countyOptions.filter(o => heatCountyIds.includes(o.value))}
              onChange={(sel: MultiValue<Option>) => {
                const vals = sel.map(o => o.value);
                setHeatCountyIds(vals);
                setFeatureCountyIds(vals);
              }}
              placeholder="Counties"
              styles={selectStyles}
              menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
              menuPosition="fixed"
            />
            <Select<Option, true>
              isMulti
              options={yearOptions}
              value={yearOptions.filter(o => heatYears.includes(o.value))}
              onChange={(sel: MultiValue<Option>) => {
                const vals = sel.map(o => o.value);
                setHeatYears(vals);
                setFeatureYears(vals);
              }}
              placeholder="Years"
              styles={selectStyles}
              menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
              menuPosition="fixed"
            />
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <h4>Filter for Heat Map</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Select<Option, true>
                isMulti
                options={cityOptions}
                value={cityOptions.filter(o => heatCityIds.includes(o.value))}
                onChange={(sel: MultiValue<Option>) => setHeatCityIds(sel.map(o => o.value))}
                placeholder="Cities"
                styles={selectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
              />
              <Select<Option, true>
                isMulti
                options={countyOptions}
                value={countyOptions.filter(o => heatCountyIds.includes(o.value))}
                onChange={(sel: MultiValue<Option>) => setHeatCountyIds(sel.map(o => o.value))}
                placeholder="Counties"
                styles={selectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
              />
              <Select<Option, true>
                isMulti
                options={yearOptions}
                value={yearOptions.filter(o => heatYears.includes(o.value))}
                onChange={(sel: MultiValue<Option>) => setHeatYears(sel.map(o => o.value))}
                placeholder="Years"
                styles={selectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <h4>Filter for Location of Crashes</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Select<Option, true>
                isMulti
                options={cityOptions}
                value={cityOptions.filter(o => featureCityIds.includes(o.value))}
                onChange={(sel: MultiValue<Option>) => setFeatureCityIds(sel.map(o => o.value))}
                placeholder="Cities"
                styles={selectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
              />
              <Select<Option, true>
                isMulti
                options={countyOptions}
                value={countyOptions.filter(o => featureCountyIds.includes(o.value))}
                onChange={(sel: MultiValue<Option>) => setFeatureCountyIds(sel.map(o => o.value))}
                placeholder="Counties"
                styles={selectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
              />
              <Select<Option, true>
                isMulti
                options={yearOptions}
                value={yearOptions.filter(o => featureYears.includes(o.value))}
                onChange={(sel: MultiValue<Option>) => setFeatureYears(sel.map(o => o.value))}
                placeholder="Years"
                styles={selectStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}