"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const footerGroups = [
  {
    title: "Contact",
    items: ["Office: +91-9096090701", "aidigitalbiz01@gmail.com", "Camp, Pune 411001"]
  },
  {
    title: "Services",
    items: ["Digital Marketing", "Web Development", "SMM Services", "SEO Services", "PPC Services"]
  },
  {
    title: "Graphic Design",
    items: ["Letterhead Designing", "Logo Designing", "Brochure Designing", "Pamphlet Designing"]
  },
  {
    title: "About Us",
    items: ["About Company", "Our Portfolio", "Articles", "Pricing", "Privacy Policy"]
  }
];

const navItems = [
  { label: "Home", href: "/", key: "home" },
  { label: "Services", href: "/#services", key: "services" },
  { label: "Why Us", href: "/#why", key: "why" },
  { label: "Prices", href: "/pricing", key: "pricing" },
  { label: "Portfolio", href: "/portfolio", key: "portfolio" },
  { label: "Blogs", href: "/#insights", key: "blogs" }
];

export function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export function Logo() {
  return (
    <a className="logo" href="/" aria-label="AI Digital home">
      <Image src="/logo-cropped.png" alt="AI Digital Logo" width={180} height={56} priority />
    </a>
  );
}

export function SiteHeader({ active = "home" }) {
  const [currentActive, setCurrentActive] = useState(active);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname;
    if (path === "/pricing") {
      setCurrentActive("pricing");
      return;
    }
    if (path === "/portfolio") {
      setCurrentActive("portfolio");
      return;
    }

    const sections = [
      { id: "top", key: "home" },
      { id: "services", key: "services" },
      { id: "why", key: "why" },
      { id: "insights", key: "blogs" }
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // offset to trigger active state earlier

      // Bottom scroll check
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setCurrentActive("blogs");
        return;
      }

      let activeSection = "home";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            activeSection = section.key;
          }
        }
      }
      setCurrentActive(activeSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);

  return (
    <nav className="top-nav">
      <Logo />
      <div className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            href={item.href}
            key={item.key}
            className={currentActive === item.key ? "active" : ""}
            aria-current={currentActive === item.key ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>
      <a className="nav-button" href="/#contact">Contact Us</a>
      <details className="mobile-menu">
        <summary className="mobile-menu-button" aria-label="Open navigation menu">
          <span className="material-symbols-outlined menu-icon" aria-hidden="true">menu</span>
          <span className="material-symbols-outlined close-icon" aria-hidden="true">close</span>
        </summary>
        <div className="mobile-menu-panel">
          {navItems.map((item) => (
            <a
              href={item.href}
              key={item.key}
              className={currentActive === item.key ? "active" : ""}
              aria-current={currentActive === item.key ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
          <a className="mobile-menu-cta" href="/#contact">Contact Us</a>
        </div>
      </details>
    </nav>
  );
}

export function SiteFooter() {
  const getHref = (item) => {
    if (item === "Pricing") return "/pricing";
    if (item === "Our Portfolio") return "/portfolio";
    return "/#contact";
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo />
          <strong>Innovate. Connect. Grow.</strong>
          <p>
            AI Digital is an AI-powered digital marketing agency helping
            businesses improve visibility, engagement, leads and measurable growth.
          </p>
          <div className="socials">
            {["public", "alternate_email", "play_circle", "work", "photo_camera"].map((icon) => (
              <a href="/" key={icon} aria-label={icon.replace("_", " ")}>
                <Icon name={icon} />
              </a>
            ))}
          </div>
        </div>
        {footerGroups.map((group) => (
          <div className="footer-column" key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map((item) => (
              <a href={getHref(item)} key={item}>{item}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="copyright">Copyright 2013-2026 AI Digital, All Right Reserved</div>
    </footer>
  );
}


