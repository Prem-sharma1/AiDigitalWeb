export const googlePlans = [
  {
    id: "g_basic",
    platform: "Google Ads",
    badgeClass: "gg-badge",
    level: "Basic Plan",
    pillClass: "basic-pill",
    price: 4999,
    period: "/month",
    features: ["Google Ads", "Creative - 3", "AI Video - 1", "Reels/Shorts - 1", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Google Ads - Basic (₹4999/mo)"
  },
  {
    id: "g_standard",
    platform: "Google Ads",
    badgeClass: "gg-badge",
    level: "Standard Plan",
    pillClass: "standard-pill",
    price: 13499,
    period: "/3 months",
    features: ["Google Ads", "Creative - 9", "AI Video - 3", "Reels/Shorts - 3", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: true,
    serviceName: "Performance Marketing",
    planParameter: "Google Ads - Standard (₹13499/3mo)"
  },
  {
    id: "g_premium",
    platform: "Google Ads",
    badgeClass: "gg-badge",
    level: "Premium Plan",
    pillClass: "premium-pill",
    price: 23999,
    period: "/6 months",
    features: ["Google Ads", "Creative - 18", "AI Video - 6", "Reels/Shorts - 6", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Google Ads - Premium (₹23999/6mo)"
  }
];

export const facebookPlans = [
  {
    id: "fb_basic",
    platform: "Meta Ads",
    badgeClass: "fb-badge",
    level: "Basic",
    pillClass: "basic-pill",
    price: 3499,
    period: "/month",
    features: ["Meta Ads", "Creative - 3", "AI Video - 1", "Reels/Shorts - 1", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Meta Ads - Basic (₹3499/mo)"
  },
  {
    id: "fb_standard_monthly",
    platform: "Meta Ads",
    badgeClass: "fb-badge",
    level: "Standard",
    pillClass: "standard-pill",
    price: 4999,
    period: "/2 months",
    features: ["Meta Ads", "Creative - 6", "AI Video - 2", "Reels/Shorts - 2", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: true,
    serviceName: "Performance Marketing",
    planParameter: "Meta Ads - Standard (₹4999/2mo)"
  },
  {
    id: "fb_premium",
    platform: "Meta Ads",
    badgeClass: "fb-badge",
    level: "Premium",
    pillClass: "premium-pill",
    price: 6899,
    period: "/3 months",
    features: ["Meta Ads", "Creative - 9", "AI Video - 3", "Reels/Shorts - 3", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Meta Ads - Premium (₹6899/3mo)"
  }
];

export const combinePlans = [
  {
    id: "comb_basic",
    platform: "Meta + Google Ads",
    badgeClass: "multi-badge",
    level: "Basic",
    pillClass: "basic-pill",
    price: 6999,
    period: "/month",
    features: ["Meta Ads + Google Ads", "Creative - 7", "AI Video - 2", "Reels/Shorts - 5", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Combine - Basic (₹6999/mo)"
  },
  {
    id: "comb_standard",
    platform: "Meta + Google Ads",
    badgeClass: "multi-badge",
    level: "Standard",
    pillClass: "standard-pill",
    price: 19499,
    period: "/3 months",
    features: ["Meta Ads + Google Ads", "Creative - 21", "AI Video - 6", "Reels/Shorts - 15", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: true,
    serviceName: "Performance Marketing",
    planParameter: "Combine - Standard (₹19499/3mo)"
  },
  {
    id: "comb_premium",
    platform: "Meta + Google Ads",
    badgeClass: "multi-badge",
    level: "Premium",
    pillClass: "premium-pill",
    price: 35999,
    period: "/6 months",
    features: ["Meta Ads + Google Ads", "Creative - 42", "AI Video - 6", "Reels/Shorts - 30", "Weekly Report"],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Combine - Premium (₹35999/6mo)"
  }
];


export const websitePlans = [
  {
    level: "Static",
    tagClass: "static-tag",
    price: 7499,
    features: [
      { icon: "language", text: "Domain Name" },
      { icon: "cloud_queue", text: "Hosting" },
      { icon: "description", text: "1 Page Design" },
      { icon: "settings_backup_restore", text: "Maintenance" }
    ],
    buttonText: "Select Plan",
    serviceName: "Web Development",
    planParameter: "Static Website (₹7499)"
  },
  {
    level: "Dynamic",
    tagClass: "dynamic-tag",
    price: 14999,
    features: [
      { icon: "language", text: "Domain Name" },
      { icon: "cloud_queue", text: "Hosting" },
      { icon: "description", text: "10 Page Design" },
      { icon: "settings_backup_restore", text: "Maintenance" }
    ],
    buttonText: "Select Plan",
    serviceName: "Web Development",
    planParameter: "Dynamic Website (₹14999)"
  }
];

export const creativePacks = [
  {
    level: "Starter",
    tagClass: "static-tag",
    price: 199,
    features: [
      { icon: "image", text: "1 Creative" },
      { icon: "brush", text: "Social Media Sizes" },
      { icon: "folder_zip", text: "PNG & JPG Formats" },
      { icon: "schedule", text: "Standard Delivery Time" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Starter (1 for ₹199)",
    isHighlight: false
  },
  {
    level: "Growth",
    tagClass: "static-tag",
    price: 949,
    features: [
      { icon: "image", text: "5 Creatives" },
      { icon: "brush", text: "Ad Banner Formats" },
      { icon: "folder_zip", text: "PNG & JPG Formats" },
      { icon: "schedule", text: "Standard Delivery Time" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Growth (5 for ₹949)",
    isHighlight: false
  },
  {
    level: "Value",
    tagClass: "static-tag",
    price: 1799,
    features: [
      { icon: "image", text: "10 Creatives" },
      { icon: "brush", text: "Brand Style Match" },
      { icon: "folder_zip", text: "Source Files Included" },
      { icon: "schedule", text: "Standard Delivery Time" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Value (10 for ₹1799)",
    isHighlight: true,
    highlightStyles: {
      card: { borderColor: "#2563EB", borderWidth: "2px", position: "relative", overflow: "hidden" },
      tag: { backgroundColor: "#EBF3FF", color: "#2563EB" },
      icon: { color: "#2563EB" },
      button: { backgroundColor: "#2563EB" }
    }
  },
  {
    level: "Standard",
    tagClass: "static-tag",
    price: 3399,
    features: [
      { icon: "image", text: "20 Creatives" },
      { icon: "brush", text: "Multi-Platform Sizes" },
      { icon: "folder_zip", text: "Source Files Included" },
      { icon: "schedule", text: "Standard Delivery Time" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Standard (20 for ₹3399)",
    isHighlight: false
  },
  {
    level: "Pro",
    tagClass: "static-tag",
    price: 4499,
    features: [
      { icon: "image", text: "30 Creatives" },
      { icon: "brush", text: "Complete Ad Sets" },
      { icon: "folder_zip", text: "Source Files Included" },
      { icon: "schedule", text: "Standard Delivery Time" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Pro (30 for ₹4499)",
    isHighlight: false
  }
];

export const aiVideoPlans = [
  {
    level: "Basic Plan",
    tagClass: "static-tag",
    price: "1,000",
    features: [
      { icon: "video_library", text: "1 AI Video" },
      { icon: "schedule", text: "Duration: 30-35 seconds" },
      { icon: "check_circle", text: "Perfect for getting started" }
    ],
    buttonText: "Select Plan",
    serviceName: "AI Video Production",
    planParameter: "AI Video - Basic Plan (1 Video for ₹1000)",
    isHighlight: false
  },
  {
    level: "Starter Plan",
    tagClass: "static-tag",
    price: "4,749",
    features: [
      { icon: "video_library", text: "5 AI Videos" },
      { icon: "schedule", text: "Duration: 30-35 seconds" },
      { icon: "check_circle", text: "Ideal for growing brands" }
    ],
    buttonText: "Select Plan",
    serviceName: "AI Video Production",
    planParameter: "AI Video - Starter Plan (5 Videos for ₹4749)",
    isHighlight: false
  },
  {
    level: "Growth Plan",
    tagClass: "static-tag",
    price: "6,299",
    features: [
      { icon: "video_library", text: "7 AI Videos" },
      { icon: "schedule", text: "Duration: 30-35 seconds" },
      { icon: "check_circle", text: "Best for maximum impact" }
    ],
    buttonText: "Select Plan",
    serviceName: "AI Video Production",
    planParameter: "AI Video - Growth Plan (7 Videos for ₹6299)",
    isHighlight: true,
    highlightStyles: {
      card: { borderColor: "#FD7E14", borderWidth: "2px", position: "relative", overflow: "hidden" },
      tag: { backgroundColor: "#FFF0EA", color: "#FD7E14" },
      icon: { color: "#FD7E14" },
      button: { backgroundColor: "#FD7E14" }
    }
  },
  {
    level: "Pro Plan",
    tagClass: "static-tag",
    price: "8,499",
    features: [
      { icon: "video_library", text: "10 AI Videos" },
      { icon: "schedule", text: "Duration: 30-35 seconds" },
      { icon: "check_circle", text: "Premium video production" }
    ],
    buttonText: "Select Plan",
    serviceName: "AI Video Production",
    planParameter: "AI Video - Pro Plan (10 Videos for ₹8499)",
    isHighlight: false
  }
];

export const realEstatePlans = [
  {
    id: "re_meta",
    platform: "Meta Ads",
    badgeClass: "fb-badge",
    level: "Meta Ads",
    pillClass: "standard-pill",
    price: "5,000",
    period: "/month",
    features: [
      { icon: "my_location", text: "Targeted Ad Campaigns" },
      { icon: "groups", text: "Quality Leads" },
      { icon: "phone_callback", text: "More Site Visits" },
      { icon: "trending_up", text: "Increased Sales" },
      { icon: "palette", text: "3 Creatives" },
      { icon: "movie", text: "1 AI Video" },
      { icon: "play_arrow", text: "1 Reels/Shorts" }
    ],
    buttonText: "Call Now",
    isPopular: false,
    serviceName: "Real Estate Advertising",
    planParameter: "Real Estate - Meta Ads (₹5,000/mo)",
    isHighlight: false,
    highlightStyles: {
      card: { borderColor: "#1877F2", borderWidth: "2px", position: "relative", overflow: "hidden" },
      tag: { backgroundColor: "#E7F3FF", color: "#1877F2" },
      icon: { color: "#1877F2" },
      button: { backgroundColor: "#1877F2" }
    }
  },
  {
    id: "re_google",
    platform: "Google Ads",
    badgeClass: "gg-badge",
    level: "Google Ads",
    pillClass: "premium-pill",
    price: "7,500",
    period: "/month",
    features: [
      { icon: "domain", text: "Real Estate Ad Experts" },
      { icon: "insights", text: "High ROI Campaigns" },
      { icon: "description", text: "Transparent Reporting" },
      { icon: "support_agent", text: "Dedicated Support" },
      { icon: "palette", text: "3 Creatives" },
      { icon: "movie", text: "1 AI Video" },
      { icon: "play_arrow", text: "1 Reels/Shorts" }
    ],
    buttonText: "Call Now",
    isPopular: false,
    serviceName: "Real Estate Advertising",
    planParameter: "Real Estate - Google Ads (₹7,500/mo)",
    isHighlight: true,
    highlightStyles: {
      card: { borderColor: "#EA4335", borderWidth: "2px", position: "relative", overflow: "hidden" },
      tag: { backgroundColor: "#FCE8E6", color: "#EA4335" },
      icon: { color: "#EA4335" },
      button: { backgroundColor: "#EA4335" }
    }
  }
];

