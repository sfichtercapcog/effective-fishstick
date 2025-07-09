"use client";

import dynamic from "next/dynamic";
import Layout from "@/components/Layout";

const QuietZonesMap = dynamic(() => import("@/components/QuietZonesMap"), {
  ssr: false,
});

export default function QuietZonesPage() {
  return (
    <Layout>
      <h1>Railroad Quiet Zones in the CAPCOG Region</h1>

      <section>
        <p>
          A Quiet Zone is a section of railroad track where train horns are not
          routinely sounded at public highway-rail grade crossings. These zones
          must meet specific safety standards set by the
          <a
            href="https://railroads.dot.gov/railroad-safety/divisions/crossing-safety-and-trespass-prevention/train-horn-rulequiet-zones"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Federal Railroad Administration (FRA)
          </a>
          .
        </p>

        <p>
          CAPCOG maintains this map to visualize where Quiet Zones exist within
          the 10-county CAPCOG region. However, CAPCOG does not administer Quiet
          Zones and is not involved in their formal approval, enforcement, or
          compliance.
        </p>

        <p>
          The information shown here is a filtered subset of the FRA’s Crossing
          Inventory (Form 71) dataset. It includes only public and private
          highway-rail crossings that are part of a designated Quiet Zone, based
          on the presence of a Quiet Zone ID.
        </p>
      </section>

      <hr style={{ margin: "3rem 0" }} />

      <section>
        <h2 style={{ marginBottom: "1rem" }}>
          Map of the CAPCOG Region's Quiet Zone Crossings
        </h2>
        <QuietZonesMap />
      </section>

      <hr style={{ margin: "3rem 0" }} />

      <section>
        <h2>Understanding Quiet Zones</h2>
        <p>
          Quiet Zones are regulated by the FRA under federal rule 49 CFR Part
          222. Local governments—not railroads— are responsible for initiating
          and maintaining a Quiet Zone designation. Establishing a Quiet Zone
          typically requires coordination among city or county officials, TxDOT
          (if applicable), and railroads.
        </p>
      </section>

      <section>
        <h3>What’s Required to Establish a Quiet Zone?</h3>
        <ul>
          <li>
            The zone must be at least ½ mile long and include one or more public
            crossings.
          </li>
          <li>
            All public crossings must meet strict safety criteria or pass a risk
            assessment.
          </li>
          <li>
            A diagnostic inspection must be conducted by FRA, railroads, and
            local stakeholders.
          </li>
          <li>
            Formal notices must be submitted to the FRA (Notice of Intent and
            Notice of Establishment).
          </li>
        </ul>
      </section>

      <section>
        <h3>Ongoing Responsibilities for Local Governments</h3>
        <ul>
          <li>
            Maintain infrastructure such as gates, medians, signs, and barriers.
          </li>
          <li>
            Submit periodic updates to the FRA (every 2.5 to 5 years, depending
            on safety measures).
          </li>
          <li>
            Monitor risk using the Quiet Zone Risk Index (QZRI) to ensure the
            zone remains compliant.
          </li>
        </ul>
      </section>

      <section>
        <h3>Why Quiet Zones Can Be Revoked</h3>
        <ul>
          <li>
            Increased train or vehicle traffic pushes the QZRI above the
            national threshold.
          </li>
          <li>
            Required infrastructure falls into disrepair and is not fixed in a
            timely manner.
          </li>
          <li>
            Nearby road improvements alter traffic flow and increase crossing
            risks.
          </li>
        </ul>
      </section>

      <section>
        <h2>CAPCOG’s Role</h2>
        <ul>
          <li>
            <strong>Support & Outreach:</strong> Helping cities and counties
            understand Quiet Zone obligations and procedures.
          </li>
          <li>
            <strong>Monitoring Assistance:</strong> Offering technical help in
            reviewing risk conditions or safety measures.
          </li>
          <li>
            <strong>Planning Coordination:</strong> Advising on infrastructure
            changes that may affect crossings.
          </li>
        </ul>
        <p>
          CAPCOG does not regulate or approve Quiet Zones, but serves as a
          regional resource for information, best practices, and coordination
          support.
        </p>
      </section>
    </Layout>
  );
}
