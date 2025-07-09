import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import CrashFilters, { Entity, ChartMode, Option } from './CrashFilters';
import ChartSection from './ChartSection';
import styles from '../styles/CrashDashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type CrashRow = {
  lat: number;
  lng: number;
  city_id: string;
  county_id: string;
  year: number;
};

export default function CrashDashboard() {
  const [data, setData] = useState<CrashRow[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([
    { id: 'all', type: 'region' },
  ]);
  const [chartMode, setChartMode] = useState<ChartMode>('absolute');

  const [cityNames, setCityNames] = useState<Record<string, string>>({});
  const [countyNames, setCountyNames] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const [resCrashes, resDict] = await Promise.all([
          fetch('/data/crashes.json'),
          fetch('/data/dictionary.csv'),
        ]);
        const crashesJson: CrashRow[] = await resCrashes.json();
        setData(crashesJson);

        const yrs = Array.from(new Set(crashesJson.map(d => d.year.toString())))
          .sort((a, b) => parseInt(a) - parseInt(b));
        setYears(yrs);

        const text = await resDict.text();
        const lines = text.trim().split('\n');
        const cMap: Record<string, string> = {};
        const cntMap: Record<string, string> = {};
        for (let i = 1; i < lines.length; i++) {
          const [col, id, desc] = lines[i].split(',');
          const proper = desc
            .toLowerCase()
            .split(' ')
            .map(w => w[0].toUpperCase() + w.slice(1))
            .join(' ');
          if (col === 'CITY_ID') cMap[id] = proper;
          else if (col === 'CNTY_ID') cntMap[id] = proper;
        }
        setCityNames(cMap);
        setCountyNames(cntMap);

        const regionOpt: Option[] = [
          { value: 'region-all', label: 'Entire Region (All Data)' },
        ];

        const cityCounts: Record<string, number> = {};
        const countyCounts: Record<string, number> = {};
        crashesJson.forEach(d => {
          cityCounts[d.city_id] = (cityCounts[d.city_id] || 0) + 1;
          countyCounts[d.county_id] = (countyCounts[d.county_id] || 0) + 1;
        });

        const cityOpts = Object.entries(cityCounts)
          .map(([id, cnt]) => ({
            value: `city-${id}`,
            label: `City of ${cMap[id] || id} (${cnt.toLocaleString()} crashes)`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        const countyOpts = Object.entries(countyCounts)
          .map(([id, cnt]) => ({
            value: `county-${id}`,
            label: `${cntMap[id] || id} County (${cnt.toLocaleString()} crashes)`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setOptions([...regionOpt, ...cityOpts, ...countyOpts]);
      } catch (err) {
        console.error('Failed to load data or dictionary:', err);
      }
    })();
  }, []);

  const totalPerYear = useMemo(() => {
    const t: Record<string, number> = {};
    years.forEach(y => {
      t[y] = data.filter(d => d.year.toString() === y).length;
    });
    return t;
  }, [data, years]);

  const allEntities = useMemo(() => {
    const e = [...selectedEntities];
    if (!e.some(x => x.type === 'region' && x.id === 'all'))
      e.push({ type: 'region', id: 'all' });
    return e;
  }, [selectedEntities]);

  const grouped = useMemo(() => {
    const g: Record<string, Record<string, number>> = {};
    allEntities.forEach(({ id, type }) => {
      const key = `${type}-${id}`;
      g[key] = {};
      years.forEach(y => (g[key][y] = 0));
    });
    data.forEach(d => {
      const y = d.year.toString();
      allEntities.forEach(({ id, type }) => {
        const key = `${type}-${id}`;
        if (type === 'region' && id === 'all') g[key][y]++;
        else if (type === 'city' && d.city_id === id) g[key][y]++;
        else if (type === 'county' && d.county_id === id) g[key][y]++;
      });
    });
    return g;
  }, [data, years, allEntities]);

  const nonRegion = selectedEntities.filter(
    e => !(e.type === 'region' && e.id === 'all')
  );

  const labelFor = (type: Entity['type'], id: string) =>
    type === 'region'
      ? 'Entire Region'
      : type === 'city'
      ? `City of ${cityNames[id] || id}`
      : `${countyNames[id] || id} County`;

  const absoluteData = useMemo(() => ({
    labels: years,
    datasets: selectedEntities.map(({ id, type }, i) => ({
      label: labelFor(type, id),
      data: years.map(y => grouped[`${type}-${id}`][y]),
      backgroundColor: `hsl(${(i * 90) % 360},70%,50%)`,
    })),
  }), [grouped, selectedEntities, years, cityNames, countyNames]);

  const normalizedData = useMemo(() => ({
    labels: years,
    datasets: selectedEntities.map(({ id, type }, i) => ({
      label: labelFor(type, id),
      data: years.map(y =>
        totalPerYear[y] ? (grouped[`${type}-${id}`][y] / totalPerYear[y]) * 100 : 0
      ),
      backgroundColor: `hsl(${(i * 90) % 360},70%,50%)`,
    })),
  }), [grouped, selectedEntities, years, totalPerYear, cityNames, countyNames]);

  const yoyData = useMemo(() => ({
    labels: years.slice(1),
    datasets: selectedEntities.map(({ id, type }, i) => {
      const key = `${type}-${id}`;
      return {
        label: `${labelFor(type, id)} YoY %`,
        data: years.slice(1).map((y, j) => {
          const prev = grouped[key][years[j]];
          const cur = grouped[key][y];
          return prev === 0 ? null : ((cur - prev) / prev) * 100;
        }),
        backgroundColor: `hsl(${(i * 90) % 360},60%,60%)`,
      };
    }),
  }), [grouped, selectedEntities, years, cityNames, countyNames]);

  const growthSinceStartData = useMemo(() => ({
    labels: years.slice(1),
    datasets: selectedEntities.map(({ id, type }, i) => {
      const key = `${type}-${id}`;
      const base = grouped[key][years[0]] || 0;
      return {
        label: `${labelFor(type, id)} Growth`,
        data: years.slice(1).map(y =>
          base === 0 ? null : ((grouped[key][y] - base) / base) * 100
        ),
        backgroundColor: `hsl(${(i * 90) % 360},55%,65%)`,
      };
    }),
  }), [grouped, selectedEntities, years, cityNames, countyNames]);

  const relativeTrendData = useMemo(() => {
    const rkey = 'region-all';
    return {
      labels: years.slice(1),
      datasets: nonRegion.map(({ id, type }, i) => {
        const ekey = `${type}-${id}`;
        const e0 = grouped[ekey][years[0]] || 0;
        const r0 = grouped[rkey][years[0]] || 0;
        return {
          label: `${labelFor(type, id)} vs Region`,
          data: years.slice(1).map(y => {
            if (e0 === 0 || r0 === 0) return null;
            const eg = (grouped[ekey][y] - e0) / e0;
            const rg = (grouped[rkey][y] - r0) / r0;
            return (eg - rg) * 100;
          }),
          backgroundColor: `hsl(${(i * 90 + 30) % 360},50%,60%)`,
        };
      }),
    };
  }, [grouped, nonRegion, years, cityNames, countyNames]);

  const attributionData = useMemo(() => {
    const rkey = 'region-all';
    return {
      labels: years.slice(1),
      datasets: nonRegion.map(({ id, type }, i) => {
        const key = `${type}-${id}`;
        const e0 = grouped[key][years[0]] || 0;
        const r0 = grouped[rkey][years[0]] || 0;
        return {
          label: labelFor(type, id),
          data: years.slice(1).map(y => {
            const dE = grouped[key][y] - e0;
            const dR = grouped[rkey][y] - r0;
            return dR === 0 ? null : (dE / dR) * 100;
          }),
          backgroundColor: `hsl(${(i * 90 + 60) % 360},45%,60%)`,
        };
      }),
    };
  }, [grouped, nonRegion, years, cityNames, countyNames]);

  const loading = data.length === 0 || years.length === 0;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Crash Trends Dashboard</h2>
      {loading ? (
        <div className={styles.loading}>Loading crash data…</div>
      ) : (
        <>
          <CrashFilters
            options={options}
            selectedEntities={selectedEntities}
            onChangeEntities={setSelectedEntities}
            chartMode={chartMode}
            onChangeChartMode={setChartMode}
          />

          <ChartSection
            title="Total Crashes Over Time"
            subtitle="Shows the raw number of crashes each year for the selected entities."
          >
            <Bar
              data={chartMode === 'absolute' ? absoluteData : normalizedData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: ctx => {
                        const y = typeof ctx.label === 'string' ? ctx.label : '';
                        const v = typeof ctx.parsed?.y === 'number' ? ctx.parsed.y : 0;
                        const tot = totalPerYear[y] || 1;
                        return chartMode === 'absolute'
                          ? `${ctx.dataset.label ?? 'Entity'}: ${v.toLocaleString()} crashes`
                          : `${ctx.dataset.label ?? 'Entity'}: ${((v / tot) * 100).toFixed(1)}% of total`;
                      },
                    },
                  },
                },
              }}
            />
          </ChartSection>

          <ChartSection title="Crash Share of Regional Total" subtitle="Shows what % of all regional crashes happened in each selected entity per year.">
            <Bar data={normalizedData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </ChartSection>

          <ChartSection title="Year-over-Year % Change" subtitle="How much crashes changed from the previous year for each entity.">
            <Bar data={yoyData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </ChartSection>

          <ChartSection title="% Change Since First Year" subtitle="Measures growth or decline in crashes since the first year of data.">
            <Bar data={growthSinceStartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </ChartSection>

          {nonRegion.length > 0 && (
            <>
              <ChartSection title="Crash Change Compared to Region" subtitle="Compares how much each entity's crashes changed vs. the region overall.">
                <Bar data={relativeTrendData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </ChartSection>

              <ChartSection title="Crash Change Attribution" subtitle="Shows how much each entity contributed to the region’s overall crash change.">
                <Bar
                  data={attributionData}
                  options={{
                    responsive: true,
                    scales: {
                      x: { stacked: true },
                      y: { stacked: true },
                    },
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: {
                        callbacks: {
                          label: ctx =>
                            ctx.parsed.y == null
                              ? 'No data'
                              : `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`,
                        },
                      },
                    },
                  }}
                />
              </ChartSection>
            </>
          )}
        </>
      )}
    </div>
  );
}