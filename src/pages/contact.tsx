import Layout from '@/components/Layout';

export default function ContactPage() {
  return (
    <Layout>
      <main className="container">
        <h1>Contact Us</h1>

        <p>
          CAPCOG provides direct support to local governments across Central Texas for transportation planning initiatives. 
          One of CAPCOG’s key transportation activities is the administration of the Capital Area Regional Transportation Planning Organization (CARTPO), 
          ensuring effective regional collaboration across the region.
        </p>

        <h2>Contact Information</h2>
        <p>
          CAPCOG directs inquiries related to Moving Central Texas and transportation more broadly to Simon Fichter, Transportation Planner:
        </p>
        <p>Email: <a href="mailto:sfichter@capcog.org">sfichter@capcog.org</a></p>
        <p>Phone: (512) 916-6197</p>
      </main>
    </Layout>
  );
}