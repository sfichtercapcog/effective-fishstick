import Head from 'next/head'
import Layout from '@/components/Layout'

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - Moving Central Texas</title>
        <meta name="description" content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates" />
        <meta property="og:title" content="Privacy Policy - Moving Central Texas" />
        <meta property="og:description" content="Privacy policy for Moving Central Texas, detailing how we protect your personal information." />
        <meta property="og:url" content="https://movingcentraltexas.org/privacy/" />
        <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </Head>

      <h1>Privacy Policy</h1>

      <p>CAPCOG is committed to protecting the privacy of users on Moving Central Texas (MCT). This policy outlines how personal information is handled to ensure transparency and trust.</p>

      <h2>Data Collection</h2>
      <p>CAPCOG does not collect personal information on MCT unless it is voluntarily provided through forms, such as contact inquiries or project submissions. No cookies or tracking technologies are used on Moving Central Texas. Data collection is limited to what users explicitly submit.</p>

      <h2>Data Usage</h2>
      <p>Information submitted via forms, such as names or email addresses, is used solely for its intended purpose—responding to inquiries, processing project submissions, or distributing the newsletter if requested. CAPCOG does not share this information with third parties unless required by law.</p>
    </Layout>
  )
}