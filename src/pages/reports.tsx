import Layout from "@/components/Layout";

export default function ReportsPage() {
  return (
    <Layout>
      <head>
        <title>Reports and Publications - Moving Central Texas</title>
        <meta
          name="description"
          content="CAPCOG's reports and publications on transportation planning in Central Texas."
        />
        <meta
          property="og:title"
          content="Reports and Publications - Moving Central Texas"
        />
        <meta
          property="og:description"
          content="Explore CAPCOG's reports and publications related to transportation planning in Central Texas."
        />
      </head>
      <h1>Reports and Publications</h1>
      <p>
        CAPCOG produces comprehensive reports to inform transportation planning
        and analysis in Central Texas. As of last update, no reports have been
        recently published. CAPCOG is currently preparing to begin the Rural
        County Network Studies for Blanco, Lee, and Llano Counties.
      </p>
      <div className="report">
        <h2>Rural County Network Studies</h2>
        <p>
          CAPCOG is conducting transportation needs assessments for Blanco, Lee,
          and Llano Counties, focusing on mobility gaps, safety issues, and
          funding opportunities. These studies will include detailed reports and
          GIS maps, addressing crash statistics, transit coverage, and road
          conditions. Final reports will support local governments in securing
          transportation resources.
        </p>
      </div>
    </Layout>
  );
}
