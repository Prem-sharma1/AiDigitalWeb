"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";

const creativeGroups = [
  {
    industry: "Real Estate",
    description: "Websites, campaigns, AI property promotions, creative branding, and real estate reels.",
    images: [
      {
        src: "/creative_content/Creative1.jpeg",
        title: "Luxury Villa Showcase",
        description: "Branding creative for high-end residential real estate listing.",
        globalIndex: 0,
        type: "image"
      },
      {
        src: "/creative_content/Creative3.jpeg",
        title: "Global University Banner",
        description: "Promotional visual for academic programs and admissions.",
        globalIndex: 2,
        type: "image"
      },
      {
        src: "/creative_content/Creative4.jpeg",
        title: "Online Learning Poster",
        description: "E-learning platform advertisement graphic designed for campaigns.",
        globalIndex: 3,
        type: "image"
      },
      {
        src: "/ai_videos/Viviana Realty.mp4",
        title: "Viviana Realty 1",
        description: "AI-assisted promotional video showcasing luxury apartments, property highlights, and real estate offerings.",
        globalIndex: 26,
        type: "video"
      },
      {
        src: "/ai_videos/Viviana Realty video 2.mp4",
        title: "Viviana Realty 2",
        description: "AI-assisted marketing video highlighting modern architectural design, floor plans, and residential amenities.",
        globalIndex: 27,
        type: "video"
      },
      {
        src: "/ai_videos/Viviana Realty video 3 with company logo .mp4",
        title: "Viviana Realty 3",
        description: "AI-assisted branded real estate presentation video featuring company logo and listing details.",
        globalIndex: 28,
        type: "video"
      }
    ]
  },
  {
    industry: "Education",
    description: "Educational websites, admission campaigns, student-focused creatives, and promotional reels.",
    images: [
      {
        src: "/ai_videos/Gurukul Sketch  final.mp4",
        title: "Gurukul Sketch",
        description: "AI-assisted promotional video illustrating educational learning, branding, or classroom setup concepts.",
        globalIndex: 14,
        type: "video"
      }
    ]
  },
  {
    industry: "Healthcare",
    description: "Healthcare websites, awareness campaigns, AI medical videos, and promotional content.",
    images: [
      {
        src: "/creative_content/Creative2.jpeg",
        title: "Healthcare Lead Campaign",
        description: "Digital marketing campaign designed to help doctors, clinics, and hospitals generate quality leads.",
        globalIndex: 1,
        type: "image"
      },
      {
        src: "/creative_content/Creative5.jpeg",
        title: "Healthcare Digital Marketing Campaign",
        description: "An ad creative and landing page concept designed for B2B lead generation targeting doctors and clinics, highlighting social media marketing, SEO, and paid ad management services.",
        globalIndex: 4,
        type: "image"
      },
      {
        src: "/ai_videos/AiVideo1.mp4",
        title: "Healthcare AI Video",
        description: "AI-assisted healthcare promotional video showcasing modern clinic solutions.",
        globalIndex: 10,
        type: "video"
      },
      {
        src: "/ai_videos/Mankikar Hospital.mp4",
        title: "Mankikar Hospital",
        description: "AI-assisted marketing video showcasing hospital infrastructure, doctor panels, and patient care services.",
        globalIndex: 16,
        type: "video"
      },
      {
        src: "/ai_videos/Dr Ritesh Gupta-Orthopedic Surgeon Gorakhpur.mp4",
        title: "Dr. Ritesh Gupta",
        description: "AI-assisted promotional video for orthopedic surgery consultations and specialist healthcare services.",
        globalIndex: 24,
        type: "video"
      }
    ]
  },
  {
    industry: "Finance",
    description: "Finance dashboards, investment campaigns, branding creatives, and educational reels.",
    images: [
      {
        src: "/creative_content/Creative7.jpeg",
        title: "Investment Growth Ad",
        description: "Wealth management and finance growth promotional content.",
        globalIndex: 6,
        type: "image"
      },
      {
        src: "/creative_content/Creative8.jpeg",
        title: "Crypto Platform Asset",
        description: "Digital currency trading platform banner design concept.",
        globalIndex: 7,
        type: "image"
      },
      {
        src: "/ai_videos/VIYOM FINANCE SERVICES.mp4",
        title: "Viyom Finance Services",
        description: "AI-assisted promotional video highlighting financial growth and wealth management services.",
        globalIndex: 11,
        type: "video"
      },
      {
        src: "/ai_videos/LIC Bima Sakhi.mp4",
        title: "LIC Bima Sakhi",
        description: "AI-assisted promotional video illustrating insurance and financial planning benefits.",
        globalIndex: 12,
        type: "video"
      },
      {
        src: "/ai_videos/mana  das.mp4",
        title: "Mana Das 1",
        description: "AI-assisted promotional video for financial coaching and wealth advisory services.",
        globalIndex: 18,
        type: "video"
      },
      {
        src: "/ai_videos/mana das 2 .mp4",
        title: "Mana Das 2",
        description: "AI-assisted marketing video highlighting financial solutions and business planning advice.",
        globalIndex: 19,
        type: "video"
      },
      {
        src: "/ai_videos/Altius Inforway .mp4",
        title: "Altius Inforway",
        description: "AI-assisted promotional video illustrating corporate finance, solutions, and enterprise software services.",
        globalIndex: 20,
        type: "video"
      },
      {
        src: "/ai_videos/RR Capital .mp4",
        title: "RR Capital 1",
        description: "AI-assisted marketing video promoting capital growth, investment consulting, and advisory services.",
        globalIndex: 21,
        type: "video"
      },
      {
        src: "/ai_videos/RR Capital video 2.mp4",
        title: "RR Capital 2",
        description: "AI-assisted promotional video illustrating mutual funds, wealth accumulation, and asset management.",
        globalIndex: 22,
        type: "video"
      },
      {
        src: "/ai_videos/TAXCLAIR .mp4",
        title: "TaxClair",
        description: "AI-assisted promotional video illustrating tax planning, calculation, and online filing services.",
        globalIndex: 23,
        type: "video"
      },
      {
        src: "/ai_videos/Final SM MULTI FLEET .mp4",
        title: "SM Multi Fleet",
        description: "AI-assisted promotional video illustrating fleet management financing, logistics investment, and corporate asset planning.",
        globalIndex: 30,
        type: "video"
      }
    ]
  },
  {
    industry: "Hospitality",
    description: "Hotel booking platforms, restaurant campaigns, AI hospitality promos, and social media reels.",
    images: [
      {
        src: "/creative_content/Creative6.jpeg",
        title: "Restaurant Brand Campaign",
        description: "High-quality lead generation and marketing flyer for dining brands.",
        globalIndex: 5,
        type: "image"
      },
      {
        src: "/creative_content/Creative9.jpeg",
        title: "Gourmet Bistro Banner",
        description: "Aesthetic culinary advertising graphic for restaurant promotions.",
        globalIndex: 8,
        type: "image"
      },
    ]
  },
  {
    industry: "Solar",
    description: "Solar websites, green energy campaigns, AI solar videos, and promotional clean energy reels.",
    images: [
      {
        src: "/ai_videos/kwikM solar.mp4",
        title: "KwikM Solar",
        description: "AI-assisted promotional video illustrating clean energy solutions, solar panel installations, and sustainable technology benefits.",
        globalIndex: 15,
        type: "video"
      }
    ]
  },
  {
    industry: "Agriculture",
    description: "Agricultural websites, farming campaigns, AI agro videos, and promotional sustainable agriculture reels.",
    images: [
      {
        src: "/ai_videos/MACK AGRO.mp4",
        title: "Mack Agro",
        description: "AI-assisted promotional video illustrating advanced farming equipment, crop protection, and modern agro-solutions.",
        globalIndex: 25,
        type: "video"
      },
      {
        src: "/ai_videos/Final Vidhivihan Agro Products .mp4",
        title: "Vidhivihan Agro Products",
        description: "AI-assisted promotional video showcasing organic seeds, crop protection products, and agricultural growth solutions.",
        globalIndex: 29,
        type: "video"
      }
    ]
  },
  {
    industry: "Other Projects",
    description: "Additional marketing campaigns, custom integrations, branding assets, and creative videos.",
    images: [
      {
        src: "/creative_content/Creative10.jpeg",
        title: "SaaS Launch Creative",
        description: "Software product launch promotional design visual.",
        globalIndex: 9,
        type: "image"
      },
      {
        src: "/ai_videos/MOTORYDO.mp4",
        title: "Motorydo",
        description: "AI-assisted marketing video showcasing automotive detailing, tracking, or booking concepts.",
        globalIndex: 13,
        type: "video"
      },
      {
        src: "/ai_videos/SWAMINI TOURS.mp4",
        title: "Swamini Tours",
        description: "AI-assisted promotional video illustrating travel packages, itineraries, and tourism experiences.",
        globalIndex: 17,
        type: "video"
      }
    ]
  }
];

