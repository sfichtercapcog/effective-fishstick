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
          Explore crash locations and trends across Central Texas. Use the
          interactive map and filters to visualize crash density and pinpoint
          locations. Then dive into historical trends with the dashboard below.
        </p>

        <details className="disclaimer" open>
          <summary>
            <strong>Data Note:</strong> Geographic Accuracy & Labeling
            Clarification
          </summary>
          <p>
            All crash locations are mapped using actual geographic coordinates
            from TxDOT data. Jurisdictions (county, city) are assigned using
            2025 boundaries. This may differ slightly from original tags due to
            boundary shifts or mislabeling in the source data.
          </p>
          <p>
            While the TxDOT data is highly accurate (99.9% geocoded), some
            crashes may appear in the wrong place or be labeled incorrectly.
            We’ve prioritized geographic accuracy based on location, not just
            source tags, to better reflect where crashes actually occurred.
          </p>
        </details>

        {/* Map Section */}
        <section
          aria-labelledby="map-heading"
          style={{ marginTop: "2rem", marginBottom: "3rem" }}
        >
          <h2 id="map-heading">Map</h2>
          <p>
            Visualize crashes across the region. Toggle between a heatmap and
            point markers, and use filters above the map to limit results by
            county, place, or crash severity.
          </p>
          <CrashMap />
        </section>

        <hr />

        {/* Dashboard Section */}
        <section aria-labelledby="dashboard-heading">
          <h2 id="dashboard-heading">Dashboard</h2>
          <p>
            Analyze crash patterns over time. View annual totals, growth since
            baseline, and how each entity compares to the regional trend.
          </p>
          <CrashDashboard />
        </section>
      </Layout>
    </>
  );
}
