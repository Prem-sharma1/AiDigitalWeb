"use client";

import { useRef } from "react";
import GoalSelector from "./components/GoalSelector";
import { Icon, SiteFooter, SiteHeader } from "./components/SiteChrome";
import HeroOrbit from "./components/HeroOrbit";
import ContactForm from "./components/ContactForm";

const services = [
  {
    icon: "search_insights",
    title: "SEO",
    tone: "blue",
    body: "Dominate search rankings with AI-driven content and technical optimization."
  },
  {
    icon: "campaign",
    title: "Performance Marketing",
    tone: "orange",
    body: "Data-backed ad campaigns that maximize ROI across every channel."
  },
  {
    icon: "share",
    title: "Social Media",
    tone: "blue",
    body: "Engaging community building and viral content strategies."
  },
  {
    icon: "web",
    title: "Website Design",
    tone: "blue",
    body: "Conversion-focused digital experiences built for speed and performance."
  },
  {
    icon: "branding_watermark",
    title: "Branding",
    tone: "orange",
    body: "Memorable identity design and messaging that resonates with your audience."
  }
];

const campaigns = [
  {
    icon: "query_stats",
    title: "SEO Growth Campaign",
    body: "Every organic search strategy starts with keyword mapping, audits, and AI-supported content planning.",
    tags: ["Technical", "Content", "Local"],
    fit: "Search visibility"
  },
  {
    icon: "ads_click",
    title: "Google Ads Campaign",
    body: "High-intent search campaigns with landing pages, tracking, and ongoing ROAS improvement.",
    tags: ["Search", "Leads", "ROI"],
    fit: "Paid growth"
  },
  {
    icon: "mail",
    title: "Meta Ads Campaign",
    body: "Audience-first targeting, creative testing, and retargeting for brand and sales growth.",
    tags: ["Creative", "Social", "Retargeting"],
    fit: "Social sales"
  },
  {
    icon: "webhook",
    title: "Website & Landing Page",
    body: "CRO-focused pages that guide visitors toward clear conversion actions and measurable leads.",
    tags: ["CRO", "UX", "Speed"],
    fit: "Conversion"
  },
  {
    icon: "edit_square",
    title: "Content Marketing",
    body: "SEO-led content systems built around intent, authority, and helpful editorial calendars.",
    tags: ["Blogs", "SEO", "Authority"],
    fit: "Trust building"
  },
  {
    icon: "analytics",
    title: "Analytics & Reporting",
    body: "Dashboards and monthly reporting that turn campaign activity into simple decisions.",
    tags: ["GA4", "Looker", "KPI"],
    fit: "Performance clarity"
  },
  {
    icon: "movie",
    title: "AI Video Creation",
    body: "Short-form video concepts, scripts, and production direction for paid and organic channels.",
    tags: ["Shorts", "Reels", "Motion"],
    fit: "Video content"
  },
  {
    icon: "post_add",
    title: "Social Media Post Creation",
    body: "Automated and manual high-engagement posts, captions, and scheduling for active brands.",
    tags: ["Graphics", "Captions", "Scheduling"],
    fit: "Active brands"
  }
];

const whyItems = [
  {
    icon: "troubleshoot",
    title: "AI-Powered Research",
    body: "Deep data analysis to uncover hidden opportunities in your market."
  },
  {
    icon: "radar",
    title: "Competitor Intel",
    body: "Track and outmaneuver competitors with real-time insights."
  },
  {
    icon: "speed",
    title: "Rapid Execution",
    body: "Deploy campaigns faster with streamlined agile workflows."
  },
  {
    icon: "auto_graph",
    title: "Predictive Analytics",
    body: "Forecast trends and optimize budgets before spending a dime."
  },
  {
    icon: "groups",
    title: "Dedicated Team",
    body: "A squad of experts acting as an extension of your company."
  },
  {
    icon: "verified",
    title: "Proven Results",
    body: "Track record of scaling businesses across multiple industries."
  }
];

