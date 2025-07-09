import Head from "next/head";
import Layout from "@/components/Layout";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Moving Central Texas</title>
        <meta
          name="description"
          content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates"
        />
        <meta property="og:title" content="Moving Central Texas" />
        <meta
          property="og:description"
          content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates"
        />
        <meta property="og:url" content="https://movingcentraltexas.org/" />
        <link
          rel="icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
      </Head>

      <Layout>
        <h1>Moving Central Texas</h1>

        <p>
          CAPCOG provides this official resource to support transportation
          planning across Central Texas. Through Moving Central Texas, CAPCOG
          delivers tools, data, and expertise to enhance regional infrastructure
          and mobility.
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "var(--spacing-lg) 0",
          }}
        >
          <li style={{ marginBottom: "var(--spacing-md)" }}>
            <h2>
              <a href="/grant-finder/">Grant Finder</a>
            </h2>
            <p>
              A searchable database of transportation-related funding
              opportunities, designed to assist local governments in identifying
              federal, state, and regional grant programs. Includes filters for
              match requirements and funding type, with new grants added
              regularly.
            </p>
          </li>

          <li style={{ marginBottom: "var(--spacing-md)" }}>
            <h2>
              <a href="/shovel-ready/">Shovel-Ready Projects</a>
            </h2>
            <p>
              This tool allows local governments to submit transportation
              projects for CAPCOG review and coordination. It also provides
              resources and guidance for getting projects “shovel ready,”
              including regional data references and federal/state requirements.
            </p>
          </li>

          <li style={{ marginBottom: "var(--spacing-md)" }}>
            <h2>
              <a href="/data-portal/">Data Portal</a>
            </h2>
            <p>
              A curated set of cleaned and summarized transportation data
              sources to support regional understanding and grant applications.
              Includes CAPCOG’s analysis, visualizations, and downloadable
              datasets relevant to mobility, safety, and infrastructure.
            </p>
          </li>

          <li style={{ marginBottom: "var(--spacing-md)" }}>
            <h2>
              <a href="/crash-analytics/">Crash Data</a>
            </h2>
            <p>
              Explore crash locations and trends using interactive maps and
              dashboards. Filter by city, county, and year to analyze crash
              density, heatmaps, and historic change across Central Texas. Built
              from TxDOT’s CRIS database.
            </p>
          </li>

          <li style={{ marginBottom: "var(--spacing-md)" }}>
            <h2>
              <a href="/quiet-zones/">Train Quiet Zones</a>
            </h2>
            <p>
              Map and overview of designated Quiet Zones in the CAPCOG region,
              where train horns are not routinely sounded. Includes data from
              the Federal Railroad Administration’s crossing inventory to
              visualize coverage across the region.
            </p>
          </li>

          <li style={{ marginBottom: "var(--spacing-md)" }}>
            <h2>
              <a href="/reports/">Reports & Documents</a>
            </h2>
            <p>
              Download CAPCOG’s transportation-related studies, technical memos,
              and planning documents. Includes recent work like Rural County
              Network Studies and regional coordination strategies to support
              local transportation planning.
            </p>
          </li>

          <li style={{ marginBottom: "var(--spacing-md)" }}>
            <h2>
              <a href="/newsletter/">Newsletter</a>
            </h2>
            <p>
              CAPCOG publishes a quarterly newsletter to share updates on
              transportation grants, planning tools, deadlines, and agency
              coordination efforts. It serves as a digest of new resources and
              opportunities for local governments.
            </p>
          </li>
        </ul>
      </Layout>
    </>
  );
}
