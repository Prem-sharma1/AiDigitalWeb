"use client";

import { useMemo, useState } from "react";
import CreativeGrid from "./CreativeGrid";

const filters = [
  "All",
  "Website & SEO",
  "Campaigns",
  "AI Videos",
  "Creative Content",
  "Reels"
];

const websiteTypes = ["Static Websites", "Dynamic Websites"];

const industries = [
  {
    name: "Real Estate",
    description:
      "Websites, campaigns, AI property promotions, creative branding, and real estate reels.",
    projects: [
      { title: "Property Listing Website", type: "Website & SEO" },
      { title: "Real Estate Lead Campaign", type: "Campaigns" },
      { title: "AI Property Promo", type: "AI Videos" },
      { title: "Real Estate Instagram Reel", type: "Reels" }
    ]
  },
  {
    name: "Education",
    description:
      "Educational websites, admission campaigns, student-focused creatives, and promotional reels.",
    projects: [
      { title: "School Website", type: "Website & SEO" },
      { title: "Admission Campaign", type: "Campaigns" },
      { title: "Educational AI Video", type: "AI Videos" },
      { title: "Student Awareness Reel", type: "Reels" }
    ]
  },
  {
    name: "Healthcare",
    description:
      "Healthcare websites, awareness campaigns, AI medical videos, and promotional content.",
    projects: [
      { title: "Hospital Website", type: "Website & SEO" },
      { title: "Healthcare Campaign", type: "Campaigns" },
      { title: "AI Medical Promo", type: "AI Videos" },
      { title: "Healthcare Branding Creative", type: "Creative Content" },
      { title: "Dr. Ritesh Gupta Promo", type: "AI Videos" }
    ]
  },
  {
    name: "Finance",
    description:
      "Finance dashboards, investment campaigns, branding creatives, and educational reels.",
    projects: [
      { title: "Finance Dashboard", type: "Website & SEO" },
      { title: "Investment Campaign", type: "Campaigns" },
      { title: "Finance Social Creative", type: "Creative Content" },
      { title: "Finance Awareness Reel", type: "Reels" },
      { title: "RR Capital Promo", type: "AI Videos" },
      { title: "TaxClair AI Promo", type: "AI Videos" }
    ]
  },
  {
    name: "Hospitality",
    description:
      "Hotel booking platforms, restaurant campaigns, AI hospitality promos, and social media reels.",
    projects: [
      { title: "Hotel Booking Website", type: "Website & SEO" },
      { title: "Restaurant Campaign", type: "Campaigns" },
      { title: "AI Hotel Promo", type: "AI Videos" },
      { title: "Hospitality Reel", type: "Reels" }
    ]
  },
  {
    name: "Solar",
    description:
      "Solar websites, green energy campaigns, AI solar videos, and promotional clean energy reels.",
    projects: [
      { title: "Solar Landing Page", type: "Website & SEO" },
      { title: "Green Energy Campaign", type: "Campaigns" },
      { title: "KwikM Solar Promo", type: "AI Videos" }
    ]
  },
  {
    name: "Agriculture",
    description:
      "Agricultural websites, farming campaigns, AI agro videos, and promotional sustainable agriculture reels.",
    projects: [
      { title: "Agricultural Landing Page", type: "Website & SEO" },
      { title: "Sustainable Farm Campaign", type: "Campaigns" },
      { title: "Mack Agro Promo", type: "AI Videos" }
    ]
  },
  {
    name: "Construction",
    description:
      "All-in-one Construction ERP & Project Management software showcase, web portal, and local SEO campaign.",
    projects: [
      { title: "Hitoffice Construction ERP", type: "Website & SEO" }
    ]
  }
];

const filterIcons = {
  "Website & SEO": "language",
  Campaigns: "campaign",
  "AI Videos": "movie",
  "Creative Content": "palette",
  Reels: "smart_display"
};

const otherProjects = [
  { title: "E-commerce Store Development", type: "Website & SEO" },
  { title: "SaaS Platform Launch Campaign", type: "Campaigns" },
  { title: "AI Voice Agent Demo Video", type: "AI Videos" },
  { title: "Corporate Identity Redesign", type: "Creative Content" },
  { title: "Product Launch Promotional Reel", type: "Reels" },
  { title: "Custom Dashboard Integration", type: "Website & SEO" }
];

