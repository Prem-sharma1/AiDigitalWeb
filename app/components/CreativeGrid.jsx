"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const creativeGroups = [
  {
    industry: "Real Estate",
    description: "Websites, campaigns, AI property promotions, creative branding, and real estate reels.",
    images: [
      {
        src: "/Creative1.jpeg",
        title: "Luxury Villa Showcase",
        description: "Branding creative for high-end residential real estate listing.",
        globalIndex: 0
      },
      {
        src: "/Creative3.jpeg",
        title: "Global University Banner",
        description: "Promotional visual for academic programs and admissions.",
        globalIndex: 2
      },
      {
        src: "/Creative4.jpeg",
        title: "Online Learning Poster",
        description: "E-learning platform advertisement graphic designed for campaigns.",
        globalIndex: 3
      },
    ]
  },
  {
    industry: "Education",
    description: "Educational websites, admission campaigns, student-focused creatives, and promotional reels.",
    images: [

    ]
  },
  {
    industry: "Healthcare",
    description: "Healthcare websites, awareness campaigns, AI medical videos, and promotional content.",
    images: [
      {
        src: "/Creative2.jpeg",
        title: "Healthcare Lead Campaign",
        description: "Digital marketing campaign designed to help doctors, clinics, and hospitals generate quality leads.",
        globalIndex: 1
      },
      {
        src: "/Creative5.jpeg",
        title: "Healthcare Digital Marketing Campaign",
        description: "An ad creative and landing page concept designed for B2B lead generation targeting doctors and clinics, highlighting social media marketing, SEO, and paid ad management services.",
        globalIndex: 4
      },
    ]
  },
  {
    industry: "Finance",
    description: "Finance dashboards, investment campaigns, branding creatives, and educational reels.",
    images: [
      {
        src: "/Creative7.jpeg",
        title: "Investment Growth Ad",
        description: "Wealth management and finance growth promotional content.",
        globalIndex: 6
      },
      {
        src: "/Creative8.jpeg",
        title: "Crypto Platform Asset",
        description: "Digital currency trading platform banner design concept.",
        globalIndex: 7
      }
    ]
  },
  {
    industry: "Hospitality",
    description: "Hotel booking platforms, restaurant campaigns, AI hospitality promos, and social media reels.",
    images: [
      {
        src: "/Creative6.jpeg",
        title: "Restaurant Brand Campaign",
        description: "High-quality lead generation and marketing flyer for dining brands.",
        globalIndex: 5
      },
      {
        src: "/Creative9.jpeg",
        title: "Gourmet Bistro Banner",
        description: "Aesthetic culinary advertising graphic for restaurant promotions.",
        globalIndex: 8
      },
    ]
  },
  {
    industry: "Other Projects",
    description: "Additional marketing campaigns, custom integrations, branding assets, and creative videos.",
    images: [
      {
        src: "/Creative10.jpeg",
        title: "SaaS Launch Creative",
        description: "Software product launch promotional design visual.",
        globalIndex: 9
      }
    ]
  }
];

// Flat array for easy lightbox navigation
const allImages = creativeGroups.flatMap((group) => group.images);

export default function CreativeGrid() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const scrollContainers = useRef({});

  const handleScroll = (industry, direction) => {
    const container = scrollContainers.current[industry];
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Close lightbox on Escape, navigate on ArrowLeft/ArrowRight
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((current) => (current + 1) % allImages.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((current) => (current - 1 + allImages.length) % allImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  // Disable body scroll when lightbox is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImageIndex]);

  const activeImage = selectedImageIndex !== null ? allImages[selectedImageIndex] : null;

  return (
    <>
      {creativeGroups.map((group) => (
        <article className="industry-section" key={group.industry} style={{ marginTop: "24px" }}>
          <div className="industry-copy">
            <span className="industry-label">Industry</span>
            <h3>{group.industry}</h3>
            <p>{group.description}</p>
            {group.images.length > 2 && (
              <div className="portfolio-slider-controls" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => handleScroll(group.industry, "left")}
                  aria-label="Scroll left"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll(group.industry, "right")}
                  aria-label="Scroll right"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
          <div
            className="creative-grid"
            ref={(el) => {
              if (el) scrollContainers.current[group.industry] = el;
            }}
          >
            {group.images.map((img) => {
              const imageIndex = allImages.findIndex((item) => item.src === img.src);
              return (
                <div
                  className="creative-card"
                  key={img.src}
                  onClick={() => setSelectedImageIndex(imageIndex)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${img.title} in full screen`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedImageIndex(imageIndex);
                    }
                  }}
                >
                  <div className="creative-img-wrapper">
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="creative-img"
                    />
                    <div className="creative-overlay">
                      <div className="creative-overlay-icon">
                        <span className="material-symbols-outlined">zoom_in</span>
                      </div>
                    </div>
                  </div>
                  <div className="creative-card-info">
                    <h4>{img.title}</h4>
                    <p>{img.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      ))}

      {activeImage && (
        <div
          className="creative-lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedImageIndex(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div className="lightbox-content-container">
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setSelectedImageIndex(null)}
              aria-label="Close lightbox"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <button
              type="button"
              className="lightbox-nav prev"
              onClick={() => setSelectedImageIndex((current) => (current - 1 + allImages.length) % allImages.length)}
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="lightbox-image-wrapper">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="lightbox-image"
              />
            </div>

            <button
              type="button"
              className="lightbox-nav next"
              onClick={() => setSelectedImageIndex((current) => (current + 1) % allImages.length)}
              aria-label="Next image"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            <div className="lightbox-caption">
              <h3 id="lightbox-title">{activeImage.title}</h3>
              <p>{activeImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
