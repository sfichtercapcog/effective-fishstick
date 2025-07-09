import Head from "next/head";
import Layout from "@/components/Layout";
import ZohoForm from "@/components/ZohoForm";

export default function ShovelReadyPage() {
  return (
    <Layout>
      <Head>
        <title>Shovel-Ready Projects - Moving Central Texas</title>
        <meta
          name="description"
          content="CAPCOG’s resource for submitting and reviewing shovel-ready transportation projects in Central Texas."
        />
        <meta
          property="og:title"
          content="Shovel-Ready Projects - Moving Central Texas"
        />
        <meta
          property="og:description"
          content="Submit transportation projects for CAPCOG review and access resources on getting projects shovel-ready."
        />
        <meta
          property="og:image"
          content="/assets/images/central-texas-hero.jpg"
        />
        <meta
          property="og:url"
          content="https://movingcentraltexas.org/shovel-ready/"
        />
        <link
          rel="icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
      </Head>

      <main className="container">
        <h1>Shovel-Ready Projects</h1>

        <p>
          CAPCOG is collecting information on shovel-ready transportation
          projects from across the region. Local governments can submit project
          details using the form below. A project is considered "shovel-ready"
          when design is finalized, permits are obtained, and all that's left is
          securing funding. Sharing this information helps CAPCOG support
          funding efforts and track regional project readiness.
        </p>

        {/* Zoho Form Component */}
        <ZohoForm
          formId="zf_div_tdYatLlhFKiqJFMdfwvzYJbc4YkEqvAyupxM12Iwa7s"
          formSrc="https://forms.zohopublic.com/csimon/form/CAPCOGShovelReadyProjectSubmissionForm/formperma/tdYatLlhFKiqJFMdfwvzYJbc4YkEqvAyupxM12Iwa7s"
        />

        <section
          className="project"
          style={{ textAlign: "center", marginTop: "2rem" }}
        >
          <h2>Submission Guide</h2>
          <p style={{ margin: 0 }}>
            Download the{" "}
            <a
              href="/assets/pdfs/shovel-ready-guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shovel-Ready Project Guide (PDF)
            </a>{" "}
            for steps, timeline examples, and a budget template.
          </p>
        </section>
      </main>
    </Layout>
  );
}
