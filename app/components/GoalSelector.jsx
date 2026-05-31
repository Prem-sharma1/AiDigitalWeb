"use client";

import { useMemo, useState } from "react";

const goals = [
  {
    label: "More Website Traffic",
    result: "SEO Strategy + Content Marketing + Growth Framework"
  },
  {
    label: "More Leads",
    result: "Performance Marketing + Landing Page Optimization + Conversion Tracking"
  },
  {
    label: "Better Google Ranking",
    result: "Technical SEO + Keyword Research + Authority Building"
  },
  {
    label: "Better Social Media",
    result: "Content Strategy + Community Management + Social Ads"
  },
  {
    label: "More Online Sales",
    result: "CRO + E-commerce Strategy + Retargeting"
  },
  {
    label: "Better Brand Identity",
    result: "Visual Design + Messaging + Brand Positioning"
  }
];

export default function GoalSelector() {
  const [activeGoal, setActiveGoal] = useState(goals[0].label);
  const selected = useMemo(
    () => goals.find((goal) => goal.label === activeGoal) ?? goals[0],
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
              onClick={() => setActiveGoal(goal.label)}
            >
              {goal.label}
            </button>
          );
        })}
      </div>
      <div className="recommendation-kicker">Recommended strategy</div>
      <div className="recommendation" aria-live="polite">
        {selected.result}
      </div>
    </section>
  );
}
