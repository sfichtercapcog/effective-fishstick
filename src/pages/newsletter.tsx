import Head from "next/head";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import NewsletterEdition from "@/components/NewsletterEdition";

export default function NewsletterPage() {
  useEffect(() => {
    const posts = document.querySelectorAll(".blog-post");
    const showLatestBtn = document.getElementById("show-latest");
    const showAllBtn = document.getElementById("show-all");
    const status = document.getElementById("newsletter-status");

    if (!posts.length || !status || !showAllBtn || !showLatestBtn) return;

    const latestId = posts[0].id.replace("-", " ");
    status.textContent = `Showing Latest Edition Only (${latestId})`;

    showLatestBtn.addEventListener("click", () => {
      posts.forEach((post) => post.classList.remove("active"));
      posts[0].classList.add("active");
      status.textContent = `Showing Latest Edition Only (${latestId})`;
    });

    showAllBtn.addEventListener("click", () => {
      posts.forEach((post) => post.classList.add("active"));
      status.textContent = `Showing All Editions`;
    });
  }, []);

  return (
    <Layout>
      <Head>
        <title>Newsletter - Moving Central Texas</title>
        <meta
          name="description"
          content="Latest news and insights on transportation planning from Moving Central Texas."
        />
      </Head>

      <h1>Newsletter</h1>

      <p>
        CAPCOG publishes <em>Moving Central Texas</em>, a quarterly newsletter
        created to share timely updates on regional transportation. Each edition
        is released the month prior to quarterly CARTPO meetings. The first
        issue was published in April 2025. The newsletter delivers digestible
        information on funding opportunities, project updates, and important
        deadlines for local governments.
      </p>

      <div className="newsletter-filter">
        <button id="show-latest">Show Latest</button>
        <button id="show-all">Show All</button>
      </div>

      <div className="newsletter-status" id="newsletter-status"></div>

      <div id="newsletter-content">
        <NewsletterEdition
          id="April-2025"
          title="Moving Central Texas Newsletter – April 2025"
        >
          <div className="blog-segment">
            <h3>
              Supporting Transportation Planning and Funding Access in Central
              Texas
            </h3>
            <p>
              Welcome to the inaugural issue of CAPCOG’s Moving Central Texas
              Newsletter. This monthly publication provides clear, reliable
              updates on transportation funding opportunities for jurisdictions
              within the TxDOT Austin District. As of April 2025, grant options
              are limited. However, one significant opportunity—the U.S.
              Department of Transportation’s Safe Streets and Roads for All
              (SS4A) program—is currently available and merits consideration.
              Below, we outline the details and assess its relevance for your
              jurisdiction.
            </p>
          </div>

          <div className="blog-segment">
            <h3>
              Featured Funding Opportunity: Safe Streets and Roads for All
              (SS4A)
            </h3>
            <p>
              <strong>Application Deadline:</strong> June 26, 2025
              <br />
              <strong>Program Details:</strong>{" "}
              <a href="https://www.transportation.gov/grants/SS4A">
                www.transportation.gov/grants/SS4A
              </a>
            </p>
            <p>
              The U.S. Department of Transportation (USDOT) has released the
              FY25 Notice of Funding Opportunity (NOFO) for the SS4A program,
              allocating over $982 million to reduce roadway fatalities and
              serious injuries. Two grant types are offered, each with distinct
              purposes and requirements. Below is an overview to help determine
              if this funding aligns with your needs.
            </p>

            <h4>Planning and Demonstration Grants</h4>
            <p>
              <strong>Purpose:</strong> Develop or update a Comprehensive Safety
              Action Plan, conduct supplemental safety planning, or implement
              demonstration projects to address roadway safety issues.
              <br />
              <strong>Funding Range:</strong> $100,000 to $5,000,000
              <br />
              <strong>Eligible Applicants:</strong> Counties, cities, federally
              recognized Tribal governments, or multijurisdictional groups
              (e.g., CAPCOG member entities).
              <br />
              <strong>Priority Applicants:</strong> Rural areas and underserved
              communities, including Areas of Persistent Poverty, with
              identified safety concerns but no existing Action Plan.
              <br />
              <strong>Requirements:</strong> 20% match (in-kind contributions
              permitted); no shovel-ready project or pre-engineering required.
              Application preparation is estimated at 50 staff hours.
              <br />
              <strong>Relevance:</strong> This grant suits all non-CAMPO
              jurisdictions within our region – Blanco, Lee, Llano, and Fayette
              counties, and cities within. All have above average incidences of
              fatal crashes; this grant can fund the creation of a structured
              safety plan to address crashes and prepare for future funding. It
              offers flexibility and a practical starting point. However, CAPCOG
              is applying for a regional plan on behalf of all of these
              counties, so an application from such jurisdictions is not
              necessary.
            </p>

            <h4>Implementation Grants</h4>
            <p>
              <strong>Purpose:</strong> Execute projects or strategies from an
              existing Action Plan, with optional supplemental planning or
              demonstration activities.
              <br />
              <strong>Funding Range:</strong> $2,500,000 to $25,000,000
              <br />
              <strong>Eligible Applicants:</strong> Same as above—counties,
              cities, Tribal governments, or groups—as long as you are covered
              by a recent Comprehensive Safety Action Plan. All jurisdictions
              within CAMPO are thus eligible.
              <br />
              <strong>Priority Applicants:</strong> Rural jurisdictions, high
              crash rates, and projects ready for construction.
              <br />
              <strong>Requirements:</strong> 20% match (in-kind allowed);
              projects must be shovel-ready with pre-engineering completed.
              Application preparation requires approximately 75 staff hours.
              <br />
              <strong>Relevance:</strong> This offers substantial funding but
              requires an Action Plan and ready-to-launch projects. Without that
              preparation, it’s not a viable option at this stage.
            </p>
          </div>

          <div className="blog-segment">
            <h3>Current Grant Landscape</h3>
            <p>
              Transportation funding opportunities are scarce as of April 2025.
              Beyond SS4A, no other programs align with the immediate needs or
              timelines of Central Texas jurisdictions. This scarcity highlights
              the importance of evaluating SS4A carefully—it’s the primary
              option available until additional opportunities arise. CAPCOG will
              monitor and report on developments in future issues.
            </p>
          </div>

          <div className="blog-segment">
            <h3>Application Guidance</h3>
            <p>
              To enhance your SS4A application, focus on data-driven need. Use
              TxDOT crash statistics to identify problem areas, supported by
              specific examples (e.g., “In 2024, three fatalities occurred on a
              two-mile stretch of County Road 15”). Concise, evidence-based
              narratives increase competitiveness. For assistance, contact Simon
              Fichter at{" "}
              <a href="mailto:sfichter@capcog.org">sfichter@capcog.org</a>.
            </p>
          </div>

          <div className="blog-segment">
            <h3>Regional Examples</h3>
            <p>
              Central Texas communities have already begun leveraging Safe
              Streets and Roads for All (SS4A) funding to plan and implement
              life-saving improvements. Recent federal awards include:
            </p>
            <ul>
              <li>
                <strong>City of Austin</strong> — <em>$10.5 million</em> (FY
                2024 Implementation Grant) to deliver on-the-ground safety
                interventions across the city’s Vision Zero High-Injury Network.
              </li>
              <li>
                <strong>Concho Valley Council of Governments</strong> —{" "}
                <em>$1 million</em> (FY 2024 Planning & Demonstration Grant) to
                develop regional strategies for rural road safety.
              </li>
              <li>
                <strong>Town of Rogers</strong> — <em>$124,000</em> (FY 2024
                Planning & Demonstration Grant) to assess local crash trends and
                design targeted low-cost countermeasures.
              </li>
              <li>
                <strong>
                  Capital Area Metropolitan Planning Organization (CAMPO)
                </strong>{" "}
                — <em>$2.32 million</em> (FY 2022 Action Plan Grant) to
                establish a regional safety plan for the Austin-Round
                Rock-Georgetown area.
              </li>
            </ul>
          </div>

          <div className="blog-segment">
            <h3>Upcoming Milestones</h3>
            <p>
              <strong>USDOT Webinars:</strong> Three informational sessions on
              SS4A were held in April 2025 — visit{" "}
              <a href="https://www.transportation.gov/grants/SS4A/webinars">
                transportation.gov/grants/SS4A/webinars
              </a>{" "}
              for recordings.
              <br />
              <strong>May Newsletter:</strong> Updates on SS4A progress and any
              new funding opportunities.
              <br />
              <strong>Grant Finder Tool:</strong> CAPCOG’s searchable grant
              finder has launched, offering tailored information for Central
              Texas governments.
            </p>
            <p>
              <strong>Contact:</strong> Simon Fichter, Transportation Planner,{" "}
              <a href="mailto:sfichter@capcog.org">sfichter@capcog.org</a>
            </p>
          </div>
        </NewsletterEdition>
      </div>
    </Layout>
  );
}
