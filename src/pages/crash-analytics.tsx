// src/pages/crash-analytics.tsx

import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "@/components/Layout";
import CrashDashboard from "@/components/CrashDashboard";

const CrashMap = dynamic(() => import("@/components/CrashMap"), { ssr: false });

export default function CrashAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Crash Analytics – Moving Central Texas</title>
        <meta
          name="description"
          content="Interactive crash analytics for Central Texas: explore crash locations on a map and dive into trend analysis with our dashboard. Filter by city, county, and year."
        />
        <meta
          property="og:title"
          content="Crash Analytics – Moving Central Texas"
        />
        <meta
          property="og:description"
          content="View crash locations on a map and analyze crash trends over time across Central Texas. Filter by city, county, and year."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:url"
          content="https://movingcentraltexas.org/crash-analytics/"
        />
        <link
          rel="icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
      </Head>

      <Layout>
        {/* Page Title */}
        <h1>Crash Analytics</h1>
        <p>
          Welcome to Central Texas Crash Analytics—explore crash locations on a
          map and analyze time-series trends in our dashboard. Use the filters
          to narrow down by city, county, and year, and watch the data update in
          real time.
        </p>
        <ul>
          <li>Locate every recorded crash on an interactive map</li>
          <li>
            View total crashes, year-over-year changes, and growth since
            baseline
          </li>
          <li>Compare individual entities against the regional trend</li>
        </ul>

        <details className="disclaimer" open>
          <summary>
            <strong>Data Note:</strong> Geographic Accuracy & Labeling
            Clarification
          </summary>
          <p>
            All crash locations displayed on this page are based on their actual
            recorded geographic coordinates (latitude and longitude). We assign
            jurisdictions (such as county and municipality) using current 2025
            boundary data. As a result, boundary shifts since earlier crash
            years (e.g., 2015) may cause slight differences between where a
            crash is mapped and the jurisdiction it may have belonged to at the
            time.
          </p>
          <p>
            The source data from TxDOT is extremely well-geocoded—more than
            99.9% of crash records are placed accurately on the map. However,
            like any large dataset, a small number of records contain labeling
            anomalies. For example, a crash occurring in downtown Austin might
            be tagged as Fort Worth, or a rural Fayette County crash might be
            tagged as Wilacy County.
          </p>
          <p>
            To present a more geographically accurate and contextually relevant
            view, we’ve coded our filters and displays using the actual location
            of each crash and standardized boundaries. This may result in totals
            that differ slightly from official TxDOT statistics, but we believe
            this approach provides a clearer and more accurate spatial
            representation of where crashes actually occurred.
          </p>
        </details>

        {/* Map Section */}
        <section
          aria-labelledby="map-heading"
          style={{ marginTop: "2rem", marginBottom: "3rem" }}
        >
          <h2 id="map-heading">Map</h2>
          <p>
            Explore crash locations across Central Texas. Toggle between a
            heatmap of crash density and individual markers, then pan or zoom to
            focus on your area of interest. Use the filters below the map to
            narrow by year, city, or county.
          </p>
          <CrashMap />
        </section>

        <hr />

        {/* Dashboard Section */}
        <section aria-labelledby="dashboard-heading">
          <h2 id="dashboard-heading">Dashboard</h2>
          <p>
            Dive into crash trends over time: total counts, normalized shares,
            year-over-year changes, baseline growth, and entity-vs-region
            comparisons. Charts update instantly to reflect your filters.
          </p>
          <CrashDashboard />
        </section>
      </Layout>
    </>
  );
}
