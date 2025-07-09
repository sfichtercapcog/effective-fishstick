import Head from 'next/head'
import Layout from '@/components/Layout'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About - Moving Central Texas</title>
        <meta name="description" content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates" />
        <meta property="og:title" content="About - Moving Central Texas" />
        <meta property="og:description" content="Learn about CAPCOG’s mission in transportation planning and the Moving Central Texas portal." />
        <meta property="og:url" content="https://movingcentraltexas.org/about/" />
        <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </Head>

      <Layout>
        <h1>About CAPCOG</h1>

        <p>
          CAPCOG is a regional organization serving Central Texas, coordinating efforts across 10 counties to improve quality of life through transportation, emergency services, economic development, and more. In transportation, CAPCOG facilitates planning, secures funding, and provides data-driven solutions to enhance mobility, safety, and sustainability for urban and rural communities alike.
        </p>

        <p>
          Moving Central Texas (MCT) acts as a dynamic portal for CAPCOG’s transportation initiatives.
          Due to practical considerations—such as the need for rapid updates when grants are announced
          and direct access to real-time data—this MCT operates separately from the main CAPCOG
          website (<a href="https://www.capcog.org/">capcog.org</a>), serving as a focused resource
          for transportation planning stakeholders.
        </p>

        <h2>Our Mission</h2>
        <p>
          CAPCOG’s transportation mission is to bridge gaps in infrastructure and funding. Through
          collaboration with local governments, regional partners, and state agencies, CAPCOG delivers
          studies, tools, and resources to address transportation needs and promote equitable access
          across Central Texas.
        </p>

        <h2>Our Team</h2>
        <p>
          CAPCOG’s transportation team oversees the Capital Area Regional Transportation Planning
          Organization (CARTPO) and manages key resources like the Transportation Data Portal and
          Shovel Ready Projects Guide. Our work ensures Central Texas communities have the support
          they need to plan and fund impactful projects.
        </p>
      </Layout>
    </>
  )
}