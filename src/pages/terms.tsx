import Head from 'next/head'
import Layout from '@/components/Layout'

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Use - Moving Central Texas</title>
        <meta name="description" content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates" />
        <meta property="og:title" content="Terms of Use - Moving Central Texas" />
        <meta property="og:description" content="Terms of use for the Moving Central Texas website, governing access to transportation resources and data." />
        <meta property="og:url" content="https://movingcentraltexas.org/terms/" />
        <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </Head>

      <Layout>
        <h1>Terms of Use</h1>
        <p>
          CAPCOG offers Moving Central Texas (MCT) as an open resource to support transportation
          planning in Central Texas. These Terms of Use ensure that all users—government entities,
          organizations, and the public—can access and utilize our materials responsibly.
        </p>

        <h2>Usage Guidelines</h2>
        <p>
          All content, including reports, GIS data, and scripts, is provided for transportation
          planning purposes. CAPCOG encourages use and sharing, particularly among government
          entities, to reduce redundancy and enhance collaboration. MCT&apos;s source code will be
          available on GitHub upon full release under an open-source license. Users may reproduce or
          adapt materials freely unless restricted by law or explicitly noted (e.g., third-party
          data constraints).
        </p>

        <h2>Liability</h2>
        <p>
          CAPCOG strives to ensure the accuracy and reliability of all resources. However, CAPCOG is
          not liable for errors, omissions, or interruptions, particularly during development. Users
          accept content as-is.
        </p>
      </Layout>
    </>
  )
}
