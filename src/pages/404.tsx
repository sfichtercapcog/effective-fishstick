import Head from 'next/head'
import Layout from '@/components/Layout'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Moving Central Texas</title>
        <meta name="description" content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates" />
        <meta property="og:title" content="Page Not Found - Moving Central Texas" />
        <meta property="og:description" content="The page you are looking for cannot be found. Return to Moving Central Texas for transportation planning resources." />
        <meta property="og:url" content="https://movingcentraltexas.org/" />
        <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </Head>

      <Layout>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for does not exist! Please check the URL or return to the{' '}
          <a href="/">home page</a>.
        </p>
      </Layout>
    </>
  )
}