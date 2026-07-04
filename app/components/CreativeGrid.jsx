"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";

const creativeGroups = [
  {
    industry: "Real Estate",
    description: "Websites, campaigns, AI property promotions, creative branding, and real estate reels.",
    images: [
      { src: "/creative_content/RealStatecreative.jpeg", title: "Real Estate Brand Creative", description: "High-impact branding and promotional creative for real estate marketing campaigns.", globalIndex: 0, type: "image" },
      { src: "/creative_content/Creative1.jpeg", title: "Luxury Villa Showcase", description: "Branding creative for high-end residential real estate listing.", globalIndex: 1, type: "image" }
    ]
  },
  {
    industry: "Education",
    description: "Educational websites, admission campaigns, student-focused creatives, and promotional reels.",
    images: [
      { src: "/creative_content/Educationcreative.jpeg", title: "Education Creative", description: "Engaging promotional creative for educational institutions and admission campaigns.", globalIndex: 10, type: "image" },
      { src: "/creative_content/Education2creative.jpeg", title: "Education Creative 2", description: "Student-focused ad creative designed for enrollment and awareness campaigns.", globalIndex: 11, type: "image" },
      { src: "/creative_content/Education3creative.jpeg", title: "Education Creative 3", description: "Vibrant creative for school and college marketing campaigns.", globalIndex: 12, type: "image" },
      { src: "/creative_content/Education4creative.jpeg", title: "Education Creative 4", description: "Academic program promotional visual for digital ad campaigns.", globalIndex: 13, type: "image" },
      { src: "/creative_content/Education5creative.jpeg", title: "Education Creative 5", description: "Modern education branding creative for social media and paid ads.", globalIndex: 14, type: "image" },
      { src: "/creative_content/Creative3.jpeg", title: "Global University Banner", description: "Promotional visual for academic programs and admissions.", globalIndex: 15, type: "image" },
      { src: "/creative_content/Creative4.jpeg", title: "Online Learning Poster", description: "E-learning platform advertisement graphic designed for campaigns.", globalIndex: 16, type: "image" },
      { src: "https://youtube.com/shorts/CqpNv45IQBI", title: "UPSC DECODED", description: "An educational guide and course preview from UPSC DECODED, highlighting exam strategies and academic content.", globalIndex: 204, type: "youtube" },
      { src: "https://youtube.com/shorts/pd6kbpNsp5M", title: "Little Genius", description: "An engaging and fun promotional video highlighting early childhood learning, creative activities, and classes at Little Genius.", globalIndex: 207, type: "youtube" },
      { src: "https://youtube.com/shorts/3BNF1HUdHUo", title: "Paath Study", description: "An interactive educational overview and study session guide from Paath Study, designed to assist student learning and academic performance.", globalIndex: 209, type: "youtube" },
      { src: "/Campaign/EducationCampaign.jpeg", title: "Education Admission Campaign", description: "Targeted digital marketing campaign focusing on school and college admissions, enrollments, and academic awareness.", globalIndex: 300, type: "campaign" }
    ]
  },
  {
    industry: "Healthcare",
    description: "Healthcare websites, awareness campaigns, AI medical videos, and promotional content.",
    images: [
      { src: "/creative_content/HealthcareCreative.jpeg", title: "Healthcare Creative", description: "Medical services and healthcare awareness promotional creative.", globalIndex: 30, type: "image" },
      { src: "/creative_content/Healthcare2Creative.jpeg", title: "Healthcare Creative 2", description: "Doctor and clinic lead generation campaign creative.", globalIndex: 31, type: "image" },
      { src: "/creative_content/healthcare3Creative.jpeg", title: "Healthcare Creative 3", description: "Hospital and specialist services promotional banner creative.", globalIndex: 32, type: "image" },
      { src: "/creative_content/Healthcare4.jpeg", title: "Healthcare Creative 4", description: "Medical awareness and health services social media creative.", globalIndex: 33, type: "image" },
      { src: "/creative_content/Oldagehome.jpeg", title: "Old Age Home Creative", description: "Compassionate care services promotional creative for senior living facilities.", globalIndex: 34, type: "image" },
      { src: "/creative_content/Oldagehome2.jpeg", title: "Old Age Home Creative 2", description: "Elder care and assisted living promotional campaign visual.", globalIndex: 35, type: "image" },
      { src: "/creative_content/Oldagehome3.jpeg", title: "Old Age Home Creative 3", description: "Senior care and wellness services ad creative.", globalIndex: 36, type: "image" },
      { src: "/creative_content/Opticalscreative.jpeg", title: "Opticals Creative", description: "Eyecare and optical services promotional creative for digital ads.", globalIndex: 37, type: "image" },
      { src: "/creative_content/Opticalscretive.jpeg", title: "Opticals Creative 2", description: "Vision care and spectacle store branding promotional visual.", globalIndex: 38, type: "image" },
      { src: "/creative_content/Creative2.jpeg", title: "Healthcare Lead Campaign", description: "Digital marketing campaign designed to help doctors, clinics, and hospitals generate quality leads.", globalIndex: 39, type: "image" },
      { src: "/creative_content/Creative5.jpeg", title: "Healthcare Digital Marketing Campaign", description: "An ad creative and landing page concept designed for B2B lead generation targeting doctors and clinics.", globalIndex: 40, type: "image" },
      { src: "https://youtube.com/shorts/QIh7twZ3mV4", title: "Apple Multi Specialist Healthcare", description: "An AI-assisted promotional video highlighting hospital infrastructure, expert doctors, and advanced healthcare services at Apple Multi Specialist Healthcare.", globalIndex: 208, type: "youtube" },
      { src: "/Campaign/HealthcareCampaign.jpeg", title: "Healthcare Clinic Campaign", description: "A patient acquisition and awareness campaign built for doctors, specialty hospitals, and wellness clinics.", globalIndex: 304, type: "campaign" }
    ]
  },
  {
    industry: "Finance",
    description: "Finance dashboards, investment campaigns, branding creatives, and educational reels.",
    images: [
      { src: "/creative_content/Financexreative.jpeg", title: "Finance Creative", description: "Premium finance branding and investment promotional creative.", globalIndex: 20, type: "image" },
      { src: "/creative_content/Financecreative2.jpeg", title: "Finance Creative 2", description: "Wealth management and financial services ad creative.", globalIndex: 21, type: "image" },
      { src: "/creative_content/Financecreative3.jpeg", title: "Finance Creative 3", description: "Investment advisory and financial growth promotional visual.", globalIndex: 22, type: "image" },
      { src: "/creative_content/Financecreative4.jpeg", title: "Finance Creative 4", description: "Finance sector branding creative for digital marketing campaigns.", globalIndex: 23, type: "image" },
      { src: "/creative_content/Financecreative5.jpeg", title: "Finance Creative 5", description: "Insurance and savings promotional creative for lead generation.", globalIndex: 24, type: "image" },
      { src: "/creative_content/Financecreative6.jpeg", title: "Finance Creative 6", description: "Mutual fund and wealth planning social media ad creative.", globalIndex: 25, type: "image" },
      { src: "/creative_content/Financecreative7.jpeg", title: "Finance Creative 7", description: "Corporate finance and business growth promotional banner.", globalIndex: 26, type: "image" },
      { src: "/creative_content/ITRFinance.jpeg", title: "ITR Finance Creative", description: "Tax filing and ITR services promotional creative for digital campaigns.", globalIndex: 27, type: "image" },
      { src: "/creative_content/Creative7.jpeg", title: "Investment Growth Ad", description: "Wealth management and finance growth promotional content.", globalIndex: 6, type: "image" },
      { src: "/creative_content/Creative8.jpeg", title: "Crypto Platform Asset", description: "Digital currency trading platform banner design concept.", globalIndex: 7, type: "image" },
      { src: "https://youtube.com/shorts/4K5K4USvQ-0", title: "Viyom Finance Services (Promo)", description: "A high-impact promotional video for Viyom Finance Services highlighting wealth growth, loans, and investment advisory.", globalIndex: 210, type: "youtube" },
      { src: "https://youtube.com/shorts/QheeYMmcdn4", title: "Quick Personal Loans", description: "An informative video guide on personal loans, instant approval options, and flexible repayment schemes.", globalIndex: 211, type: "youtube" },
      { src: "/Campaign/FinanceCampaign.jpeg", title: "Finance Advisory Campaign", description: "A lead generation and conversion-focused performance marketing campaign designed for financial service advisors.", globalIndex: 301, type: "campaign" },
      { src: "/Campaign/FinanceCampaign2.jpeg", title: "Finance Wealth Campaign", description: "Strategic marketing campaign focusing on wealth management, investment trust, and retirement planning.", globalIndex: 302, type: "campaign" }
    ]
  },
  {
    industry: "Hospitality & Food",
    description: "Hotel booking platforms, restaurant campaigns, food brand creatives, and social media reels.",
    images: [
      { src: "/creative_content/HotelAndResort.jpeg", title: "Hotel & Resort Creative", description: "Premium hospitality branding creative for hotel and resort marketing.", globalIndex: 50, type: "image" },
      { src: "/creative_content/HotelandResort2.jpeg", title: "Hotel & Resort Creative 2", description: "Luxury hotel and resort promotional visual for digital campaigns.", globalIndex: 51, type: "image" },
      { src: "/creative_content/HotelAndResorts3.jpeg", title: "Hotel & Resort Creative 3", description: "Boutique hotel and resort services ad creative for lead generation.", globalIndex: 52, type: "image" },
      { src: "/creative_content/foodcreative1.jpeg", title: "Food Creative 1", description: "Restaurant and food brand social media promotional creative.", globalIndex: 53, type: "image" },
      { src: "/creative_content/foodcreative2.jpeg", title: "Food Creative 2", description: "Gourmet dining and food delivery promotional banner creative.", globalIndex: 54, type: "image" },
      { src: "/creative_content/Creative6.jpeg", title: "Restaurant Brand Campaign", description: "High-quality lead generation and marketing flyer for dining brands.", globalIndex: 5, type: "image" },
      { src: "/creative_content/Creative9.jpeg", title: "Gourmet Bistro Banner", description: "Aesthetic culinary advertising graphic for restaurant promotions.", globalIndex: 8, type: "image" },
      { src: "https://youtube.com/shorts/eP3mbrEjEgA", title: "Hayat Food", description: "An appetizing preview showcasing Hayat Food's culinary items, gourmet dishes, and hospitality experiences.", globalIndex: 205, type: "youtube" },
      { src: "/Campaign/ResortsCampaign.jpeg", title: "Luxury Resort Booking Campaign", description: "High-impact advertising campaign optimized for luxury resort stays, hotel bookings, and dining promotions.", globalIndex: 305, type: "campaign" }
    ]
  },
  {
    industry: "Solar",
    description: "Solar websites, green energy campaigns, AI solar videos, and promotional clean energy reels.",
    images: [
      { src: "/creative_content/Solar.jpeg", title: "Solar Energy Creative", description: "Clean energy and solar installation promotional creative for digital campaigns.", globalIndex: 60, type: "image" },
      { src: "/creative_content/Solarcreative2.jpeg", title: "Solar Creative 2", description: "Residential and commercial solar panel solutions ad creative.", globalIndex: 61, type: "image" },
      { src: "/creative_content/SolarCreative3.jpeg", title: "Solar Creative 3", description: "Green energy awareness promotional banner for solar services.", globalIndex: 62, type: "image" },
      { src: "/creative_content/Solarcreative4.jpeg", title: "Solar Creative 4", description: "Sustainable energy and solar rooftop solutions campaign creative.", globalIndex: 63, type: "image" },
      { src: "https://youtube.com/shorts/ZPqqln6JGNA", title: "BITAPLUS Solar", description: "An informative overview of BITAPLUS Solar's solar energy solutions, rooftop panel installations, and clean energy benefits.", globalIndex: 206, type: "youtube" },
      { src: "/Campaign/SolarCampaign.jpeg", title: "Solar Energy Lead Campaign", description: "Performance marketing campaign designed for commercial and residential solar installation leads.", globalIndex: 306, type: "campaign" }
    ]
  },
  {
    industry: "Interior Design",
    description: "Interior design studios, home décor campaigns, and premium living space creatives.",
    images: [
      { src: "/creative_content/Interiorcreative.jpeg", title: "Interior Design Creative", description: "Premium home interior and décor services promotional creative.", globalIndex: 70, type: "image" },
      { src: "/creative_content/interior2creative.jpeg", title: "Interior Design Creative 2", description: "Modern living space and interior styling ad creative.", globalIndex: 71, type: "image" },
      { src: "/creative_content/Interior3creative.jpeg", title: "Interior Design Creative 3", description: "Luxury interior design and home renovation promotional visual.", globalIndex: 72, type: "image" },
      { src: "https://youtube.com/shorts/jEOIOVnY_vI", title: "Aditya Modular Design Studio", description: "A stunning showcase of Aditya Modular Design Studio's premium modular furniture, custom interiors, and space transformation expertise.", globalIndex: 201, type: "youtube" }
    ]
  },
  {
    industry: "Technology & Apps",
    description: "Technology companies, SaaS platforms, application launches, and digital services campaigns.",
    images: [
      { src: "/creative_content/TechnologyCreative.jpeg", title: "Technology Creative", description: "Tech company and digital solutions promotional creative for branding campaigns.", globalIndex: 80, type: "image" },
      { src: "/creative_content/Applicationcreative.jpeg", title: "Application Creative", description: "Mobile and web application launch promotional creative.", globalIndex: 81, type: "image" },
      { src: "/creative_content/Applicationcreative2.jpeg", title: "Application Creative 2", description: "SaaS and digital product ad creative for performance marketing.", globalIndex: 82, type: "image" },
      { src: "/creative_content/Creative10.jpeg", title: "SaaS Launch Creative", description: "Software product launch promotional design visual.", globalIndex: 9, type: "image" }
    ]
  },
  {
    industry: "Tours & Travels",
    description: "Travel agencies, tourism campaigns, tour package creatives, and destination marketing.",
    images: [
      { src: "/creative_content/ToursAndTravels.jpeg", title: "Tours & Travels Creative", description: "Travel agency and tour package promotional creative for digital campaigns.", globalIndex: 90, type: "image" },
      { src: "/creative_content/ToursAnd2TRavels.jpeg", title: "Tours & Travels Creative 2", description: "Destination tourism and holiday package promotional banner creative.", globalIndex: 91, type: "image" }
    ]
  },
  {
    industry: "Sports",
    description: "Sports brands, fitness campaigns, athletic event creatives, and sports marketing.",
    images: [
      { src: "/creative_content/Sportscreative1.jpeg", title: "Sports Creative", description: "Sports brand and fitness promotional creative for social media campaigns.", globalIndex: 100, type: "image" }
    ]
  },
  {
    industry: "Other Creative",
    description: "Additional marketing campaigns, custom integrations, branding assets, and creative content.",
    images: [
      { src: "/creative_content/Othercreative.jpeg", title: "Other Brand Creative", description: "General branding and promotional creative for digital marketing campaigns.", globalIndex: 110, type: "image" },
      { src: "/Campaign/FoundationCampaign.jpeg", title: "Foundation Brand Campaign", description: "Branding and donor awareness campaign designed for non-profit and charitable foundations.", globalIndex: 303, type: "campaign" }
    ]
  },
  {
    industry: "Digital Marketing",
    description: "AI-powered social media marketing, Google Ads, and performance-driven digital campaigns by Ai Digital.",
    images: [
      { src: "https://youtube.com/shorts/VNMd9kBvsmg", title: "Ai Digital – Social Media Marketing", description: "Discover how Ai Digital drives measurable growth through social media marketing, Google Ads, and AI-powered digital strategies.", globalIndex: 200, type: "youtube" },
      { src: "https://youtube.com/shorts/dv9gLumeu4c", title: "Adly – Brand Promotional Video", description: "A high-impact AI-assisted promotional video for Adly, showcasing brand identity, product highlights, and digital marketing reach.", globalIndex: 202, type: "youtube" },
      { src: "https://youtube.com/shorts/yrA8PZJ17k4", title: "Hayum – Brand Promotional Video", description: "An engaging AI-assisted promotional reel for Hayum, highlighting brand story, product offerings, and audience connect.", globalIndex: 203, type: "youtube" },
      { src: "https://youtube.com/shorts/kGqZ1WCFwXA", title: "Ai Digital – Affordable Video Services", description: "Get high-quality AI videos and social media creatives at affordable prices to boost your business reach.", globalIndex: 212, type: "youtube" }
    ]
  },
  {
    industry: "Construction",
    description: "All-in-one Construction ERP & Project Management software showcase, web portal, and local SEO campaign.",
    images: [
      { src: "https://www.hitoffice.co.in/", title: "Hitoffice Construction ERP", description: "Complete construction ERP and project management software website showcase. Feature-rich, optimized for lead generation and search engine visibility.", globalIndex: 101, type: "website" }
    ]
  }
];

