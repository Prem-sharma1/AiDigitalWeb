export const adsPlans = [
  {
    platform: "Meta Ads",
    badgeClass: "fb-badge",
    level: "Basic",
    pillClass: "basic-pill",
    price: 2499,
    period: "/month",
    features: [
      "Meta Ads",
      "Creative - 3",
      "AI Video - 1",
      "Reels/Shorts - 1",
      "Weekly Report"
    ],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Meta Ads - Basic (₹2499/mo)"
  },
  {
    platform: "Meta Ads",
    badgeClass: "fb-badge",
    level: "Standard",
    pillClass: "standard-pill",
    price: 3999,
    period: "/month",
    features: [
      "Meta Ads",
      "Creative - 5",
      "AI Video - 2",
      "Reels/Shorts - 3",
      "Weekly Report"
    ],
    buttonText: "Select Plan",
    isPopular: true,
    serviceName: "Performance Marketing",
    planParameter: "Meta Ads - Standard (₹3999/mo)"
  },
  {
    platform: "Google Ads",
    badgeClass: "gg-badge",
    level: "Premium",
    pillClass: "premium-pill",
    price: 4999,
    period: "/month",
    features: [
      "Google Ads",
      "Creative - 5",
      "AI Video - 1",
      "Reels/Shorts - 3",
      "Weekly Report"
    ],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Google Ads - Premium (₹4999/mo)"
  },
  {
    platform: "Meta + Google Ads",
    badgeClass: "multi-badge",
    level: "Platinum",
    pillClass: "platinum-pill",
    price: 6999,
    period: "/month",
    features: [
      "Ads Multi-Channel",
      "Creative - 7",
      "AI Video - 2",
      "Reels/Shorts - 5",
      "Weekly Report"
    ],
    buttonText: "Select Plan",
    isPopular: false,
    serviceName: "Performance Marketing",
    planParameter: "Multi-Channel - Platinum (₹6999/mo)"
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
    price: 599,
    features: [
      { icon: "image", text: "5 Creatives" },
      { icon: "brush", text: "Social Media Sizes" },
      { icon: "folder_zip", text: "PNG & JPG Formats" },
      { icon: "schedule", text: "3-5 Days Delivery" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Starter (5 for ₹599)",
    isHighlight: false
  },
  {
    level: "Growth",
    tagClass: "static-tag",
    price: 1099,
    features: [
      { icon: "image", text: "10 Creatives" },
      { icon: "brush", text: "Ad Banner Formats" },
      { icon: "folder_zip", text: "PNG & JPG Formats" },
      { icon: "schedule", text: "4-6 Days Delivery" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Growth (10 for ₹1099)",
    isHighlight: false
  },
  {
    level: "Value",
    tagClass: "static-tag",
    price: 1499,
    features: [
      { icon: "image", text: "15 Creatives" },
      { icon: "brush", text: "Brand Style Match" },
      { icon: "folder_zip", text: "Source Files Included" },
      { icon: "schedule", text: "5-7 Days Delivery" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Value (15 for ₹1499)",
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
    price: 1899,
    features: [
      { icon: "image", text: "20 Creatives" },
      { icon: "brush", text: "Multi-Platform Sizes" },
      { icon: "folder_zip", text: "Source Files Included" },
      { icon: "schedule", text: "5-7 Days Delivery" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Standard (20 for ₹1899)",
    isHighlight: false
  },
  {
    level: "Pro",
    tagClass: "static-tag",
    price: 2699,
    features: [
      { icon: "image", text: "30 Creatives" },
      { icon: "brush", text: "Complete Ad Sets" },
      { icon: "folder_zip", text: "Source Files Included" },
      { icon: "schedule", text: "7-10 Days Delivery" }
    ],
    buttonText: "Select Plan",
    serviceName: "SEO Growth",
    planParameter: "Creative Packs - Pro (30 for ₹2699)",
    isHighlight: false
  }
];

export const aiVideoPlans = [
  {
    level: "Starter Plan",
    tagClass: "static-tag",
    price: "4,500",
    features: [
      { icon: "video_library", text: "5 AI Videos" },
      { icon: "check_circle", text: "Perfect for getting started" }
    ],
    buttonText: "Select Plan",
    serviceName: "AI Video Production",
    planParameter: "AI Video - Starter Plan (5 Videos for ₹4500)",
    isHighlight: false
  },
  {
    level: "Growth Plan",
    tagClass: "static-tag",
    price: "5,950",
    features: [
      { icon: "video_library", text: "7 AI Videos" },
      { icon: "check_circle", text: "Ideal for growing brands" }
    ],
    buttonText: "Select Plan",
    serviceName: "AI Video Production",
    planParameter: "AI Video - Growth Plan (7 Videos for ₹5950)",
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
    price: "8,000",
    features: [
      { icon: "video_library", text: "10 AI Videos" },
      { icon: "check_circle", text: "Best for maximum impact" }
    ],
    buttonText: "Select Plan",
    serviceName: "AI Video Production",
    planParameter: "AI Video - Pro Plan (10 Videos for ₹8000)",
    isHighlight: false
  }
];

