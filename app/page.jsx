"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import GoalSelector from "./components/GoalSelector";
import { Icon, SiteFooter, SiteHeader } from "./components/SiteChrome";
import HeroOrbit from "./components/HeroOrbit";
import ContactForm from "./components/ContactForm";
import useScrollReveal from "./hooks/useScrollReveal";

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
    icon: "ads_click",
    title: "Google Ads Campaign",
    body: "High-intent search campaigns with landing pages, tracking, and ongoing ROAS improvement.",
    tags: ["Search", "Leads", "ROI"],
    fit: "Paid growth",
    price: "Starts at ₹4,999/mo",
    link: "/pricing#ads"
  },
  {
    icon: "mail",
    title: "Meta Ads Campaign",
    body: "Audience-first targeting, creative testing, and retargeting for brand and sales growth.",
    tags: ["Creative", "Social", "Retargeting"],
    fit: "Social sales",
    price: "Starts at ₹2,499/mo",
    link: "/pricing#ads"
  },
  {
    icon: "webhook",
    title: "Website & Landing Page",
    body: "CRO-focused pages that guide visitors toward clear conversion actions and measurable leads.",
    tags: ["CRO", "UX", "Speed"],
    fit: "Conversion",
    price: "Starts at ₹7,499",
    link: "/pricing#websites"
  },
  {
    icon: "movie",
    title: "AI Video Creation",
    body: "Short-form video concepts, scripts, and production direction for paid and organic channels.",
    tags: ["Shorts", "Reels", "Motion"],
    fit: "Video content",
    price: "Starts at ₹4,500",
    link: "/pricing#aivideo"
  },
  {
    icon: "post_add",
    title: "Social Media Post Creation",
    body: "Automated and manual high-engagement posts, captions, and scheduling for active brands.",
    tags: ["Graphics", "Captions", "Scheduling"],
    fit: "Active brands",
    price: "Starts at ₹599",
    link: "/pricing#creative"
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

export default function Home() {
  const [homeBlogs, setHomeBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const blogContainerRef = useRef(null);

  useScrollReveal([loading]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setHomeBlogs(shuffled.slice(0, 12));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blogs for homepage:", err);
        setLoading(false);
      });
  }, []);

  const getBlogLink = (post) => {
    const contentTrimmed = post.content ? post.content.trim() : "";
    const slugTrimmed = post.slug ? post.slug.trim() : "";
    
    if (contentTrimmed.startsWith("http://") || contentTrimmed.startsWith("https://")) {
      return contentTrimmed;
    }
    if (slugTrimmed.startsWith("http://") || slugTrimmed.startsWith("https://")) {
      return slugTrimmed;
    }
    
    const mdLinkMatch = contentTrimmed.match(/^\[.*?\]\((https?:\/\/.*?)\)$/);
    if (mdLinkMatch) {
      return mdLinkMatch[1];
    }
    
    if (/^https?:\/\/[^\s]+$/.test(contentTrimmed)) {
      return contentTrimmed;
    }
    
    return `/blog/${post.slug}`;
  };

  const handleBlogScroll = (direction) => {
    const container = blogContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.95;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <main id="top">
      <SiteHeader active="home" />

      {/* 1. Introduction */}
      <header className="hero section">
        <div className="hero-copy reveal">
          <h1>
            Your Business <span>Our Success</span>
          </h1>
          <p>
            AI Digital helps businesses grow By adopting 360 Degress approach through SMO,Google Ads,SEO,Website and analytics powered by AI
          </p>
          <div className="hero-actions reveal reveal-delay-1">
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

      {/* 2. Choose the Right Services for Your Growth Goal */}
      <section id="services" className="section section-muted campaigns">
        <div className="section-heading">
          <span className="eyebrow">AI-powered marketing services</span>
          <h2>Choose the Right Services for Your Growth Goal</h2>
          <p>
            From search visibility to lead generation, AI Digital creates
            strategy, execution and analytics to help businesses grow with
            measurable campaigns.
          </p>
        </div>
        <div className="campaign-grid">
          {campaigns.map((campaign, i) => (
            <article className={`campaign-card reveal reveal-delay-${(i % 3) + 1}`} key={campaign.title}>
              <Icon name={campaign.icon} />
              <h3>{campaign.title}</h3>
              <p>{campaign.body}</p>
              <div className="tag-row">
                {campaign.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <small>Recommended for: {campaign.fit}</small>
              <a href={campaign.link} className="campaign-pricing-btn">Check Pricing</a>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Advantages */}
      <section id="why" className="section why">
        <div className="section-heading compact">
          <h2>Why Choose AI Digital</h2>
        </div>
        <div className="why-grid">
          {whyItems.map((item, i) => (
            <article key={item.title} className={`why-item reveal reveal-delay-${(i % 3) + 1}`}>
              <Icon name={item.icon} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Client Goal */}
      <GoalSelector />

      {/* Other (Insights & Contact) */}
      <section id="insights" className="section section-muted insights">
        <div className="split-heading">
          <h2>Latest Insights</h2>
          <Link href="/blog">View All <Icon name="arrow_forward" /></Link>
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
            {loading ? (
              <div style={{ padding: "40px 0", textAlign: "center", width: "100%", color: "#64748b", fontWeight: "600" }}>
                Loading latest insights...
              </div>
            ) : homeBlogs.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", width: "100%", color: "#64748b", fontWeight: "600" }}>
                No insights found. Check back later!
              </div>
            ) : (
              homeBlogs.map((post) => {
                const url = getBlogLink(post);
                const isExternal = url.startsWith("http://") || url.startsWith("https://");
                
                const CardTag = isExternal ? "a" : Link;
                const cardProps = isExternal 
                  ? { href: url, target: "_blank", rel: "noopener noreferrer" } 
                  : { href: url };

                return (
                  <CardTag 
                    {...cardProps} 
                    key={post.id} 
                    className="insight-card-link reveal"
                  >
                    <article className="insight-card" style={{ height: "100%" }}>
                      <div className="insight-image">
                        <img
                          src={post.coverImage || "/creative_content/Creative1.jpeg"}
                          alt={post.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="insight-body">
                        <span>{post.category}</span>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                      </div>
                    </article>
                  </CardTag>
                );
              })
            )}
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