export default function CreativeGrid({ activeFilter = "All" }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const scrollContainers = useRef({});
  const [creativeGroupsState, setCreativeGroupsState] = useState(creativeGroups);
  const [videoErrors, setVideoErrors] = useState({});

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
    if (category === "image" || category === "video" || category === "reel" || category === "website" || category === "campaign") {
      return category;
    }
    
    let resolvedType = type;
    if (!resolvedType && src) {
      const url = src.toLowerCase();
      if (url.includes("youtube.com") || url.includes("youtu.be")) resolvedType = "youtube";
      else if (url.includes("instagram.com/reel") || url.includes("instagram.com/p")) resolvedType = "instagram";
      else if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") || url.endsWith(".mov")) resolvedType = "video";
      else if (url.startsWith("http")) resolvedType = "website";
      else if (url.includes("/campaign/")) resolvedType = "campaign";
      else resolvedType = "image";
    }

    if (resolvedType === "youtube" || resolvedType === "iframe" || resolvedType === "video") return "video";
    if (resolvedType === "instagram" || resolvedType === "reel") return "reel";
    if (resolvedType === "website") return "website";
    if (resolvedType === "campaign") return "campaign";
    return "image";
  };

  const getPlayerType = (src, type) => {
    if (type === "website") return "website";
    if (type === "campaign") return "image";
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

  const filteredGroups = useMemo(() => {
    return creativeGroupsState.map(group => {
      const filteredImages = group.images.filter(img => {
        const type = getMediaType(img.type, img.src, img.category);
        if (activeFilter === "All") return true;
        if (activeFilter === "Creative Content") return type === "image";
        if (activeFilter === "AI Videos") return type === "video";
        if (activeFilter === "Reels") return type === "reel";
        if (activeFilter === "Website & SEO") return type === "website";
        if (activeFilter === "Campaigns") return type === "campaign";
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
                        if (videoErrors[img.src]) {
                          return (
                            <div 
                              className="creative-img-fallback"
                              style={{ 
                                width: "100%", 
                                height: "100%", 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                background: "linear-gradient(135deg, #1f2937, #111827)", 
                                color: "#9ca3af",
                                padding: "16px",
                                textAlign: "center"
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#e56030", marginBottom: "8px" }}>
                                videocam_off
                              </span>
                              <span style={{ fontSize: "11px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Video Unavailable
                              </span>
                            </div>
                          );
                        }
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
                            onError={() => {
                              setVideoErrors((prev) => ({ ...prev, [img.src]: true }));
                            }}
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
                  if (videoErrors[activeImage.src]) {
                    return (
                      <div 
                        style={{ 
                          width: "80vw",
                          height: "50vh",
                          maxWidth: "600px",
                          display: "flex", 
                          flexDirection: "column", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          background: "linear-gradient(135deg, #1f2937, #111827)", 
                          color: "#9ca3af",
                          borderRadius: "12px",
                          border: "1px solid #374151",
                          textAlign: "center",
                          padding: "24px"
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "#e56030", marginBottom: "16px" }}>
                          videocam_off
                        </span>
                        <h4 style={{ color: "#fff", marginBottom: "8px" }}>Video file not found locally</h4>
                        <p style={{ fontSize: "14px", maxWidth: "400px", margin: "0 auto", color: "#9ca3af" }}>
                          The video file <strong>{activeImage.src.split('/').pop()}</strong> is ignored in Git and needs to be placed under <code>public/ai_videos/</code>.
                        </p>
                      </div>
                    );
                  }
                  return (
                    <video
                      src={activeImage.src}
                      controls
                      autoPlay
                      className="lightbox-image"
                      style={{ maxHeight: "80vh", maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }}
                      onError={() => {
                        setVideoErrors((prev) => ({ ...prev, [activeImage.src]: true }));
                      }}
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
