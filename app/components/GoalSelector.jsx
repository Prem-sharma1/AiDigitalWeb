"use client";

import { useMemo, useState } from "react";

const goals = [
  {
    label: "More Website Traffic",
    result: "SEO Strategy + Content Marketing + Growth Framework",
    description: "Drive high-intent organic visitors to your site with a custom SEO roadmap, engaging blog posts, and performance-focused optimization frameworks."
  },
  {
    label: "More Leads",
    result: "Performance Marketing + Landing Page Optimization + Conversion Tracking",
    description: "Acquire qualified prospects using conversion-optimized landing pages, targeted Google/Meta ad campaigns, and end-to-end analytics tracking."
  },
  {
    label: "Better Google Ranking",
    result: "Technical SEO + Keyword Research + Authority Building",
    description: "Climb to the top of Google search results by fixing technical audits, performing in-depth keyword analysis, and building high-authority links."
  },
  {
    label: "Better Social Media",
    result: "Content Strategy + Community Management + Social Ads",
    description: "Build a thriving digital community through creative content strategies, daily page management, and highly-engaging social media ad spend."
  },
  {
    label: "More Online Sales",
    result: "CRO + E-commerce Strategy + Retargeting",
    description: "Boost your online store sales with conversion rate optimization (CRO), user-centric checkout funnels, and dynamic retargeting campaigns."
  },
  {
    label: "Better Brand Identity",
    result: "Visual Design + Messaging + Brand Positioning",
    description: "Set yourself apart from competitors with premium logo designs, harmonious color palettes, and a cohesive brand messaging framework."
  }
];

export default function GoalSelector() {
  const [activeGoal, setActiveGoal] = useState(null);
  const selected = useMemo(
    () => goals.find((goal) => goal.label === activeGoal),
    [activeGoal]
  );

  return (
    <section className="goal-panel" aria-labelledby="goal-title">
      <h2 id="goal-title">What's your primary goal?</h2>
      <div className="goal-grid" role="list">
        {goals.map((goal) => {
          const isActive = goal.label === activeGoal;

          return (
            <button
              className={`goal-card ${isActive ? "active" : ""}`}
              type="button"
              aria-pressed={isActive}
              key={goal.label}
              onClick={() => setActiveGoal(isActive ? null : goal.label)}
            >
              {goal.label}
            </button>
          );
        })}
      </div>
      
      {selected && (
        <div className="goal-details-panel">
          <div className="recommendation-kicker">Recommended strategy</div>
          <div className="recommendation" aria-live="polite">
            {selected.result}
          </div>
          <p className="goal-description">{selected.description}</p>
          <a className="goal-pricing-btn" href="/pricing">Check Pricing</a>
        </div>
      )}
    </section>
  );
}
