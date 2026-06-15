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
      { title: "Healthcare Branding Creative", type: "Creative Content" }
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
      { title: "Finance Awareness Reel", type: "Reels" }
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

export default function FeaturedWork() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showOthers, setShowOthers] = useState(false);

  const visibleIndustries = useMemo(() => {
    if (activeFilter === "All") {
      return industries;
    }

    return industries
      .map((industry) => ({
        ...industry,
        projects: industry.projects.filter((project) => project.type === activeFilter)
      }))
      .filter((industry) => industry.projects.length > 0);
  }, [activeFilter]);

  const visibleOtherProjects = useMemo(() => {
    if (activeFilter === "All") {
      return otherProjects;
    }
    return otherProjects.filter((project) => project.type === activeFilter);
  }, [activeFilter]);

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
        {activeFilter === "Creative Content" ? (
          <CreativeGrid />
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
          </>
        )}
      </div>
    </section>
  );
}
