import Head from 'next/head'
import Layout from '@/components/Layout'

export default function AccessibilityPage() {
  return (
    <>
      <Head>
        <title>Accessibility - Moving Central Texas</title>
        <meta name="description" content="Accessibility policy for the Moving Central Texas website." />
        <meta property="og:title" content="Accessibility - Moving Central Texas" />
        <meta property="og:description" content="Accessibility policy and resources for ensuring an inclusive experience on Moving Central Texas." />
        <meta property="og:url" content="https://movingcentraltexas.org/accessibility/" />
        <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </Head>

      <Layout>
        <h1>Accessibility Statement</h1>

        <p>
          CAPCOG is committed to ensuring digital accessibility for all users, including people with
          disabilities. We are continuously improving the user experience for everyone and applying
          the relevant accessibility standards.
        </p>

        <h2>Our Commitment</h2>
        <p>
          We strive to conform to WCAG 2.1 AA standards where possible. The Moving Central Texas site
          is tested regularly for accessibility issues, and feedback is welcomed to help us improve.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you experience any difficulty accessing content on this site or have suggestions to
          improve accessibility, please contact us at:{' '}
          <a href="mailto:sfichter@capcog.org">sfichter@capcog.org</a>
        </p>
      </Layout>
    </>
  )
}