import Head from 'next/head'
import Layout from '@/components/Layout'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Moving Central Texas</title>
        <meta name="description" content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates" />
        <meta property="og:title" content="Moving Central Texas" />
        <meta property="og:description" content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates" />
        <meta property="og:image" content="/assets/images/central-texas-hero.jpg" />
        <meta property="og:url" content="https://movingcentraltexas.org/" />
        <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </Head>

      <Layout>
        <h1>Moving Central Texas</h1>

        <p>CAPCOG provides this official resource to support transportation planning across Central Texas. Through Moving Central Texas, CAPCOG delivers tools, data, and expertise to enhance regional infrastructure and mobility. In 2025, CAPCOG focuses on rural transportation assessments, project frameworks, regional planning coordination, and improved access to funding and data for local governments.</p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--spacing-lg) 0' }}>
          <li style={{ marginBottom: 'var(--spacing-md)' }}>
            <h2><a href="/grants/">Grant Finder</a></h2>
            <p>CAPCOG offers a searchable database of transportation funding opportunities, designed to assist local governments in securing grants. Fully operational, it includes filters for funding levels and match requirements, with updates provided monthly via newsletter.</p>
          </li>
          <li style={{ marginBottom: 'var(--spacing-md)' }}>
            <h2><a href="/projects/">Shovel-Ready Projects</a></h2>
            <p>CAPCOG maintains a database of transportation projects ready for implementation. CAPCOG will provide a detailed guide and technical assistance framework to ensure projects meet federal and state funding standards.</p>
          </li>
          <li style={{ marginBottom: 'var(--spacing-md)' }}>
            <h2><a href="/data-portal/">Regional Data Resources</a></h2>
            <p>CAPCOG operates the Transportation Data Portal, an interactive GIS platform offering insights into Central Texas transportation systems. It includes downloadable datasets for planning and grant applications, with plans for future interactive content.</p>
          </li>
          <li style={{ marginBottom: 'var(--spacing-md)' }}>
            <h2><a href="/reports/">Transportation Studies & Plans</a></h2>
            <p>CAPCOG produces reports such as the Rural County Network Studies for Blanco, Lee, and Llano Counties. These studies offer mobility assessments, safety analyses, and funding strategies to address regional needs.</p>
          </li>
          <li style={{ marginBottom: 'var(--spacing-md)' }}>
            <h2><a href="/newsletter/">Newsletter</a></h2>
            <p>CAPCOG publishes a monthly newsletter to keep stakeholders informed of transportation developments, funding opportunities, and deadlines. The newsletter provides actionable information for local governments.</p>
          </li>
          <li style={{ marginBottom: 'var(--spacing-md)' }}>
            <h2><a href="/contact/">Contact Information</a></h2>
            <p>CAPCOG staff offer direct support to local governments on transportation planning and resource utilization. Contact CAPCOG for assistance with grants, projects, or data tools.</p>
          </li>
        </ul>
      </Layout>
    </>
  )
}
