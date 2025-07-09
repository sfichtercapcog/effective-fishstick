import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";

// TypeScript interfaces
interface EligiblePopulation {
  min: number;
  max?: number;
}

interface Grant {
  grantId: string;
  [key: string]: any;
  "Grant Name"?: string;
  "Type of Grant"?: string;
  "Funding Source"?: string;
  "Minimum Grant Award"?: number;
  "Maximum Grant Award"?: number;
  "Application Deadline"?: string;
  "Match Requirements"?: number | string;
  "Estimated Application Hours"?: number;
  "Eligible Populations"?: EligiblePopulation;
  "LMI Requirement"?: number;
  "Eligible Jurisdiction Type"?: string;
}

interface Community {
  name: string;
  jurisdictionType: string;
  population: number;
  lmiPercentage: number;
}

interface FilterConfig {
  textSearch: string;
  filters: {
    "Type of Grant": string[];
    "Funding Source": string[];
    "Target Award Amount": number | null;
    "Application Deadline": Date | null;
    "Deadline Direction": "onOrBefore" | "onOrAfter";
    "Max Application Hours": number | null;
    Community: string | null;
  };
  sort: Array<{ attr: string | null; direction: "ascending" | "descending" }>;
}

const GrantsManager: React.FC = () => {
  // State management
  const [allGrants, setAllGrants] = useState<Grant[]>([]);
  const [attributes, setAttributes] = useState<string[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    textSearch: "",
    filters: {
      "Type of Grant": ["All"],
      "Funding Source": ["All"],
      "Target Award Amount": null,
      "Application Deadline": null,
      "Deadline Direction": "onOrBefore",
      "Max Application Hours": null,
      Community: null,
    },
    sort: [
      { attr: "Grant Name", direction: "ascending" },
      { attr: null, direction: "ascending" },
    ],
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalGrantId, setModalGrantId] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [filterCollapsed, setFilterCollapsed] = useState<boolean>(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const targetAwardRef = useRef<HTMLInputElement>(null);
  const maxHoursRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const deadlineDirectionRef = useRef<HTMLSelectElement>(null);
  const communityFilterRef = useRef<HTMLSelectElement>(null);
  const sort1AttrRef = useRef<HTMLSelectElement>(null);
  const sort1DirRef = useRef<HTMLSelectElement>(null);
  const sort2AttrRef = useRef<HTMLSelectElement>(null);
  const sort2DirRef = useRef<HTMLSelectElement>(null);

  // Custom debounce hook
  const useDebounce = (callback: () => void, delay: number) => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(callback, delay);
    };
  };

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      const savedConfig = localStorage.getItem("filterConfig");
      if (savedConfig) {
        const parsedConfig: FilterConfig = JSON.parse(savedConfig);
        setFilterConfig({
          ...parsedConfig,
          filters: {
            ...parsedConfig.filters,
            "Type of Grant": parsedConfig.filters["Type of Grant"]?.length
              ? parsedConfig.filters["Type of Grant"]
              : ["All"],
            "Funding Source": parsedConfig.filters["Funding Source"]?.length
              ? parsedConfig.filters["Funding Source"]
              : ["All"],
            "Deadline Direction":
              parsedConfig.filters["Deadline Direction"] || "onOrBefore",
          },
          sort: [
            parsedConfig.sort[0]?.attr
              ? parsedConfig.sort[0]
              : { attr: "Grant Name", direction: "ascending" },
            parsedConfig.sort[1] || { attr: null, direction: "ascending" },
          ],
        });
      }
    } catch (err: unknown) {
      console.error("Failed to load saved data:", err);
    }
  };

  // Save filterConfig and favorites to localStorage
  const saveConfig = () => {
    try {
      localStorage.setItem("filterConfig", JSON.stringify(filterConfig));
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (err: unknown) {
      console.error("Failed to save configuration:", err);
      alert("Could not save configuration.");
    }
  };

  // Fetch grants and communities
  const loadGrants = async () => {
    setLoading(true);
    try {
      const [grantsResponse, communitiesResponse] = await Promise.all([
        fetch("/assets/json/grants.json"),
        fetch("/assets/json/communities.json"),
      ]);
      if (!grantsResponse.ok)
        throw new Error(
          `HTTP error loading grants! status: ${grantsResponse.status}`
        );
      if (!communitiesResponse.ok)
        throw new Error(
          `HTTP error loading communities! status: ${communitiesResponse.status}`
        );
      const grantsData: Grant[] = await grantsResponse.json();
      const communitiesData: Community[] = await communitiesResponse.json();
      if (
        !Array.isArray(grantsData) ||
        !grantsData.length ||
        !Array.isArray(communitiesData) ||
        !communitiesData.length
      ) {
        throw new Error("No grants or communities available.");
      }
      setAllGrants(grantsData);
      setCommunities(communitiesData);
      setAttributes(Object.keys(grantsData[0]).filter((k) => k !== "grantId"));
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error loading data:", err);
      setError(`Failed to load data: ${errorMessage}. Please try again later.`);
      setLoading(false);
    }
  };

  // Parse date string to Date object
  const parseDate = (dateStr: string | undefined): Date | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Fuzzy search for grants
  const fuzzySearch = (grant: Grant, term: string): boolean => {
    if (!term) return true;
    return attributes.some((attr) =>
      (grant[attr] ?? "").toString().toLowerCase().includes(term.toLowerCase())
    );
  };

  // Apply community filter
  const applyCommunityFilter = (grant: Grant): boolean => {
    const selectedCommunityName = filterConfig.filters["Community"];
    if (!selectedCommunityName) return true;
    const community = communities.find(
      (c: Community) => c.name === selectedCommunityName
    );
    if (!community) return false;
    const populationMatch =
      !grant["Eligible Populations"] ||
      (community.population >= (grant["Eligible Populations"].min ?? 0) &&
        community.population <=
          (grant["Eligible Populations"].max ?? Infinity));
    const lmiMatch =
      !grant["LMI Requirement"] ||
      community.lmiPercentage >= (grant["LMI Requirement"] ?? 0);
    const jurisdictionMatch =
      !grant["Eligible Jurisdiction Type"] ||
      grant["Eligible Jurisdiction Type"].toLowerCase() === "all" ||
      grant["Eligible Jurisdiction Type"].toLowerCase() ===
        community.jurisdictionType.toLowerCase();
    return populationMatch && lmiMatch && jurisdictionMatch;
  };

  // Filter and sort grants
  const getFilteredGrants = (): Grant[] => {
    let filteredGrants = allGrants;
    if (!filterCollapsed) {
      filteredGrants = allGrants.filter((grant) => {
        const textMatch = fuzzySearch(grant, filterConfig.textSearch);
        const typeMatch =
          !filterConfig.filters["Type of Grant"].length ||
          filterConfig.filters["Type of Grant"].includes("All") ||
          filterConfig.filters["Type of Grant"].includes(
            grant["Type of Grant"] ?? ""
          );
        const fundingMatch =
          !filterConfig.filters["Funding Source"].length ||
          filterConfig.filters["Funding Source"].includes("All") ||
          filterConfig.filters["Funding Source"].includes(
            grant["Funding Source"] ?? ""
          );
        const awardMatch =
          !filterConfig.filters["Target Award Amount"] ||
          ((grant["Minimum Grant Award"] ?? 0) <=
            filterConfig.filters["Target Award Amount"] &&
            (grant["Maximum Grant Award"] ?? 0) >=
              filterConfig.filters["Target Award Amount"]);
        const deadlineMatch = (() => {
          const grantDeadline = parseDate(grant["Application Deadline"]);
          const filterDeadline = filterConfig.filters["Application Deadline"];
          if (!filterDeadline || grant["Application Deadline"] === "Rolling")
            return true;
          if (!grantDeadline) return false;
          return filterConfig.filters["Deadline Direction"] === "onOrBefore"
            ? grantDeadline <= filterDeadline
            : grantDeadline >= filterDeadline;
        })();
        const hoursMatch =
          !filterConfig.filters["Max Application Hours"] ||
          (grant["Estimated Application Hours"] ?? 0) <=
            filterConfig.filters["Max Application Hours"];
        const communityMatch = applyCommunityFilter(grant);
        return (
          textMatch &&
          typeMatch &&
          fundingMatch &&
          awardMatch &&
          deadlineMatch &&
          hoursMatch &&
          communityMatch
        );
      });
    }

    filteredGrants.sort((a, b) => {
      for (let { attr, direction } of filterConfig.sort.filter((s) => s.attr)) {
        const attrKey = attr as string; // Assert attr is not null
        const valA =
          attrKey === "Application Deadline" && a[attrKey] === "Rolling"
            ? "9999-12-31"
            : a[attrKey] ?? "";
        const valB =
          attrKey === "Application Deadline" && b[attrKey] === "Rolling"
            ? "9999-12-31"
            : b[attrKey] ?? "";
        let comparison = 0;
        if (attrKey === "Application Deadline") {
          const dateA = parseDate(valA as string);
          const dateB = parseDate(valB as string);
          comparison =
            (dateA?.getTime() ?? new Date("9999-12-31").getTime()) -
            (dateB?.getTime() ?? new Date("9999-12-31").getTime());
        } else if (typeof valA === "number" && typeof valB === "number") {
          comparison = valA - valB;
        } else {
          comparison = valA.toString().localeCompare(valB.toString());
        }
        if (comparison !== 0)
          return direction === "ascending" ? comparison : -comparison;
      }
      return 0;
    });

    return filteredGrants;
  };

  // Create grant card JSX
  const createGrantCard = (grant: Grant) => {
    const isFavorite = favorites.includes(grant.grantId);
    const deadline = parseDate(grant["Application Deadline"]);
    const deadlineClass = deadline && deadline < new Date() ? "passed" : "";
    let matchRequirements = grant["Match Requirements"];
    if (typeof matchRequirements === "number") {
      matchRequirements = `${(matchRequirements * 100).toFixed(
        matchRequirements % 1 !== 0 ? 2 : 0
      )}%`;
    }
    return (
      <div
        key={grant.grantId}
        className="grant-card"
        tabIndex={0}
        data-grant-id={grant.grantId}
        onClick={() => setModalGrantId(grant.grantId)}
      >
        <h3>{grant["Grant Name"] ?? "Untitled"}</h3>
        <p>
          <span
            className={`tag ${grant["Type of Grant"]?.toLowerCase() ?? ""}`}
          >
            {grant["Type of Grant"] ?? "N/A"}
          </span>
        </p>
        <p>
          <strong>Funding:</strong> {grant["Funding Source"] ?? "N/A"}
        </p>
        <p>
          <strong>Award:</strong> $
          {(grant["Minimum Grant Award"] ?? 0).toLocaleString()} - $
          {(grant["Maximum Grant Award"] ?? 0).toLocaleString()}
        </p>
        <p className={`deadline ${deadlineClass}`}>
          <strong>Deadline:</strong> {grant["Application Deadline"] ?? "N/A"}
        </p>
        <p
          className="countdown"
          data-deadline={grant["Application Deadline"]}
        ></p>
        {matchRequirements && (
          <p>
            <strong>Match Requirements:</strong> {matchRequirements}
          </p>
        )}
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(grant.grantId);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FontAwesomeIcon icon={faStar} />
        </button>
      </div>
    );
  };

  // Update filter summary
  const updateFilterSummary = (count: number): string => {
    const summary: string[] = [];
    if (filterConfig.textSearch)
      summary.push(`Search: "${filterConfig.textSearch}"`);
    if (
      filterConfig.filters["Type of Grant"].includes("All") ||
      filterConfig.filters["Type of Grant"].length === 0
    ) {
      summary.push(`Grant Types: All`);
    } else if (filterConfig.filters["Type of Grant"].length) {
      summary.push(
        `Grant Types: ${filterConfig.filters["Type of Grant"].join(", ")}`
      );
    }
    if (
      filterConfig.filters["Funding Source"].includes("All") ||
      filterConfig.filters["Funding Source"].length === 0
    ) {
      summary.push(`Funding Sources: All`);
    } else if (filterConfig.filters["Funding Source"].length) {
      summary.push(
        `Funding Sources: ${filterConfig.filters["Funding Source"].join(", ")}`
      );
    }
    if (filterConfig.filters["Target Award Amount"]) {
      summary.push(
        `Target Award: $${filterConfig.filters[
          "Target Award Amount"
        ].toLocaleString()}`
      );
    }
    if (filterConfig.filters["Application Deadline"]) {
      summary.push(
        `Deadline: ${
          filterConfig.filters["Deadline Direction"] === "onOrBefore"
            ? "Before or On"
            : "After or On"
        } ${filterConfig.filters["Application Deadline"].toLocaleDateString()}`
      );
    }
    if (filterConfig.filters["Max Application Hours"]) {
      summary.push(
        `Max Hours: Up to ${filterConfig.filters[
          "Max Application Hours"
        ].toLocaleString()}`
      );
    }
    if (filterConfig.filters["Community"]) {
      const community = communities.find(
        (c: Community) => c.name === filterConfig.filters["Community"]
      );
      if (community) {
        summary.push(
          `Community: ${community.name} (${
            community.jurisdictionType
          }, Population: ${community.population.toLocaleString()}, LMI: ${
            community.lmiPercentage
          }%)`
        );
      }
    }
    return `Showing ${count} grants${
      summary.length ? " | " + summary.join(", ") : ""
    }`;
  };

  // Toggle favorite
  const toggleFavorite = (grantId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(grantId)
        ? prev.filter((id) => id !== grantId)
        : [...prev, grantId];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Handle filter application
  const applyFilters = () => {
    if (
      targetAwardRef.current?.value &&
      !targetAwardRef.current.checkValidity()
    ) {
      alert("Please enter a valid target award amount (positive number).");
      return;
    }
    if (maxHoursRef.current?.value && !maxHoursRef.current.checkValidity()) {
      alert("Please enter a valid max application hours (positive number).");
      return;
    }

    setFilterConfig((prev) => ({
      ...prev,
      textSearch: searchInputRef.current?.value.toLowerCase() ?? "",
      filters: {
        ...prev.filters,
        "Target Award Amount":
          parseFloat(targetAwardRef.current?.value ?? "") || null,
        "Application Deadline": parseDate(deadlineRef.current?.value) || null,
        "Deadline Direction":
          (deadlineDirectionRef.current?.value as "onOrBefore" | "onOrAfter") ??
          "onOrBefore",
        "Max Application Hours":
          parseFloat(maxHoursRef.current?.value ?? "") || null,
        Community: communityFilterRef.current?.value ?? null,
      },
      sort: [
        {
          attr: sort1AttrRef.current?.value ?? "Grant Name",
          direction:
            (sort1DirRef.current?.value as "ascending" | "descending") ??
            "ascending",
        },
        {
          attr: sort2AttrRef.current?.value ?? null,
          direction:
            (sort2DirRef.current?.value as "ascending" | "descending") ??
            "ascending",
        },
      ],
    }));
    saveConfig();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterConfig({
      textSearch: "",
      filters: {
        "Type of Grant": ["All"],
        "Funding Source": ["All"],
        "Target Award Amount": null,
        "Application Deadline": null,
        "Deadline Direction": "onOrBefore",
        "Max Application Hours": null,
        Community: null,
      },
      sort: [
        { attr: "Grant Name", direction: "ascending" },
        { attr: null, direction: "ascending" },
      ],
    });
    if (searchInputRef.current) searchInputRef.current.value = "";
    if (targetAwardRef.current) targetAwardRef.current.value = "";
    if (maxHoursRef.current) maxHoursRef.current.value = "";
    if (deadlineRef.current) deadlineRef.current.value = "";
    if (deadlineDirectionRef.current)
      deadlineDirectionRef.current.value = "onOrBefore";
    if (communityFilterRef.current) communityFilterRef.current.value = "";
    if (sort1AttrRef.current) sort1AttrRef.current.value = "Grant Name";
    if (sort1DirRef.current) sort1DirRef.current.value = "ascending";
    if (sort2AttrRef.current) sort2AttrRef.current.value = "";
    if (sort2DirRef.current) sort2DirRef.current.value = "ascending";
    saveConfig();
  };

  // Handle checkbox updates
  const updateFilterConfigFromCheckboxes = (groupId: string) => {
    const checkboxes = document.querySelectorAll(
      `#${groupId} input[type="checkbox"]:not(#${groupId}All)`
    );
    const checkedValues = Array.from(checkboxes)
      .filter((cb) => (cb as HTMLInputElement).checked)
      .map((cb) => (cb as HTMLInputElement).value);
    setFilterConfig((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [groupId === "typeFilter" ? "Type of Grant" : "Funding Source"]:
          checkedValues.length === checkboxes.length ? ["All"] : checkedValues,
      },
    }));
  };

  // Setup Intersection Observer for cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.opacity = "1";
            target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll(".grant-card");
    cards.forEach((card) => {
      const target = card as HTMLElement;
      target.style.opacity = "0";
      target.style.transform = "translateY(20px)";
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [allGrants, filterConfig, favorites]);

  // Setup countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll(".countdown").forEach((el) => {
        const deadline = el.getAttribute("data-deadline");
        if (!deadline || deadline === "Rolling") {
          el.textContent = "Rolling Deadline";
          return;
        }
        const deadlineDate = parseDate(deadline);
        if (!deadlineDate) {
          el.textContent = "Invalid Deadline";
          return;
        }
        const timeLeft = deadlineDate.getTime() - new Date().getTime();
        el.textContent =
          timeLeft <= 0
            ? "Deadline Passed"
            : `Due in ${Math.floor(
                timeLeft / (1000 * 60 * 60 * 24)
              )} days ${Math.floor(
                (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              )} hours`;
        el.className = `countdown ${timeLeft <= 0 ? "passed" : ""}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize component
  useEffect(() => {
    loadSavedData();
    loadGrants();
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (header) {
        const headerElement = header as HTMLElement;
        headerElement.style.position =
          window.scrollY > 50 ? "static" : "sticky";
        headerElement.style.top = window.scrollY > 50 ? "" : "0";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update suggestions when grants change
  useEffect(() => {
    const datalist = document.getElementById("grantSuggestions");
    if (datalist) {
      const suggestions = allGrants
        .map((g) => g["Grant Name"] ?? "")
        .filter(Boolean);
      datalist.innerHTML = [...new Set(suggestions)]
        .map((s) => `<option value="${s}" />`)
        .join("");
    }
  }, [allGrants]);

  // Trap focus in modal
  useEffect(() => {
    if (modalGrantId || showHelpModal) {
      const modal = modalRef.current;
      const focusable = modal?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable?.[0] as HTMLElement;
      const last = focusable?.[focusable.length - 1] as HTMLElement;
      first?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        } else if (e.key === "Escape") {
          setModalGrantId(null);
          setShowHelpModal(false);
        }
      };

      modal?.addEventListener("keydown", handleKeyDown);
      return () => modal?.removeEventListener("keydown", handleKeyDown);
    }
  }, [modalGrantId, showHelpModal]);

  // Debounced search handler
  const handleSearch = useDebounce(() => applyFilters(), 300);

  // Render filter controls
  const renderCheckboxOptions = (
    groupId: string,
    attr: string,
    selectedValues: string[]
  ) => {
    const uniqueValues = [...new Set(allGrants.map((g) => g[attr] ?? ""))]
      .sort()
      .filter((v) => v);
    selectedValues = Array.isArray(selectedValues) ? selectedValues : ["All"];
    return (
      <div
        className="checkbox-group"
        id={groupId}
        role="group"
        aria-label={`Filter by ${attr.toLowerCase()}`}
      >
        <div className="checkbox-item">
          <input
            type="checkbox"
            id={`${groupId}All`}
            name={`${groupId}All`}
            value="all"
            checked={selectedValues.includes("All")}
            onChange={(e) => {
              const checkboxes = document.querySelectorAll(
                `#${groupId} input[type="checkbox"]:not(#${groupId}All)`
              );
              checkboxes.forEach(
                (cb) => ((cb as HTMLInputElement).checked = e.target.checked)
              );
              updateFilterConfigFromCheckboxes(groupId);
              applyFilters();
            }}
          />
          <label htmlFor={`${groupId}All`}>All</label>
        </div>
        {uniqueValues.map((val) => (
          <div key={val} className="checkbox-item">
            <input
              type="checkbox"
              id={`${groupId}_${val}`}
              name={`${groupId}_${val}`}
              value={val}
              checked={selectedValues.includes(val)}
              onChange={() => {
                const checkboxes = document.querySelectorAll(
                  `#${groupId} input[type="checkbox"]:not(#${groupId}All)`
                );
                const allCheckbox = document.getElementById(
                  `${groupId}All`
                ) as HTMLInputElement;
                if (allCheckbox) {
                  const checkedCount = Array.from(checkboxes).filter(
                    (cb) => (cb as HTMLInputElement).checked
                  ).length;
                  allCheckbox.checked =
                    checkedCount === checkboxes.length || checkedCount === 0;
                }
                updateFilterConfigFromCheckboxes(groupId);
                applyFilters();
              }}
            />
            <label htmlFor={`${groupId}_${val}`}>{val}</label>
          </div>
        ))}
      </div>
    );
  };

  const renderCommunityOptions = (
    selectId: string,
    selectedValue: string | null
  ) => (
    <select
      id={selectId}
      ref={communityFilterRef}
      value={selectedValue ?? ""}
      onChange={() => applyFilters()}
    >
      <option value="">Select a Community</option>
      {communities.map((community) => (
        <option key={community.name} value={community.name}>
          {community.name} ({community.jurisdictionType})
        </option>
      ))}
    </select>
  );

  const renderSortOptions = (
    selectId: string,
    selectedValue: string | null,
    ref: React.RefObject<HTMLSelectElement>
  ) => (
    <select
      id={selectId}
      ref={ref}
      value={selectedValue ?? ""}
      onChange={() => applyFilters()}
    >
      <option value="">None</option>
      {attributes.map((attr) => (
        <option key={attr} value={attr}>
          {attr}
        </option>
      ))}
    </select>
  );

  const renderDeadlineDirection = (selectId: string, selectedValue: string) => (
    <select
      id={selectId}
      ref={deadlineDirectionRef}
      value={selectedValue}
      onChange={() => applyFilters()}
    >
      <option value="onOrBefore">Before or On</option>
      <option value="onOrAfter">After or On</option>
    </select>
  );

  // Render grant modal
  const renderGrantModal = () => {
    const grant = allGrants.find((g) => g.grantId === modalGrantId);
    if (!grant) return null;
    return (
      <div
        id="grantModal"
        className="modal"
        style={{ display: "flex" }}
        ref={modalRef}
      >
        <div className="modal-content" data-grant-id={modalGrantId ?? ""}>
          <button
            id="closeGrantModal"
            className="close"
            type="button"
            aria-label="Close modal"
            onClick={() => setModalGrantId(null)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 id="modalTitle">{grant["Grant Name"] ?? "Untitled"}</h2>
          <div id="modalDetails">
            {attributes.map((attr) => (
              <p key={attr}>
                <strong>{attr}:</strong>{" "}
                {attr.includes("Award") && grant[attr] !== undefined
                  ? `$${grant[attr].toLocaleString()}`
                  : attr === "Match Requirements" &&
                    typeof grant[attr] === "number"
                  ? `${(grant[attr] * 100).toFixed(
                      grant[attr] % 1 !== 0 ? 2 : 0
                    )}%`
                  : attr === "Eligible Populations" && grant[attr]
                  ? `Min: ${(grant[attr].min ?? 0).toLocaleString()}, Max: ${(
                      grant[attr].max ?? "Unlimited"
                    ).toLocaleString()}`
                  : attr === "LMI Requirement" && grant[attr]
                  ? `${grant[attr]}%`
                  : attr === "Eligible Jurisdiction Type" && grant[attr]
                  ? grant[attr]
                  : grant[attr] !== undefined
                  ? grant[attr].toString()
                  : "N/A"}
              </p>
            ))}
          </div>
          <div className="modal-buttons">
            <button
              className="btn"
              id="favoriteBtn"
              type="button"
              onClick={() => modalGrantId && toggleFavorite(modalGrantId)}
            >
              {favorites.includes(modalGrantId ?? "")
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </button>
            <button
              className="btn"
              id="copyDetailsBtn"
              type="button"
              onClick={() => {
                const title = grant["Grant Name"] ?? "Untitled";
                const details = attributes
                  .map(
                    (attr) =>
                      `${attr}: ${
                        attr.includes("Award") && grant[attr] !== undefined
                          ? `$${grant[attr].toLocaleString()}`
                          : attr === "Match Requirements" &&
                            typeof grant[attr] === "number"
                          ? `${(grant[attr] * 100).toFixed(
                              grant[attr] % 1 !== 0 ? 2 : 0
                            )}%`
                          : attr === "Eligible Populations" && grant[attr]
                          ? `Min: ${(
                              grant[attr].min ?? 0
                            ).toLocaleString()}, Max: ${(
                              grant[attr].max ?? "Unlimited"
                            ).toLocaleString()}`
                          : attr === "LMI Requirement" && grant[attr]
                          ? `${grant[attr]}%`
                          : attr === "Eligible Jurisdiction Type" && grant[attr]
                          ? grant[attr]
                          : grant[attr] !== undefined
                          ? grant[attr].toString()
                          : "N/A"
                      }`
                  )
                  .join("\n");
                navigator.clipboard
                  .writeText(`${title}\n${details}`)
                  .then(() => alert("Grant details copied to clipboard!"))
                  .catch((err) => {
                    console.error("Failed to copy details:", err);
                    alert("Failed to copy details to clipboard.");
                  });
              }}
            >
              Copy Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render help modal
  const renderHelpModal = () => (
    <div
      id="helpModal"
      className="modal"
      style={{ display: "flex" }}
      ref={modalRef}
    >
      <div className="modal-content">
        <button
          id="closeHelpModal"
          className="close"
          type="button"
          aria-label="Close help modal"
          onClick={() => setShowHelpModal(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>How to Use the Grant Finder</h2>
        <div id="helpDetails">
          <p>
            <strong>Grant Type:</strong> Filter by category (e.g.,
            Infrastructure, Planning).
          </p>
          <p>
            <strong>Funding Source:</strong> Filter by origin (e.g., Federal,
            State).
          </p>
          <p>
            <strong>Search Grants:</strong> Use keywords to search all grant
            fields.
          </p>
          <p>
            <strong>Community:</strong> Filter by eligible community.
          </p>
          <p>
            <strong>Target Award Amount:</strong> Find grants within a specified
            range.
          </p>
          <p>
            <strong>Max Application Hours:</strong> Filter by estimated
            application effort.
          </p>
          <p>
            <strong>Deadline Direction:</strong> Select 'On/Before' or
            'On/After' for deadlines.
          </p>
          <p>
            <strong>Application Deadline:</strong> Filter by specific dates.
          </p>
          <p>
            <strong>Sorting:</strong> Sort by any field, ascending or
            descending.
          </p>
          <p>
            <strong>Favorites:</strong> Save grants using the star icon on
            cards.
          </p>
        </div>
      </div>
    </div>
  );

  // Render main component
  return (
    <section className="dashboard">
      <button
        className="toggle-filters"
        id="toggleFiltersBtn"
        type="button"
        aria-expanded={!filterCollapsed}
        aria-controls="filterControls"
        onClick={() => setFilterCollapsed((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faFilter} /> Toggle Filters
      </button>

      <div
        className={`controls ${filterCollapsed ? "collapsed" : ""}`}
        id="filterControls"
      >
        <div className="filter-row">
          <div className="filter-group checkboxes">
            <label>Grant Type</label>
            {renderCheckboxOptions(
              "typeFilter",
              "Type of Grant",
              filterConfig.filters["Type of Grant"]
            )}
          </div>
          <div className="filter-group checkboxes">
            <label>Funding Source</label>
            {renderCheckboxOptions(
              "fundingFilter",
              "Funding Source",
              filterConfig.filters["Funding Source"]
            )}
          </div>
        </div>

        <div className="filter-column">
          <div className="filter-group">
            <label htmlFor="searchInput">Search Grants</label>
            <input
              type="text"
              id="searchInput"
              ref={searchInputRef}
              list="grantSuggestions"
              defaultValue={filterConfig.textSearch}
              placeholder="e.g., grant name or keyword"
              onChange={handleSearch}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="communityFilter">Community</label>
            {renderCommunityOptions(
              "communityFilter",
              filterConfig.filters["Community"]
            )}
          </div>
          <div className="filter-group">
            <label htmlFor="targetAward">Target Award Amount</label>
            <input
              type="number"
              id="targetAward"
              ref={targetAwardRef}
              min={0}
              step={1000}
              defaultValue={filterConfig.filters["Target Award Amount"] ?? ""}
              placeholder="e.g., 200000"
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="maxHours">Max Application Hours</label>
            <input
              type="number"
              id="maxHours"
              ref={maxHoursRef}
              min={0}
              step={1}
              defaultValue={filterConfig.filters["Max Application Hours"] ?? ""}
              placeholder="e.g., 20"
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="deadlineDirection">Deadline Direction</label>
            {renderDeadlineDirection(
              "deadlineDirection",
              filterConfig.filters["Deadline Direction"]
            )}
          </div>
          <div className="filter-group">
            <label htmlFor="deadline">Application Deadline</label>
            <input
              type="date"
              id="deadline"
              ref={deadlineRef}
              defaultValue={
                filterConfig.filters["Application Deadline"]
                  ?.toISOString()
                  .split("T")[0] ?? ""
              }
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>

          <div className="sort-section">
            <div className="filter-group sort-group-wrapper">
              <label>Primary Sort</label>
              <div className="sort-group">
                {renderSortOptions(
                  "sort1Attr",
                  filterConfig.sort[0].attr,
                  sort1AttrRef as React.RefObject<HTMLSelectElement>
                )}
                <select
                  id="sort1Dir"
                  ref={sort1DirRef}
                  defaultValue={filterConfig.sort[0].direction}
                  onChange={() => applyFilters()}
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </div>
            <div className="filter-group sort-group-wrapper">
              <label>Secondary Sort</label>
              <div className="sort-group">
                {renderSortOptions(
                  "sort2Attr",
                  filterConfig.sort[1].attr,
                  sort2AttrRef as React.RefObject<HTMLSelectElement>
                )}
                <select
                  id="sort2Dir"
                  ref={sort2DirRef}
                  defaultValue={filterConfig.sort[1].direction}
                  onChange={() => applyFilters()}
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button
            className="btn"
            id="applyFilters"
            type="button"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          <button
            className="btn"
            id="resetFilters"
            type="button"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
          <button
            className="btn"
            id="helpBtn"
            type="button"
            title="Learn how to use the filters"
            onClick={() => setShowHelpModal(true)}
          >
            Help
          </button>
        </div>
        <div id="filterSummary">
          {updateFilterSummary(getFilteredGrants().length)}
        </div>
      </div>

      <div id="grantsContainer" role="region" aria-live="polite">
        {loading ? (
          <div className="loading">Loading Grants...</div>
        ) : error ? (
          <div className="grant-card error">
            <p>{error}</p>
          </div>
        ) : getFilteredGrants().length === 0 ? (
          <div className="grant-card">
            <p>No grants match your criteria.</p>
          </div>
        ) : (
          getFilteredGrants().map((grant) => createGrantCard(grant))
        )}
      </div>

      <datalist id="grantSuggestions"></datalist>

      {modalGrantId && renderGrantModal()}
      {showHelpModal && renderHelpModal()}
    </section>
  );
};

export default GrantsManager;