import { useEffect } from "react";

export default function FeaturedWork() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showOthers, setShowOthers] = useState(false);
  const [industriesState, setIndustriesState] = useState(industries);
  const [otherProjectsState, setOtherProjectsState] = useState(otherProjects);

  useEffect(() => {
    fetch("/api/admin/portfolio?t=" + Date.now(), { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load portfolio data");
      })
      .then((data) => {
        if (data.industries && data.industries.length > 0) {
          const hasProjects = data.industries.some((ind) => ind.projects && ind.projects.length > 0);
          if (hasProjects) setIndustriesState(data.industries);
        }
        if (data.otherProjects && data.otherProjects.length > 0) {
          setOtherProjectsState(data.otherProjects);
        }
      })
      .catch((err) => console.warn("Using fallback static industries/other projects:", err));
  }, []);

  const visibleIndustries = useMemo(() => {
    if (activeFilter === "All") {
      return industriesState;
    }

    return industriesState
      .map((industry) => ({
        ...industry,
        projects: industry.projects.filter((project) => project.type === activeFilter)
      }))
      .filter((industry) => industry.projects.length > 0);
  }, [activeFilter, industriesState]);

  const visibleOtherProjects = useMemo(() => {
    if (activeFilter === "All") {
      return otherProjectsState;
    }
    return otherProjectsState.filter((project) => project.type === activeFilter);
  }, [activeFilter, otherProjectsState]);

  return (
    <section id="portfolio" className="section featured-work">
      <div className="section-heading">
        <h2>Featured Projects</h2>
        <p>
          A showcase of our best websites, campaigns, AI videos, creatives, and reels.
        </p>
      </div>

      <div className="work-filter-row" aria-label="Service filters">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={activeFilter === filter ? "active" : ""}
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {activeFilter === "Website & SEO" && (
        <div className="website-type-row" aria-label="Website and SEO project types">
          {websiteTypes.map((type) => (
            <span key={type}>{type}</span>
          ))}
        </div>
      )}

      <div className="industry-list">
        {activeFilter === "Creative Content" || activeFilter === "AI Videos" || activeFilter === "Reels" || activeFilter === "Website & SEO" || activeFilter === "All" || activeFilter === "Campaigns" ? (
          <CreativeGrid activeFilter={activeFilter} />
        ) : (
          <>
            {visibleIndustries.map((industry) => (
              <article className="industry-section" key={industry.name}>
                <div className="industry-copy">
                  <span className="industry-label">Industry</span>
                  <h3>{industry.name}</h3>
                  <p>{industry.description}</p>
                </div>
                <div className="featured-project-grid">
                  {industry.projects.map((project) => (
                    <div className="featured-project-card" key={project.title}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {filterIcons[project.type] ?? "dashboard"}
                      </span>
                      <strong>{project.title}</strong>
                      <small>{project.type}</small>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </>
        )}

        {visibleOtherProjects.length > 0 && (
          <div className="others-toggle-container">
            <button
              type="button"
              className={`others-toggle-button ${showOthers ? "active" : ""}`}
              onClick={() => setShowOthers(!showOthers)}
              aria-expanded={showOthers}
            >
              <span>{showOthers ? "Show Fewer Projects" : "View Other Projects"}</span>
              <span className="material-symbols-outlined">
                {showOthers ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              </span>
            </button>
          </div>
        )}

        {showOthers && visibleOtherProjects.length > 0 && (
          <article className="industry-section others-section">
            <div className="industry-copy">
              <span className="industry-label">General</span>
              <h3>Other Projects</h3>
              <p>Additional marketing campaigns, custom integrations, branding assets, and creative videos.</p>
            </div>
            <div className="featured-project-grid">
              {visibleOtherProjects.map((project) => (
                <div className="featured-project-card" key={project.title}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {filterIcons[project.type] ?? "dashboard"}
                  </span>
                  <strong>{project.title}</strong>
                  <small>{project.type}</small>
                </div>
              ))}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
