import React from "react";
import { Icon, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { adsPlans, websitePlans, creativePacks } from "./pricingData";

export default function PricingClientPage() {
  const creativeScrollRef = React.useRef(null);

  return (
    <div className="pricing-page-wrapper">
      <SiteHeader active="pricing" />

      {/* Category Anchor Sub-nav */}
      <div className="pricing-sub-nav">
        <a href="#ads" className="sub-nav-link">Ads</a>
        <a href="#websites" className="sub-nav-link">Websites</a>
        <a href="#creative" className="sub-nav-link">Creative</a>
      </div>

      {/* Top Banner Section */}
      <section className="pricing-hero">
        <div className="badge-pill">Your Success, Our Business</div>
        <h1 className="pricing-main-title">
          Pricing <span>Plans</span>
        </h1>
        <p className="pricing-hero-sub">
          Unlock growth with data-driven marketing and high-performance assets tailored for your business needs.
        </p>
      </section>

      {/* Ads Performance Plans Section */}
      <section id="ads" className="pricing-section section-muted-light">
        <div className="section-title-wrapper">
          <h2 className="section-title-text">Ads Performance Plans</h2>
          <div className="section-title-underline" />
        </div>

        <div className="ads-pricing-grid">
          {adsPlans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card-ads ${plan.isPopular ? "standard-popular-card" : ""}`}
            >
              <div className="card-top-info">
                <div className={`ad-platform-badge ${plan.badgeClass}`}>
                  <span className="platform-icon">{plan.platform}</span>
                </div>
                <div className={`card-label-badge ${plan.pillClass}`}>{plan.level}</div>
                <div className="price-display">
                  <span className="currency">₹</span>
                  <span className="value">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
              </div>

              <ul className="card-features-list">
                {plan.features.map((feat, i) => (
                  <li key={i}>
                    <span className="check-icon-wrapper">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Website Design & Development Section */}
      <section id="websites" className="pricing-section websites-section">
        <div className="websites-layout-grid">
          {/* Left Column Description */}
          <div className="websites-intro">
            <h2 className="websites-title">
              Website Design <br className="desktop-only" />
              <span>& Development</span>
            </h2>
            <p className="websites-description">
              Establish your digital presence with professional, high-converting websites optimized for speed and user experience. All plans include maintenance for peace of mind.
            </p>

            {/* Promotional Badge Box */}
            <div className="promotional-callout-box">
              <span className="promo-label">PROMOTIONAL</span>
              <h3>WhatsApp & SMS Marketing Bundles</h3>
              <p>Get exclusive discounts when you pair website development with our marketing automated tools.</p>
            </div>
          </div>

          {/* Right Column Pricing Cards */}
          <div className="websites-cards-grid">
            {websitePlans.map((plan, index) => (
              <div className="website-plan-card" key={index}>
                <div>
                  <div className={`web-badge-pill ${plan.tagClass}`}>{plan.level}</div>
                  <div className="price-display-flat">
                    <span className="currency">₹</span>
                    <span className="value">{plan.price}</span>
                  </div>
                  <ul className="web-features-list">
                    {plan.features.map((feat, i) => (
                      <li key={i}>
                        <Icon name={feat.icon} className="web-feat-icon" />
                        {feat.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Design Packs Section */}
      <section id="creative" className="pricing-section section-muted-light creative-packs-section">
        <div className="section-title-wrapper creative-title-wrapper">
          <h2 className="section-title-text text-blue">Creative Design Packs</h2>
          <div className="section-title-underline bg-blue" />
        </div>

        <div className="scroll-wrapper-relative">
          {/* Scroll Left Button */}
          <button 
            className="scroll-arrow-btn left-arrow" 
            onClick={() => creativeScrollRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
            aria-label="Scroll left"
          >
            <Icon name="chevron_left" />
          </button>

          <div className="creative-packs-scroll-container" ref={creativeScrollRef}>
            <div className="creative-packs-grid">
              {creativePacks.map((plan, index) => {
                const cardStyles = plan.isHighlight ? plan.highlightStyles.card : {};
                const tagStyles = plan.isHighlight ? plan.highlightStyles.tag : {};
                const iconStyles = plan.isHighlight ? plan.highlightStyles.icon : {};
                const buttonStyles = plan.isHighlight ? plan.highlightStyles.button : {};

                return (
                  <div
                    className="website-plan-card"
                    key={index}
                    style={cardStyles}
                  >
                    {plan.isHighlight && (
                      <div className="popular-diagonal-ribbon" style={buttonStyles}>
                        Value
                      </div>
                    )}
                    <div>
                      <div
                        className={`web-badge-pill ${plan.tagClass}`}
                        style={tagStyles}
                      >
                        {plan.level}
                      </div>
                      <div className="price-display-flat">
                        <span className="currency">₹</span>
                        <span className="value">{plan.price}</span>
                      </div>
                      <ul className="web-features-list">
                        {plan.features.map((feat, i) => (
                          <li key={i}>
                            <Icon
                              name={feat.icon}
                              className="web-feat-icon"
                              style={iconStyles}
                            />
                            {feat.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll Right Button */}
          <button 
            className="scroll-arrow-btn right-arrow" 
            onClick={() => creativeScrollRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
            aria-label="Scroll right"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