export default function CreativeGrid({ activeFilter = "All" }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const scrollContainers = useRef({});
  const [creativeGroupsState, setCreativeGroupsState] = useState(creativeGroups);

  useEffect(() => {
    fetch("/api/admin/portfolio?t=" + Date.now(), { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load portfolio");
      })
      .then((data) => {
        if (data.creativeGroups) {
          setCreativeGroupsState(data.creativeGroups);
        }
      })
      .catch((err) => console.warn("Using static fallback creative groups:", err));
  }, []);

  // Filter groups and their media items dynamically based on the active tab/filter
  const filteredGroups = useMemo(() => {
    return creativeGroupsState.map(group => {
      const filteredImages = group.images.filter(img => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Creative Content") return img.type === "image";
        if (activeFilter === "AI Videos") return img.type === "video";
        if (activeFilter === "Reels") return img.type === "video" || img.type === "reel";
        return true;
      });
      return {
        ...group,
        images: filteredImages
      };
    }).filter(group => group.images.length > 0);
  }, [activeFilter, creativeGroupsState]);

  // Flat array of visible items for lightbox navigation
  const visibleItems = useMemo(() => {
    return filteredGroups.flatMap(group => group.images);
  }, [filteredGroups]);

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
        setSelectedImageIndex((current) => (current + 1) % visibleItems.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((current) => (current - 1 + visibleItems.length) % visibleItems.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, visibleItems]);

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

  const activeImage = selectedImageIndex !== null ? visibleItems[selectedImageIndex] : null;

  return (
    <>
      {filteredGroups.map((group) => (
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
              const imageIndex = visibleItems.findIndex((item) => item.src === img.src);
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
                  <div className="creative-img-wrapper" style={{ position: "relative", width: "100%", height: "200px" }}>
                    {img.type === "video" ? (
                      <video
                        src={img.src}
                        className="creative-img"
                        style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
                        muted
                        playsInline
                        loop
                        onMouseOver={(e) => e.target.play()}
                        onMouseOut={(e) => e.target.pause()}
                      />
                    ) : (
                      <Image
                        src={img.src}
                        alt={img.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="creative-img"
                      />
                    )}
                    <div className="creative-overlay">
                      <div className="creative-overlay-icon">
                        <span className="material-symbols-outlined">
                          {img.type === "video" ? "play_circle" : "zoom_in"}
                        </span>
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
              onClick={() => setSelectedImageIndex((current) => (current - 1 + visibleItems.length) % visibleItems.length)}
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="lightbox-image-wrapper">
              {activeImage.type === "video" ? (
                <video
                  src={activeImage.src}
                  controls
                  autoPlay
                  className="lightbox-image"
                  style={{ maxHeight: "80vh", maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }}
                />
              ) : (
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="lightbox-image"
                />
              )}
            </div>

            <button
              type="button"
              className="lightbox-nav next"
              onClick={() => setSelectedImageIndex((current) => (current + 1) % visibleItems.length)}
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
