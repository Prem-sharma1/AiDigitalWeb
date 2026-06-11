"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { useRazorpay } from "../hooks/useRazorpay";
import { adsPlans, websitePlans, creativePacks, videoPlans } from "./pricingData";

export default function PricingClientPage() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const contactFormRef = useRef(null);
  const { triggerCheckout } = useRazorpay();

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("userName");
    const email = formData.get("email");
    const phone = formData.get("phone");

    await triggerCheckout({
      planName: selectedPlan,
      userName,
      email,
      phone,
      onSuccess: (paymentId) => {
        alert(`Payment Success! ID: ${paymentId}`);
        window.location.href = `/pricing?payment_id=${paymentId}&status=success`;
      },
      onFailure: (err) => {
        console.error("Payment failed", err);
      }
    });
  };

  useEffect(() => {
    // Auto-select plan from URL search parameters
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const plan = params.get("plan");
    if (service) {
      setSelectedService(service);
    }
    if (plan) {
      setSelectedPlan(plan);
      setTimeout(() => {
        if (contactFormRef.current) {
          contactFormRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, []);

  const handleSelectPlan = (serviceName, planName) => {
    setSelectedService(serviceName);
    setSelectedPlan(planName);
    if (contactFormRef.current) {
      contactFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pricing-page-wrapper">
      <SiteHeader active="pricing" />

      {/* Category Anchor Sub-nav */}
      <div className="pricing-sub-nav">
        <a href="#ads" className="sub-nav-link">Ads</a>
        <a href="#websites" className="sub-nav-link">Websites</a>
        <a href="#creative" className="sub-nav-link">Creative</a>
        <a href="#video" className="sub-nav-link">AI Video</a>
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

              <button
                className={`pricing-btn ${plan.isPopular ? "pricing-btn-solid" : "pricing-btn-outline"}`}
                onClick={() => handleSelectPlan(plan.serviceName, plan.planParameter)}
              >
                {plan.buttonText}
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
                <button
                  className="pricing-btn pricing-btn-solid orange-bg"
                  onClick={() => handleSelectPlan(plan.serviceName, plan.planParameter)}
                >
                  {plan.buttonText}
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

        <div className="creative-packs-scroll-container">
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
                  <button
                    className={`pricing-btn pricing-btn-solid ${!plan.isHighlight ? "orange-bg" : ""}`}
                    style={buttonStyles}
                    onClick={() => handleSelectPlan(plan.serviceName, plan.planParameter)}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Video Solutions Section */}
      <section id="video" className="pricing-section video-solutions-section">
        <div className="section-title-wrapper video-title-wrapper">
          <h2 className="section-title-text">AI Video Solutions</h2>
          <p className="section-subtitle-text">Next-gen engagement through cinematic AI videos.</p>
        </div>

        <div className="video-pricing-grid">
          {videoPlans.map((plan, index) => (
            <div
              key={index}
              className={`video-plan-card ${plan.isPopular ? "video-popular-card" : ""}`}
            >
              {plan.isPopular && <div className="popular-top-badge">MOST POPULAR</div>}
              <h3 className="video-plan-title">{plan.level}</h3>

              <div className="video-qty-display">
                <span className="qty-number">{plan.qty}</span>
                <span className="qty-label">AI VIDEOS</span>
              </div>

              <div className={`video-price-box ${plan.isPopular ? "orange-bg" : ""}`}>
                ₹{plan.price.toLocaleString("en-IN")}
              </div>

              <p className="video-plan-desc">{plan.description}</p>

              <button
                className={`pricing-btn ${plan.isPopular ? "pricing-btn-solid orange-bg" : "pricing-btn-outline video-btn-orange"}`}
                onClick={() => handleSelectPlan(plan.serviceName, plan.planParameter)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section at the Bottom */}
      <section id="contact" className="section contact-section" ref={contactFormRef}>
        <div className="contact-card">
          <span className="contact-label">Secure Checkout / Inquire</span>
          <h2>Ready to scale your business?</h2>
          <p>
            {selectedPlan
              ? `You have selected: ${selectedPlan}. Complete the form below to initialize details.`
              : "Tell us about your project and selected packages to receive customized execution timelines."}
          </p>
          <form onSubmit={handleCheckoutSubmit}>
            <input name="userName" aria-label="Your name" placeholder="Your name" required />
            <input name="email" aria-label="Email address" placeholder="Email address" type="email" required />
            <input name="phone" aria-label="Phone number" placeholder="Phone number" required />
            <select
              aria-label="Service of interest"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value="" disabled>Service of interest</option>
              <option value="SEO Growth">SEO Growth / Creative Design Packs</option>
              <option value="Performance Marketing">Performance Marketing (Ads)</option>
              <option value="Web Development">Web Development (Static/Dynamic)</option>
              <option value="AI Automation">AI Video & Automation Solutions</option>
            </select>
            <textarea
              aria-label="Project brief"
              placeholder="Tell us about your project details or any customized requests"
              rows="5"
              defaultValue={selectedPlan ? `I am interested in signing up for the: ${selectedPlan}` : ""}
              key={selectedPlan}
            />
            <button type="submit">Pay and Submit Request</button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
