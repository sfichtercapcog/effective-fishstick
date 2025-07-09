"use client";

import Head from "next/head";
import Layout from "@/components/Layout";
import GrantsManager from "@/components/GrantsManager";

export default function GrantsPage() {
  return (
    <Layout>
      <Head>
        <title>Transportation Grant Finder - Moving Central Texas</title>
        <meta
          name="description"
          content="CAPCOG’s Transportation Grant Finder for Central Texas—search and filter funding opportunities"
        />
        <meta
          name="keywords"
          content="grants, transportation, funding, Central Texas, CAPCOG"
        />
        <meta
          property="og:title"
          content="Transportation Grant Finder - Moving Central Texas"
        />
        <meta
          property="og:description"
          content="Submit transportation projects for CAPCOG review and view approved shovel-ready initiatives."
        />
        <meta
          property="og:url"
          content="https://movingcentraltexas.org/grant-finder/"
        />
      </Head>
      <h1>Transportation Grant Finder</h1>
      <details className="disclaimer" open>
        <summary>
          <strong>Notice:</strong> Under Development
        </summary>
        <p>
          Application hour estimates are only approximations and not a
          guarantee.
        </p>
      </details>
      <p>
        CAPCOG provides this searchable database to identify and filter
        transportation funding opportunities tailored to Central Texas
        communities, including grant types, funding sources, award amounts, and
        application details.
      </p>
      <GrantsManager />
    </Layout>
  );
}
