// src/components/CrashDashboard.tsx

import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import EntitySelector from "./EntitySelector";
import MetricSelector from "./MetricSelector";
import ViewModeToggle from "./ViewModeToggle";
import SeveritySelector from "./SeveritySelector";
import ChartSection from "./ChartSection";
import styles from "../styles/CrashDashboard.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type CrashRow = {
  cty: string;
  mun: string;
  inj: number;
  dth: number;
  sev: number;
  dt: string;
};

export default function CrashDashboard() {
  const [data, setData] = useState<CrashRow[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number[]>([]);
  const [metric, setMetric] = useState<"crashes" | "injuries" | "deaths">(
    "crashes"
  );
  const [mode, setMode] = useState<"absolute" | "percent">("absolute");
  const [years, setYears] = useState<string[]>([]);

  // 1) Load and initialize
  useEffect(() => {
    fetch("/data/crash_data_compact.json")
      .then((r) => r.json())
      .then((rows: CrashRow[]) => {
        setData(rows);
        setSeverity([1, 2, 3, 4, 5]);
        const ys = Array.from(
          new Set(rows.map((r) => new Date(r.dt).getFullYear()))
        )
          .filter((y) => y >= 2015)
          .sort((a, b) => a - b)
          .map(String);
        setYears(ys);
      });
  }, []);

  // 2) Filter = Year≥2015 AND (county ∈ selected OR place ∈ selected OR none selected)
  const filtered = useMemo(() => {
    return data.filter((d) => {
      const y = new Date(d.dt).getFullYear();
      if (y < 2015) return false;
      if (metric === "crashes" && !severity.includes(d.sev)) return false;

      // if either filter set, require union membership
      if (counties.length || places.length) {
        if (!counties.includes(d.cty) && !places.includes(d.mun)) {
          return false;
        }
      }
      return true;
    });
  }, [data, counties, places, severity, metric]);

  // 3) Group into *all* matching buckets
  const grouped = useMemo(() => {
    const g: Record<string, Record<string, number>> = {};

    filtered.forEach((d) => {
      const year = new Date(d.dt).getFullYear().toString();
      // collect every matching key
      const buckets: string[] = [];
      if (counties.includes(d.cty)) buckets.push(d.cty);
      if (places.includes(d.mun)) buckets.push(d.mun);
      if (buckets.length === 0) buckets.push("Region");

      buckets.forEach((key) => {
        if (!g[key]) g[key] = {};
        g[key][year] =
          (g[key][year] || 0) +
          (metric === "crashes" ? 1 : metric === "injuries" ? d.inj : d.dth);
      });
    });

    return g;
  }, [filtered, counties, places, metric]);

  // 4) Region totals for percent mode
  const regionTotals = useMemo(() => {
    const t: Record<string, number> = {};
    years.forEach((y) => (t[y] = 0));
    filtered.forEach((d) => {
      const y = new Date(d.dt).getFullYear().toString();
      t[y] += metric === "crashes" ? 1 : metric === "injuries" ? d.inj : d.dth;
    });
    return t;
  }, [filtered, years, metric]);

  // 5) Build chart data
  const labels = years;
  const palette = (i: number) => `hsl(${(i * 70) % 360},65%,55%)`;

  const datasets = Object.entries(grouped).map(([label, vals], i) => ({
    label,
    data: labels.map((y) => vals[y] || 0),
    backgroundColor: palette(i),
  }));

  const totalData = { labels, datasets };
  const percentData = {
    labels,
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.data.map((v, i) =>
        regionTotals[labels[i]] ? (v / regionTotals[labels[i]]) * 100 : 0
      ),
      backgroundColor: ds.backgroundColor,
    })),
  };
  const yoyData = {
    labels: labels.slice(1),
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.data.slice(1).map((v, i) => {
        const prev = ds.data[i];
        return prev ? ((v - prev) / prev) * 100 : null;
      }),
      backgroundColor: ds.backgroundColor,
    })),
  };
  const sinceFirstData = {
    labels: labels.slice(1),
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.data.slice(1).map((v) => {
        const base = ds.data[0];
        return base ? ((v - base) / base) * 100 : null;
      }),
      backgroundColor: ds.backgroundColor,
    })),
  };

  // 6) Render
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Crash Trends Dashboard</h2>

      <div className={styles.filters}>
        <EntitySelector
          data={data}
          onCountyChange={setCounties}
          onMuniChange={setPlaces}
        />
        <MetricSelector selected={metric} setSelected={setMetric} />
        {metric === "crashes" && (
          <SeveritySelector selected={severity} setSelected={setSeverity} />
        )}
        <ViewModeToggle selected={mode} setSelected={setMode} />
      </div>

      <ChartSection title="Total Over Time">
        <Bar
          data={mode === "absolute" ? totalData : percentData}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
          }}
        />
      </ChartSection>

      <ChartSection title="Year-over-Year % Change">
        <Bar
          data={yoyData}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
          }}
        />
      </ChartSection>

      <ChartSection title="% Change Since First Year (2015 Baseline)">
        <Bar
          data={sinceFirstData}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
          }}
        />
      </ChartSection>
    </div>
  );
}
