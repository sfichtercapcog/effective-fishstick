import Head from 'next/head'
import Layout from '@/components/Layout'
import { useEffect } from 'react'

export default function ProjectsPage() {
  useEffect(() => {
    const iframeId = 'zf_div_JEKla5wwMoxFY5kmIMMrhxi76eFh1Fue1u5JSoVx4Y0'

    const f = document.createElement('iframe')
    f.src = 'https://forms.zohopublic.com/sfichtercap1/form/CAPCOGShovelReadyProjectSubmissionForm/formperma/JEKla5wwMoxFY5kmIMMrhxi76eFh1Fue1u5JSoVx4Y0?zf_rszfm=1'
    f.style.border = 'none'
    f.style.height = '3412px'
    f.style.width = '100%'
    f.style.transition = 'all 0.5s ease'
    f.setAttribute('aria-label', 'CAPCOG Shovel-Ready Project Submission Form')

    const container = document.getElementById(iframeId)
    if (container) container.appendChild(f)

    const handler = (event: MessageEvent) => {
      if (typeof event.data !== 'string') return
      const zf_ifrm_data = event.data.split('|')
      if (zf_ifrm_data.length === 2 || zf_ifrm_data.length === 3) {
        const zf_perma = zf_ifrm_data[0]
        const newHeight = `${parseInt(zf_ifrm_data[1], 10) + 15}px`
        const iframe = container?.getElementsByTagName('iframe')[0]
        if (
          iframe &&
          iframe.src.includes('formperma') &&
          iframe.src.includes(zf_perma) &&
          iframe.style.height !== newHeight
        ) {
          if (zf_ifrm_data.length === 3) {
            iframe.scrollIntoView()
            setTimeout(() => {
              iframe.style.height = newHeight
            }, 500)
          } else {
            iframe.style.height = newHeight
          }
        }
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <Layout>
      <Head>
        <title>Shovel-Ready Projects - Moving Central Texas</title>
        <meta name="description" content="CAPCOG’s resource for submitting and reviewing shovel-ready transportation projects in Central Texas." />
        <meta property="og:title" content="Shovel-Ready Projects - Moving Central Texas" />
        <meta property="og:description" content="Submit transportation projects for CAPCOG review and view approved shovel-ready initiatives." />
        <meta property="og:image" content="/assets/images/central-texas-hero.jpg" />
        <meta property="og:url" content="https://movingcentraltexas.org/projects/" />
        <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </Head>

      <h1>Shovel-Ready Projects</h1>
      <p>CAPCOG plans to compile shovel-ready transportation projects for Central Texas. Local governments can submit project details using the form below. A project is considered "shovel-ready" when design is finalized, permits are obtained, and all that's left is securing funding. This database will help agencies access potential funding more quickly.</p>

      {/* Zoho Form Embed Container */}
      <div id="zf_div_JEKla5wwMoxFY5kmIMMrhxi76eFh1Fue1u5JSoVx4Y0" />

      <section className="project" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Submission Guide</h2>
        <p style={{ margin: 0 }}>
          Download the <a href="/assets/pdfs/shovel-ready-guide.pdf" target="_blank" rel="noopener noreferrer">Shovel-Ready Project Guide (PDF)</a> for steps, timeline examples, and a budget template.
        </p>
      </section>
    </Layout>
  )
}