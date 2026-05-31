"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "./SiteChrome";

const showcaseProjects = [
  {
    title: "Property Listing Website",
    category: "Website & SEO",
    industry: "Real Estate",
    metric: "+142%",
    metricLabel: "Organic traffic",
    description:
      "A conversion-focused property portal with SEO pages, lead capture, and campaign-ready landing sections.",
    tags: ["Static Website", "Local SEO", "Lead Forms"],
    accent: "blue",
    icon: "language"
  },
  {
    title: "AI Property Promo",
    category: "AI Videos",
    industry: "Real Estate",
    metric: "3.8x",
    metricLabel: "Ad return",
    description:
      "AI-assisted property video concepting and short-form creative built for paid and organic distribution.",
    tags: ["AI Video", "Reels", "Paid Ads"],
    accent: "orange",
    icon: "movie"
  },
  {
    title: "Finance Dashboard",
    category: "Website & SEO",
    industry: "Finance",
    metric: "+78%",
    metricLabel: "Qualified leads",
    description:
      "A modern dashboard-style web experience for finance education, investor trust, and measurable inquiries.",
    tags: ["Dashboard UI", "Content SEO", "Analytics"],
    accent: "blue",
    icon: "query_stats"
  }
];

export default function PortfolioShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = showcaseProjects[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % showcaseProjects.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const previewBars = useMemo(() => [78, 58, 88, 48, 70], []);

  function moveSlide(direction) {
    setActiveIndex((current) => {
      const next = current + direction;

      if (next < 0) {
        return showcaseProjects.length - 1;
      }

      return next % showcaseProjects.length;
    });
  }

  return (
    <section className="section portfolio-hero" aria-labelledby="portfolio-hero-title">
      <div className="portfolio-hero-copy">
        <span className="eyebrow">Selected work</span>
        <h1 id="portfolio-hero-title">Project Showcase</h1>
        <p>
          Explore high-performing websites, campaigns, AI videos, creatives, and
          reels built for measurable growth.
        </p>
        <div className="portfolio-slider-controls" aria-label="Project slider controls">
          <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous project">
            <Icon name="arrow_back" />
          </button>
          <button type="button" onClick={() => moveSlide(1)} aria-label="Next project">
            <Icon name="arrow_forward" />
          </button>
        </div>
      </div>

      <div className={`portfolio-slider-card ${activeProject.accent}`}>
        <div className="portfolio-slide-topline">
          <span>{activeProject.category}</span>
          <strong>{activeProject.industry}</strong>
        </div>
        <div className="portfolio-slide-grid">
          <div className="portfolio-slide-content">
            <Icon name={activeProject.icon} />
            <h2>{activeProject.title}</h2>
            <p>{activeProject.description}</p>
            <div className="portfolio-tag-row">
              {activeProject.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="portfolio-preview" aria-hidden="true">
            <div className="preview-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-metric">
              <small>{activeProject.metricLabel}</small>
              <strong>{activeProject.metric}</strong>
            </div>
            <div className="preview-chart">
              {previewBars.map((height, index) => (
                <span
                  key={`${activeProject.title}-${index}`}
                  style={{ "--bar-height": `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="portfolio-slider-dots" aria-label="Choose featured project">
          {showcaseProjects.map((project, index) => (
            <button
              type="button"
              key={project.title}
              className={activeIndex === index ? "active" : ""}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${project.title}`}
              aria-pressed={activeIndex === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