const insights = [
  {
    label: "SEO",
    title: "The Future of AI-Driven Content Creation in 2026",
    body: "Discover how artificial intelligence is reshaping organic search strategies."
  },
  {
    label: "Performance Marketing",
    title: "Maximizing ROAS with Predictive Analytics",
    body: "Learn how to predict campaign success before allocating ad spend."
  },
  {
    label: "Branding",
    title: "Building Trust in a Digital World",
    body: "Strategies for maintaining authentic connection while scaling your brand."
  },
  {
    label: "Social Media",
    title: "Viral Video Marketing Secrets for Startups",
    body: "How to conceptualize, edit, and launch short-form content that captures views."
  },
  {
    label: "PPC",
    title: "Google Ads vs. Meta Ads: Which Channel Wins?",
    body: "A deep dive comparison of cost-per-click, target audiences, and conversion rates."
  },
  {
    label: "Web Design",
    title: "CRO Guidelines for High-Converting Landing Pages",
    body: "Key elements that turn casual digital marketing traffic into verified paying customers."
  },
  {
    label: "Branding",
    title: "The Science Behind Curated Color Palettes",
    body: "How choosing modern colors, fonts, and typography directly impacts consumer trust."
  },
  {
    label: "Local SEO",
    title: "Dominating Google Map Listings in Your City",
    body: "Actionable local SEO guidelines to place your service business in the top local 3-pack."
  }
];

export default function Home() {
  const blogContainerRef = useRef(null);

  const handleBlogScroll = (direction) => {
    const container = blogContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <main id="top">
      <SiteHeader active="home" />

      <header className="hero section">
        <div className="hero-copy">
          <h1>
            AI-Powered Digital Marketing That Connects Brands With{" "}
            <span>Measurable Growth</span>
          </h1>
          <p>
            AI Digital helps businesses grow through SEO, ads, social, design,
            and analytics powered by AI.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Get Free Growth Audit</a>
            <a className="button button-ghost" href="#services">View Services</a>
          </div>
        </div>

        {/* Managed cleanly entirely through DOM API layer references inside */}
        <HeroOrbit />
      </header>

      <section className="trust-strip">
        <p>Built for startups, local businesses, service brands and growth-focused companies.</p>
        <div className="trust-grid">
          <div><Icon name="smart_toy" /><span>AI-Assisted Strategy</span></div>
          <div><Icon name="query_stats" /><span>Performance Tracking</span></div>
          <div><Icon name="summarize" /><span>Transparent Reporting</span></div>
          <div><Icon name="rocket_launch" /><span>Growth-Focused Execution</span></div>
        </div>
      </section>

      <section id="services" className="section section-muted">
        <div className="section-heading">
          <h2>Digital Marketing Services Built for Growth</h2>
          <p>
            From visibility to conversion, AI Digital brings strategy, execution
            and analytics under one growth system.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article className={`service-card ${service.tone}`} key={service.title}>
              <Icon name={service.icon} />
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section framework">
        <h2>Innovate. Connect. Grow.</h2>
        <div className="framework-steps">
          <div><Icon name="lightbulb" /><span>Innovate</span></div>
          <div><Icon name="hub" /><span>Connect</span></div>
          <div><Icon name="trending_up" /><span>Grow</span></div>
        </div>
      </section>

      <GoalSelector />

      <section id="campaigns" className="section section-muted campaigns">
        <div className="section-heading">
          <span className="eyebrow">AI-powered marketing services</span>
          <h2>Choose the Right Campaign for Your Growth Goal</h2>
          <p>
            From search visibility to lead generation, AI Digital creates
            strategy, execution and analytics to help businesses grow with
            measurable campaigns.
          </p>
        </div>
        <div className="campaign-grid">
          {campaigns.map((campaign) => (
            <article className="campaign-card" key={campaign.title}>
              <Icon name={campaign.icon} />
              <h3>{campaign.title}</h3>
              <p>{campaign.body}</p>
              <div className="tag-row">
                {campaign.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <small>Recommended for: {campaign.fit}</small>
            </article>
          ))}
        </div>
      </section>

      <section id="why" className="section why">
        <div className="section-heading compact">
          <h2>Why Choose AI Digital</h2>
        </div>
        <div className="why-grid">
          {whyItems.map((item) => (
            <article key={item.title} className="why-item">
              <Icon name={item.icon} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="insights" className="section section-muted insights">
        <div className="split-heading">
          <h2>Latest Insights</h2>
          <a href="#contact">View All <Icon name="arrow_forward" /></a>
        </div>
        <div className="creative-slider-wrapper">
          <button
            type="button"
            className="slider-nav-btn prev"
            onClick={() => handleBlogScroll("left")}
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <div className="insight-grid" ref={blogContainerRef}>
            {insights.map((insight) => (
              <article className="insight-card" key={insight.title}>
                <div className="insight-image" />
                <div className="insight-body">
                  <span>{insight.label}</span>
                  <h3>{insight.title}</h3>
                  <p>{insight.body}</p>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="slider-nav-btn next"
            onClick={() => handleBlogScroll("right")}
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <ContactForm />
      </section>

      <SiteFooter />
    </main>
  );
}