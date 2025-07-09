// pages/test-map.tsx

import Head from "next/head";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";

// 🧠 Dynamically import GeoJsonHeatmap to ensure it's client-only
const GeoJsonHeatmap = dynamic(() => import("@/components/GeoJsonHeatmap"), {
  ssr: false,
});

export default function TestMapPage() {
  return (
    <>
      <Head>
        <title>Test Map - Moving Central Texas</title>
        <meta
          name="description"
          content="Testing heatmap display for Central Texas transportation data."
        />
        <meta property="og:title" content="Test Map - Moving Central Texas" />
        <meta
          property="og:description"
          content="Testing map component with heatmap overlay."
        />
        <meta
          property="og:url"
          content="https://movingcentraltexas.org/test-map/"
        />
        <link
          rel="icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
      </Head>

      <Layout>
        <h1>Test Map</h1>
        <p>
          This page displays a test heatmap layer using GeoJSON data for visual
          debugging.
        </p>

        <GeoJsonHeatmap />
      </Layout>
    </>
  );
}
