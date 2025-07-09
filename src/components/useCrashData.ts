// components/useCrashData.ts

import { useEffect, useState } from 'react';

export interface CrashRow {
  lat: number;
  lng: number;
  city_id: string;
  county_id: string;
  year: number;
}

export interface Option {
  value: string;
  label: string;
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function useCrashData() {
  const [data, setData] = useState<CrashRow[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [countyOptions, setCountyOptions] = useState<Option[]>([]);
  const [yearOptions, setYearOptions] = useState<Option[]>([]);
  const [cityNames, setCityNames] = useState<Record<string, string>>({});
  const [countyNames, setCountyNames] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const [crashRes, dictRes] = await Promise.all([
          fetch('/data/crashes.json'),
          fetch('/data/dictionary.csv'),
        ]);

        const crashJson: CrashRow[] = await crashRes.json();
        setData(crashJson);

        const yrs = Array.from(new Set(crashJson.map(d => d.year.toString())))
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(v => ({ value: v, label: v }));
        setYearOptions(yrs);

        const text = await dictRes.text();
        const lines = text.trim().split('\n');
        const cMap: Record<string, string> = {};
        const cntMap: Record<string, string> = {};

        for (let i = 1; i < lines.length; i++) {
          const [col, id, desc] = lines[i].split(',');
          if (!desc) continue;
          const name = toTitleCase(desc);
          if (col === 'CITY_ID') cMap[id] = name;
          else if (col === 'CNTY_ID') cntMap[id] = name;
        }

        setCityNames(cMap);
        setCountyNames(cntMap);

        const cities = Array.from(new Set(crashJson.map(d => d.city_id)))
          .map(id => ({ value: id, label: `City of ${cMap[id] || id}` }))
          .sort((a, b) => a.label.localeCompare(b.label));

        const counties = Array.from(new Set(crashJson.map(d => d.county_id)))
          .map(id => ({ value: id, label: `${cntMap[id] || id} County` }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCityOptions(cities);
        setCountyOptions(counties);
      } catch (e) {
        console.error('Error loading crash data:', e);
      }
    })();
  }, []);

  return {
    data,
    cityOptions,
    countyOptions,
    yearOptions,
    cityNames,
    countyNames,
  };
}