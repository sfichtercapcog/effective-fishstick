// pages/crash-analytics.tsx
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CrashDashboard from '@/components/CrashDashboard';

// Load the map only on the client
const CrashMap = dynamic(() => import('@/components/CrashMap'), { ssr: false });

export default function CrashAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Crash Analytics – Moving Central Texas</title>
        <meta
          name="description"
          content="Interactive crash analytics for Central Texas: explore crash locations on a map and dive into trend analysis with our dashboard. Filter by city, county, and year."
        />
        <meta property="og:title" content="Crash Analytics – Moving Central Texas" />
        <meta
          property="og:description"
          content="View crash locations on a map and analyze crash trends over time across Central Texas. Filter by city, county, and year."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="/assets/images/central-texas-hero.jpg" />
        <meta property="og:url" content="https://movingcentraltexas.org/crash-analytics/" />
        <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </Head>

      <Layout>
        {/* Page Title */}
        <h1>Crash Analytics</h1>
        <p>
          Welcome to Central Texas Crash Analytics—explore crash locations on a map and analyze
          time-series trends in our dashboard. Use the filters to narrow down by city, county, and
          year, and watch the data update in real time.
        </p>
        <ul>
          <li>Locate every recorded crash on an interactive map</li>
          <li>View total crashes, year-over-year changes, and growth since baseline</li>
          <li>Compare individual entities against the regional trend</li>
        </ul>

        {/* Map Section */}
        <section aria-labelledby="map-heading">
          <h2 id="map-heading">Map</h2>
          <p>
            Explore crash locations across Central Texas. Toggle between a heatmap of crash density
            and individual markers, then pan or zoom to focus on your area of interest.
          </p>
          <CrashMap />
        </section>

        <hr style={{ margin: '3rem 0' }} />

        {/* Dashboard Section */}
        <section aria-labelledby="dashboard-heading">
          <h2 id="dashboard-heading">Dashboard</h2>
          <p>
            Dive into crash trends over time: total counts, normalized shares, year-over-year
            changes, baseline growth, and entity-vs-region comparisons. Charts update instantly
            to reflect your filters.
          </p>
          <CrashDashboard />
        </section>
      </Layout>
    </>
  );
}