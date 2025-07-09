import Head from "next/head";
import Layout from "@/components/Layout";
import ReportSegment from "@/components/ReportSegment";

export default function DataPortalPage() {
  return (
    <>
      <Head>
        <title>Transportation Data Portal - Moving Central Texas</title>
        <meta
          name="description"
          content="CAPCOG’s transportation planning resource for Central Texas: grants, projects, data, studies, and updates"
        />
        <meta
          property="og:title"
          content="Transportation Data Portal - Moving Central Texas"
        />
        <meta
          property="og:description"
          content="Explore transportation data layers and crash hotspots in Central Texas with CAPCOG’s interactive Data Portal."
        />
        <meta
          property="og:url"
          content="https://movingcentraltexas.org/data-portal/"
        />
        <link
          rel="icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
      </Head>

      <Layout>
        <header>
          <h1>Transportation Data Portal</h1>
          <p>
            The Transportation Data Portal provides curated datasets, maps, and
            summaries to support local planning efforts. While other pages like{" "}
            <a href="/crash-analytics/">Crash Data</a> offer interactive tools
            that can be tailored to individual jurisdictions, this portal
            presents a regional overview with high-level trends, cleaned data,
            and CAPCOG’s analysis to inform decision-making.
          </p>
        </header>

        <section className="report crash-report">
          <h2>Crash Data Report: CAPCOG Region, 2015–2024</h2>

          <ReportSegment title="Overview">
            <p>
              This report analyzes motor vehicle crashes in the 10-county CAPCOG
              region—Bastrop, Blanco, Burnet, Caldwell, Fayette, Hays, Lee,
              Llano, Travis, and Williamson—from 2015 to 2024. Data is sourced
              from the Texas Department of Transportation (TxDOT) via formal
              request; see{" "}
              <a
                href="https://www.dot.state.tx.us/apps-cg/crash_records/form.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                TxDOT Crash Records Request
              </a>
              .
            </p>
          </ReportSegment>

          <ReportSegment title="The Stakes">
            <p>From 2015 to 2024, the region recorded:</p>
            <ul>
              <li>3,013 fatalities</li>
              <li>14,042 serious injuries</li>
              <li>877,870 total crashes</li>
            </ul>
            <p>
              These preventable losses underscore the need for targeted safety
              improvements in road design and speed management.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Crash Hotspots: Urban Centers Dominate"
            image={{
              src: "/assets/images/crash-hotspots.png",
              alt: "Bar Chart: Average Annual Crashes by County, 2015–2024",
            }}
            caption="Travis and Williamson lead in crash volume."
          >
            <p>
              Urban counties bear the brunt of crash volume: Travis averages
              46,896 crashes annually, Williamson 20,852. Rural Bastrop, at
              4,503, shows a notable burden for its size. Region-wide, crashes
              dropped to 7,141.0 per county in 2020 from a pre-2020 average of
              9,199.7, rebounding to 8,890.6 post-2020, reflecting
              pandemic-driven shifts in mobility.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Crash Severity: Rising Fatal Outcomes"
            image={{
              src: "/assets/images/injuries-by-severity.png",
              alt: "Stacked Bar Chart: Total Incidents by Severity, 2015–2024",
            }}
            caption="Non-injuries dominate, but fatalities rise."
          >
            <p>
              Most crashes (661,087) are non-injurious, but severe outcomes are
              increasing. Fatalities rose from 27.6 per county pre-2020 to 33.2
              post-2020, and serious injuries climbed from 136.0 to 153.4.
              Despite fewer crashes in 2020 (7,141.0), higher speeds on emptier
              roads likely drove deadlier outcomes, a trend that persists
              post-pandemic.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Fatalities Over Time: Rural Spikes Emerge"
            image={{
              src: "/assets/images/fatalities-over-time.png",
              alt: "Line Chart: Fatalities by County, 2015–2024",
            }}
            caption="Travis peaks in 2022; rural spikes in 2023–2024."
          >
            <p>
              Fatalities dipped to 295 in 2020, then surged to 366 in 2022,
              stabilizing at 324 in 2024. Travis and Williamson show consistent
              high counts, but rural Bastrop spiked to 33 deaths in 2023 and 24
              in 2024, signaling emerging risks possibly tied to rural road
              conditions or driver behavior.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Severity by County: Rural Roads Deadlier"
            image={{
              src: "/assets/images/severity-heatmap.png",
              alt: "Heatmap: Crash Severity Score per 100K by County, 2015–2024",
            }}
            caption="Severity = Fatalities × 5 + Serious × 3 + Minor × 2 + Possible × 1, per 100K."
          >
            <p>
              Rural counties face higher per-capita severity: Blanco hit 3,165
              per 100K in 2024, Bastrop 2,037.7 in 2023, and Fayette 1,768.0 in
              2024, compared to Travis’s 1,305.1. Higher speeds, limited
              infrastructure, and slower EMS response in rural areas amplify
              crash severity.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Injurious Crashes per Capita: Rural Risk Grows"
            image={{
              src: "/assets/images/injurious-per-100k.png",
              alt: "Line Chart: Injurious Crashes per 100K by County, 2015–2024",
            }}
            caption="Injurious = Fatalities + Serious + Minor Injuries, per 100K."
          >
            <p>
              Rural injurious crash rates are climbing: Blanco reached 1,081 per
              100K in 2024, Fayette 605.7, and Bastrop 517.4, far exceeding
              Travis’s 419.6. Urban areas have lower rates but higher raw totals
              due to volume, while rural trends suggest worsening conditions
              over the decade.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Fatalities vs. Serious Injuries: Linked Risks"
            image={{
              src: "/assets/images/fatalities-vs-serious.png",
              alt: "Scatter Plot: Fatalities vs. Serious Injuries per 100K by County, 2015–2024",
            }}
            caption="Dot size reflects population; colors indicate counties."
          >
            <p>
              Fatalities and serious injuries correlate strongly: Fayette leads
              with 552.5 fatalities and 1,342.3 serious injuries per 100K,
              followed by Blanco at 536.3 and 2,171.6, while Travis logs 108.8
              and 541.1. Rural areas face higher per-capita risks, straining
              limited emergency resources.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Fatalities per Capita: Rural Crisis"
            image={{
              src: "/assets/images/fatalities-per-capita.png",
              alt: "Bar Chart: Fatalities per 100,000 Residents, Avg. 2015–2024",
            }}
            caption="Based on 2020 Census populations."
          >
            <p>
              Rural fatality rates dwarf urban ones: Fayette averages 55.2 per
              100K, Blanco 53.6, and Lee 38.9, compared to Travis’s 10.9 and
              Williamson’s 7.6. Rural residents face a far higher risk per
              person, highlighting the need for targeted safety measures.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Urban vs. Rural Risk: A Clear Divide"
            image={{
              src: "/assets/images/urban-rural-injurious.png",
              alt: "Stacked Bar Chart: Injurious Crashes per 100K by Urbanization, Avg. 2015–2024",
            }}
            caption="Injurious crashes per 100K by urbanization category."
          >
            <p>
              Rural areas (&lt;25,000) average 43.3 fatalities and 139.9 serious
              injuries per 100K, compared to urban (&gt;500,000) at 9.8 and
              49.5. Urban-rural (25,000–500,000) counties fall in between at
              19.1 and 83.0. Rural serious injuries rose from 122.1 pre-2020 to
              159.3 post-2020, underscoring the need for rural-focused
              interventions.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Crash Rate Volatility: Uneven Trends"
            image={{
              src: "/assets/images/yearly-crash-change.png",
              alt: "Line Chart: Year-over-Year % Change in Total Crashes per 100K, 2016–2024",
            }}
            caption="Year-over-year percent change in total crashes per 100K."
          >
            <p>
              Crash rates fluctuated widely: Travis dropped 28.2% in 2020, while
              Lee surged 43.8% in 2021. Recent trends show rural declines (Lee
              -13.3% in 2024) and urban-rural increases (Bastrop 12.8% in 2024),
              reflecting uneven recovery and varying local conditions.
            </p>
          </ReportSegment>

          <ReportSegment
            title="Population vs. Crash Risk: Size Matters Less"
            image={{
              src: "/assets/images/injurious-vs-population.png",
              alt: "Scatter Plot: Injurious Crashes per 100K vs. Population by County, 2015–2024",
            }}
            caption="Colors: Urban (green), Urban-Rural (orange), Rural (purple)."
          >
            <p>
              Population and injurious crashes per 100K show a negative
              correlation (-0.35). Blanco (11,374 residents) faces 7,262.2 per
              100K, while Travis (1,290,188) logs 4,285.9. Smaller counties bear
              higher per-capita risks, likely due to rural road hazards.
            </p>
          </ReportSegment>

          <ReportSegment title="The Bottom Line">
            <p>
              Urban counties like Travis (46,896 crashes/year) face high crash
              volumes, while rural areas like Blanco (7,262.2 injurious crashes
              per 100K) and Fayette (55.2 fatalities per 100K) bear a heavier
              per-capita burden. Fatalities (33.2 post-2020) and serious
              injuries (153.4 post-2020) are rising, with volatility—Lee’s 43.8%
              spike in 2021, Travis’s -28.2% drop in 2020—highlighting uneven
              risks. Central Texas must address urban scale, rural severity, and
              volatility to achieve zero deaths.
            </p>
          </ReportSegment>
        </section>
      </Layout>
    </>
  );
}
