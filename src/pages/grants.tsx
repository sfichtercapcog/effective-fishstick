import Head from 'next/head'
import { useEffect } from 'react'
import Layout from '@/components/Layout'

export default function GrantsPage() {
  useEffect(() => {
    // Import and run the same vanilla JS you had in /assets/js/grants.js
    const script = document.createElement('script')
    script.src = '/assets/js/grants.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>Transportation Grant Finder - Moving Central Texas</title>
        <meta name="description" content="CAPCOG’s Transportation Grant Finder for Central Texas—search and filter funding opportunities" />
        <meta name="keywords" content="grants, transportation, funding, Central Texas, CAPCOG" />
        <meta property="og:title" content="Transportation Grant Finder - Moving Central Texas" />
        <meta property="og:description" content="Submit transportation projects for CAPCOG review and view approved shovel-ready initiatives." />
        <meta property="og:image" content="/assets/images/central-texas-hero.jpg" />
        <meta property="og:url" content="https://movingcentraltexas.org/grants/" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </Head>

      <h1>Transportation Grant Finder</h1>

      <details className="disclaimer">
        <summary><strong>Notice:</strong> Under Development</summary>
        <p>Application hour estimates are only approximations and not a guarantee.</p>
      </details>

      <p>CAPCOG provides this searchable database to identify and filter transportation funding opportunities tailored to Central Texas communities, including grant types, funding sources, award amounts, and application details.</p>

      <section className="dashboard">
        <button className="toggle-filters" id="toggleFiltersBtn" type="button" aria-expanded="true" aria-controls="filterControls">
          <i className="fas fa-filter"></i> Toggle Filters
        </button>

        <div className="controls" id="filterControls">
          {/* All your form/filter fields remain untouched here */}
          <div className="filter-row">
            {/* ...checkboxes... */}
            <div className="filter-group checkboxes">
              <label>Grant Type</label>
              <div className="checkbox-group" id="typeFilter" role="group" aria-label="Filter by grant type"></div>
            </div>
            <div className="filter-group checkboxes">
              <label>Funding Source</label>
              <div className="checkbox-group" id="fundingFilter" role="group" aria-label="Filter by funding source"></div>
            </div>
          </div>

          <div className="filter-column">
            {/* ...input controls... */}
            <div className="filter-group">
              <label htmlFor="searchInput">Search Grants</label>
              <input type="text" id="searchInput" list="grantSuggestions" placeholder="e.g., grant name or keyword" />
            </div>
            <div className="filter-group">
              <label htmlFor="communityFilter">Community</label>
              <select id="communityFilter" />
            </div>
            <div className="filter-group">
              <label htmlFor="targetAward">Target Award Amount</label>
              <input type="number" id="targetAward" min={0} step={1000} placeholder="e.g., 200000" />
            </div>
            <div className="filter-group">
              <label htmlFor="maxHours">Max Application Hours</label>
              <input type="number" id="maxHours" min={0} step={1} placeholder="e.g., 20" />
            </div>
            <div className="filter-group">
              <label htmlFor="deadlineDirection">Deadline Direction</label>
              <select id="deadlineDirection" />
            </div>
            <div className="filter-group">
              <label htmlFor="deadline">Application Deadline</label>
              <input type="date" id="deadline" />
            </div>

            {/* Sort options */}
            <div className="sort-section">
              <div className="filter-group sort-group-wrapper">
                <label>Primary Sort</label>
                <div className="sort-group">
                  <select id="sort1Attr"><option value="">None</option></select>
                  <select id="sort1Dir">
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                  </select>
                </div>
              </div>
              <div className="filter-group sort-group-wrapper">
                <label>Secondary Sort</label>
                <div className="sort-group">
                  <select id="sort2Attr"><option value="">None</option></select>
                  <select id="sort2Dir">
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="filter-actions">
            <button className="btn" id="applyFilters" type="button">Apply Filters</button>
            <button className="btn" id="resetFilters" type="button">Reset Filters</button>
            <button className="btn" id="helpBtn" type="button" title="Learn how to use the filters">Help</button>
          </div>
          <div id="filterSummary">Showing 0 grants</div>
        </div>

        <div id="grantsContainer" role="region" aria-live="polite" />
      </section>

      {/* Modals and Datalist */}
      <datalist id="grantSuggestions" />
      <div id="grantModal" className="modal">
        <div className="modal-content">
          <button id="closeGrantModal" className="close" type="button" aria-label="Close modal">×</button>
          <h2 id="modalTitle" />
          <div id="modalDetails" />
          <div className="modal-buttons">
            <button className="btn" id="favoriteBtn" type="button">Add to Favorites</button>
            <button className="btn" id="copyDetailsBtn" type="button">Copy Details</button>
          </div>
        </div>
      </div>

      <div id="helpModal" className="modal">
        <div className="modal-content">
          <button id="closeHelpModal" className="close" type="button" aria-label="Close help modal">×</button>
          <h2>How to Use the Grant Finder</h2>
          <div id="helpDetails">
            <p><strong>Grant Type:</strong> Filter by category (e.g., Infrastructure, Planning).</p>
            <p><strong>Funding Source:</strong> Filter by origin (e.g., Federal, State).</p>
            <p><strong>Search Grants:</strong> Use keywords to search all grant fields.</p>
            <p><strong>Community:</strong> Filter by eligible community.</p>
            <p><strong>Target Award Amount:</strong> Find grants within a specified range.</p>
            <p><strong>Max Application Hours:</strong> Filter by estimated application effort.</p>
            <p><strong>Deadline Direction:</strong> Select 'On/Before' or 'On/After' for deadlines.</p>
            <p><strong>Application Deadline:</strong> Filter by specific dates.</p>
            <p><strong>Sorting:</strong> Sort by any field, ascending or descending.</p>
            <p><strong>Favorites:</strong> Save grants using the star icon on cards.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}