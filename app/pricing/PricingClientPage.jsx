"use client";

import React from "react";
import { Icon, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { adsPlans, websitePlans, creativePacks, aiVideoPlans } from "./pricingData";
import { useCart } from "../hooks/useCart";
import { useRouter } from "next/navigation";

const getWhatsAppLink = (planName, price, period = "") => {
  const message = `Hi! I would like to buy the ${planName} plan priced at ₹${price}${period} from AI Digital.`;
  return `https://wa.me/919096090701?text=${encodeURIComponent(message)}`;
};

export default function PricingClientPage() {
  const { addToCart, clearCart } = useCart();
  const router = useRouter();

  const [adsPlansState, setAdsPlansState] = React.useState(adsPlans);
  const [websitePlansState, setWebsitePlansState] = React.useState(websitePlans);
  const [creativePacksState, setCreativePacksState] = React.useState(creativePacks);
  const [aiVideoPlansState, setAiVideoPlansState] = React.useState(aiVideoPlans);

  const [activeCreativeIndex, setActiveCreativeIndex] = React.useState(0);

  const nextCreative = () => {
    setActiveCreativeIndex((prev) => (prev + 1) % creativePacksState.length);
  };

  const prevCreative = () => {
    setActiveCreativeIndex((prev) => (prev - 1 + creativePacksState.length) % creativePacksState.length);
  };

  React.useEffect(() => {
    fetch("/api/admin/pricing?t=" + Date.now(), { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load pricing configurations");
      })
      .then((data) => {
        if (data.adsPlans) setAdsPlansState(data.adsPlans);
        if (data.websitePlans) setWebsitePlansState(data.websitePlans);
        if (data.creativePacks) setCreativePacksState(data.creativePacks);
        if (data.aiVideoPlans) setAiVideoPlansState(data.aiVideoPlans);
      })
      .catch((err) => console.warn("Using fallback static pricing plans:", err));
  }, []);

  const creativeScrollRef = React.useRef(null);

  const handleBuyNow = (planName, price, features = []) => {
    clearCart();
    addToCart({
      name: planName,
      price: price,
      features: features
    });
    router.push("/checkout");
  };

  return (
    <div className="pricing-page-wrapper">
      <SiteHeader active="pricing" />

      {/* Category Anchor Sub-nav */}
      <div className="pricing-sub-nav">
        <a href="#ads" className="sub-nav-link">Lead Campaigns</a>
        <a href="#websites" className="sub-nav-link">Websites</a>
        <a href="#creative" className="sub-nav-link">Creative</a>
        <a href="#aivideo" className="sub-nav-link">AI Video</a>
      </div>

      {/* Top Banner Section */}
      <section className="pricing-hero">
        <div className="badge-pill">Your Success, Our Business</div>
        <h1 className="pricing-main-title">
          AiDigital <span>Plans</span>
        </h1>
        <p className="pricing-hero-sub">
          Unlock growth with data-driven marketing and high-performance assets tailored for your business needs.
        </p>
      </section>

      {/* Ads Performance Plans Section */}
      <section id="ads" className="pricing-section section-muted-light">
        <div className="section-title-wrapper">
          <h2 className="section-title-text">Lead Campaign Plans</h2>
          <div className="section-title-underline" />
        </div>

        <div className="ads-pricing-grid">
          {adsPlansState.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card-ads ${plan.isPopular ? "standard-popular-card" : ""}`}
              style={{ display: "flex", flexDirection: "column", justifyContent: "between" }}
            >
              <div>
                <div className={`card-top-info`}>
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
              <button
                onClick={() => handleBuyNow(plan.platform + " " + plan.level, plan.price, plan.features)}
                className={plan.isPopular ? "btn-card-solid" : "btn-card-outline"}
                style={{ display: "block", width: "100%", textAlign: "center", marginTop: "auto", border: "none", cursor: "pointer" }}
              >
                Buy Now
              </button>
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
            {websitePlansState.map((plan, index) => (
              <div className="website-plan-card" key={index} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div className={`web-badge-pill ${plan.tagClass}`}>{plan.level}</div>
                  <div className="price-display-flat">
                    <span className="currency">₹</span>
                    <span className="value">{plan.price}</span>
                    {plan.period && <span className="period">{plan.period}</span>}
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
                <button
                  onClick={() => handleBuyNow(plan.level + " Website", plan.price, plan.features.map(f => f.text))}
                  className="btn-card-outline"
                  style={{ display: "block", width: "100%", textAlign: "center", marginTop: "24px", cursor: "pointer" }}
                >
                  Buy Now
                </button>
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

        <div className="scroll-wrapper-relative desktop-creative-packs">
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
              {creativePacksState.map((plan, index) => {
                const cardStyles = plan.isHighlight
                  ? { ...plan.highlightStyles.card, borderColor: undefined, borderWidth: undefined }
                  : {};
                const tagStyles = plan.isHighlight ? plan.highlightStyles.tag : {};
                const iconStyles = plan.isHighlight ? plan.highlightStyles.icon : {};

                return (
                  <div
                    className={`website-plan-card ${plan.isHighlight ? "popular-highlight-card" : ""}`}
                    key={index}
                    style={plan.isHighlight ? { ...cardStyles, "--highlight-color": plan.highlightStyles.card.borderColor, display: "flex", flexDirection: "column", justifyContent: "space-between" } : { ...cardStyles, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                  >
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
                        {plan.period && <span className="period">{plan.period}</span>}
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
                    <button
                      onClick={() => handleBuyNow("Creative Packs - " + plan.level, plan.price, plan.features.map(f => f.text))}
                      className={plan.isHighlight ? "btn-card-solid" : "btn-card-outline"}
                      style={plan.isHighlight ? {
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        marginTop: "24px",
                        backgroundColor: plan.highlightStyles.button.backgroundColor,
                        color: "#ffffff",
                        border: "none",
                        cursor: "pointer"
                      } : {
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        marginTop: "24px",
                        cursor: "pointer"
                      }}
                    >
                      Buy Now
                    </button>
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

        {/* Mobile Slider (Visible only on mobile) */}
        <div className="mobile-creative-packs-slider">
          <div className="mobile-slider-wrapper">
            <button 
              className="mobile-slider-arrow-btn left" 
              onClick={prevCreative}
              aria-label="Previous pack"
            >
              <Icon name="chevron_left" />
            </button>

            <div className="mobile-slider-card-container">
              {creativePacksState.map((plan, index) => {
                if (index !== activeCreativeIndex) return null;

                const cardStyles = plan.isHighlight
                  ? { ...plan.highlightStyles.card, borderColor: undefined, borderWidth: undefined }
                  : {};
                const tagStyles = plan.isHighlight ? plan.highlightStyles.tag : {};
                const iconStyles = plan.isHighlight ? plan.highlightStyles.icon : {};

                return (
                  <div
                    className={`website-plan-card mobile-slider-card ${plan.isHighlight ? "popular-highlight-card" : ""}`}
                    key={index}
                    style={plan.isHighlight ? { ...cardStyles, "--highlight-color": plan.highlightStyles.card.borderColor, display: "flex", flexDirection: "column", justifyContent: "space-between" } : { ...cardStyles, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                  >
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
                        {plan.period && <span className="period">{plan.period}</span>}
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
                    <button
                      onClick={() => handleBuyNow("Creative Packs - " + plan.level, plan.price, plan.features.map(f => f.text))}
                      className={plan.isHighlight ? "btn-card-solid" : "btn-card-outline"}
                      style={plan.isHighlight ? {
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        marginTop: "24px",
                        backgroundColor: plan.highlightStyles.button.backgroundColor,
                        color: "#ffffff",
                        border: "none",
                        cursor: "pointer"
                      } : {
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        marginTop: "24px",
                        cursor: "pointer"
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                );
              })}
            </div>

            <button 
              className="mobile-slider-arrow-btn right" 
              onClick={nextCreative}
              aria-label="Next pack"
            >
              <Icon name="chevron_right" />
            </button>
          </div>

          {/* Page/dot indicators */}
          <div className="mobile-slider-dots">
            {creativePacksState.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === activeCreativeIndex ? "active" : ""}`}
                onClick={() => setActiveCreativeIndex(index)}
                aria-label={`Go to pack ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Video Plans Section */}
      <section id="aivideo" className="pricing-section aivideo-section">
        <div className="section-title-wrapper">
          <h2 className="section-title-text">AI Video Plans</h2>
          <div className="section-title-underline" />
        </div>

        <div className="pricing-grid" style={{ maxWidth: "1140px", margin: "0 auto", paddingInline: "var(--page-gutter)" }}>
          {aiVideoPlansState.map((plan, index) => {
            const cardStyles = plan.isHighlight
              ? { ...plan.highlightStyles.card, borderColor: undefined, borderWidth: undefined }
              : {};
            const tagStyles = plan.isHighlight ? plan.highlightStyles.tag : {};
            const iconStyles = plan.isHighlight ? plan.highlightStyles.icon : {};

            return (
              <div
                className={`website-plan-card ${plan.isHighlight ? "popular-highlight-card" : ""}`}
                key={index}
                style={plan.isHighlight ? { ...cardStyles, "--highlight-color": plan.highlightStyles.card.borderColor, display: "flex", flexDirection: "column", justifyContent: "space-between" } : { ...cardStyles, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
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
                    {plan.period && <span className="period">{plan.period}</span>}
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
                <button
                  onClick={() => handleBuyNow("AI Video - " + plan.level, plan.price, plan.features.map(f => f.text))}
                  className={plan.isHighlight ? "btn-card-solid" : "btn-card-outline"}
                  style={plan.isHighlight ? {
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    marginTop: "24px",
                    backgroundColor: plan.highlightStyles.button.backgroundColor,
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer"
                  } : {
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    marginTop: "24px",
                    cursor: "pointer"
                  }}
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
