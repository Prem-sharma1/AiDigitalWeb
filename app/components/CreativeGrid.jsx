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
  },
  {
    industry: "Construction",
    description: "All-in-one Construction ERP & Project Management software showcase, web portal, and local SEO campaign.",
    images: [
      {
        src: "https://www.hitoffice.co.in/",
        title: "Hitoffice Construction ERP",
        description: "Complete construction ERP and project management software website showcase. Feature-rich, optimized for lead generation and search engine visibility.",
        globalIndex: 101,
        type: "website"
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

  const getMediaType = (type, src, category) => {
    if (category === "image" || category === "video" || category === "reel" || category === "website") {
      return category;
    }
    
    let resolvedType = type;
    if (!resolvedType && src) {
      const url = src.toLowerCase();
      if (url.includes("youtube.com") || url.includes("youtu.be")) resolvedType = "youtube";
      else if (url.includes("instagram.com/reel") || url.includes("instagram.com/p")) resolvedType = "instagram";
      else if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") || url.endsWith(".mov")) resolvedType = "video";
      else if (url.startsWith("http")) resolvedType = "website";
      else resolvedType = "image";
    }

    if (resolvedType === "youtube" || resolvedType === "iframe" || resolvedType === "video") return "video";
    if (resolvedType === "instagram" || resolvedType === "reel") return "reel";
    if (resolvedType === "website") return "website";
    return "image";
  };

  const getPlayerType = (src, type) => {
    if (type === "website") return "website";
    if (!src) return "image";
    const url = src.toLowerCase();
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("instagram.com/reel") || url.includes("instagram.com/p")) return "instagram";
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") || url.endsWith(".mov")) return "video";
    if (url.startsWith("http") && !url.match(/\.(jpeg|jpg|gif|png|webp|svg)/)) return "website";
    return "image";
  };

  const getYoutubeThumbnail = (src) => {
    let videoId = "";
    if (src.includes("youtu.be/")) {
      videoId = src.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
    } else if (src.includes("youtube.com/shorts/")) {
      videoId = src.split("youtube.com/shorts/")[1]?.split("?")[0]?.split("&")[0];
    } else if (src.includes("v=")) {
      videoId = src.split("v=")[1]?.split("&")[0];
    } else if (src.includes("embed/")) {
      videoId = src.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  const getThumbnail = (src, type) => {
    const playerType = getPlayerType(src, type);
    if (playerType === "youtube") {
      const ytThumb = getYoutubeThumbnail(src);
      if (ytThumb) return ytThumb;
    }
    if (playerType === "instagram") {
      return "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60";
    }
    if (playerType === "iframe") {
      return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60";
    }
    if (playerType === "website") {
      if (src && (src.startsWith("http://") || src.startsWith("https://"))) {
        return `https://image.thum.io/get/${src}`;
      }
      return src;
    }
    return src;
  };

  const getEmbedUrl = (src) => {
    if (!src) return "";
    if (src.includes("youtube.com") || src.includes("youtu.be")) {
      let videoId = "";
      if (src.includes("youtu.be/")) {
        videoId = src.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
      } else if (src.includes("youtube.com/shorts/")) {
        videoId = src.split("youtube.com/shorts/")[1]?.split("?")[0]?.split("&")[0];
      } else if (src.includes("v=")) {
        videoId = src.split("v=")[1]?.split("&")[0];
      } else if (src.includes("embed/")) {
        videoId = src.split("embed/")[1]?.split("?")[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : src;
    }
    if (src.includes("instagram.com/reel") || src.includes("instagram.com/p")) {
      const cleanUrl = src.split("?")[0].replace(/\/+$/, "");
      return `${cleanUrl}/embed/`;
    }
    return src;
  };

  // Filter groups and their media items dynamically based on the active tab/filter
  const filteredGroups = useMemo(() => {
    return creativeGroupsState.map(group => {
      const filteredImages = group.images.filter(img => {
        const type = getMediaType(img.type, img.src, img.category);
        if (activeFilter === "All") return true;
        if (activeFilter === "Creative Content") return type === "image";
        if (activeFilter === "AI Videos") return type === "video";
        if (activeFilter === "Reels") return type === "reel";
        if (activeFilter === "Website & SEO") return type === "website";
        return true;
      });

      // Sort images by globalIndex/sequence ascending
      const sortedImages = [...filteredImages].sort((a, b) => {
        const indexA = a.globalIndex !== undefined && a.globalIndex !== null && a.globalIndex !== "" ? Number(a.globalIndex) : 999999;
        const indexB = b.globalIndex !== undefined && b.globalIndex !== null && b.globalIndex !== "" ? Number(b.globalIndex) : 999999;
        return indexA - indexB;
      });

      return {
        ...group,
        images: sortedImages
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
                    {(() => {
                      const playerType = getPlayerType(img.src, img.type);
                      const isExternalUrl = img.src && (img.src.startsWith("http://") || img.src.startsWith("https://"));

                      if (playerType === "video") {
                        return (
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
                        );
                      }

                      // Website type: if local uploaded image, render directly; if external URL, use thum.io screenshot
                      if (playerType === "website") {
                        const thumb = isExternalUrl
                          ? `https://image.thum.io/get/${img.src}`
                          : img.src;
                        return (
                          <img
                            src={thumb}
                            alt={img.title}
                            className="creative-img"
                            style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
                            loading="lazy"
                          />
                        );
                      }
                      
                      const thumb = getThumbnail(img.src, img.type) || "/placeholder.jpg";
                      return (
                        <img
                          src={thumb}
                          alt={img.title}
                          className="creative-img"
                          style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
                          loading="lazy"
                        />
                      );
                    })()}
                    <div className="creative-overlay">
                      <div className="creative-overlay-icon">
                        <span className="material-symbols-outlined">
                          {(() => {
                            const playerType = getPlayerType(img.src, img.type);
                            return (playerType === "video" || playerType === "youtube" || playerType === "instagram" || playerType === "reel") 
                              ? "play_circle" 
                              : "zoom_in";
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="creative-card-info" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                    <div>
                      <h4>{img.title}</h4>
                      <p>{img.description}</p>
                    </div>
                    {getPlayerType(img.src, img.type) === "website" && img.src && (img.src.startsWith("http://") || img.src.startsWith("https://")) && (
                      <a
                        href={img.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="open-website-btn"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          marginTop: "12px",
                          backgroundColor: "#d63e13",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          textDecoration: "none",
                          border: "none",
                          cursor: "pointer",
                          width: "fit-content",
                          transition: "background-color 0.2s ease"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>open_in_new</span>
                        Visit Website
                      </a>
                    )}
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

            <div className="lightbox-image-wrapper" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {(() => {
                const playerType = getPlayerType(activeImage.src, activeImage.type);
                if (playerType === "video") {
                  return (
                    <video
                      src={activeImage.src}
                      controls
                      autoPlay
                      className="lightbox-image"
                      style={{ maxHeight: "80vh", maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }}
                    />
                  );
                } else if (playerType === "youtube" || playerType === "instagram" || playerType === "iframe") {
                  const embedUrl = getEmbedUrl(activeImage.src);
                  return (
                    <iframe
                      src={embedUrl}
                      title={activeImage.title}
                      className="lightbox-image"
                      style={{
                        width: "80vw",
                        height: "70vh",
                        maxWidth: "960px",
                        maxHeight: "600px",
                        border: "none",
                        borderRadius: "12px",
                        backgroundColor: "#000"
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                } else if (playerType === "website") {
                  const imageSrc = activeImage.src && (activeImage.src.startsWith("http://") || activeImage.src.startsWith("https://"))
                    ? `https://image.thum.io/get/${activeImage.src}`
                    : activeImage.src;
                  return (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                      <img
                        src={imageSrc}
                        alt={activeImage.title}
                        className="lightbox-image"
                        style={{ maxHeight: "70vh", maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }}
                      />
                      <a
                        href={activeImage.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "#d63e13",
                          color: "#fff",
                          padding: "12px 24px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          textDecoration: "none",
                          transition: "background-color 0.2s ease"
                        }}
                      >
                        <span className="material-symbols-outlined">open_in_new</span>
                        Open Website Link
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <img
                      src={activeImage.src}
                      alt={activeImage.title}
                      className="lightbox-image"
                    />
                  );
                }
              })()}
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
