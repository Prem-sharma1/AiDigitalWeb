const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const { expandBlogContent } = require("./blog_expansion_helper");

// Manually parse .env file to avoid external dependencies like dotenv
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = (match[2] || "").trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

async function main() {
  console.log("Connecting to XAMPP MySQL...");

  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const dbName = process.env.DB_NAME || "ai_digital";
  const port = parseInt(process.env.DB_PORT || "3306", 10);

  // 1. Establish connection without database to create it if it doesn't exist
  const connection = await mysql.createConnection({ host, user, password, port });
  console.log(`Creating database "${dbName}" if it does not exist...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.end();

  // 2. Reconnect with the database name
  const db = await mysql.createConnection({ host, user, password, database: dbName, port });
  console.log("Connected to database. Setting up tables...");

  // 3. Create Tables
  // Create pricing_plans
  await db.query(`
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id VARCHAR(36) PRIMARY KEY,
      category VARCHAR(50) NOT NULL,
      platform VARCHAR(50) NULL,
      badge_class VARCHAR(50) NULL,
      level VARCHAR(50) NOT NULL,
      pill_class VARCHAR(50) NULL,
      price VARCHAR(50) NOT NULL,
      period VARCHAR(50) NULL,
      features TEXT NOT NULL,
      button_text VARCHAR(50) DEFAULT 'Select Plan',
      is_popular BOOLEAN DEFAULT FALSE,
      service_name VARCHAR(100) NULL,
      plan_parameter VARCHAR(255) NULL,
      tag_class VARCHAR(50) NULL,
      is_highlight BOOLEAN DEFAULT FALSE,
      highlight_styles TEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Table "pricing_plans" verified.');

  // Create portfolio_items
  await db.query(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id VARCHAR(36) PRIMARY KEY,
      section VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NULL,
      industry VARCHAR(100) NULL,
      metric VARCHAR(50) NULL,
      metric_label VARCHAR(100) NULL,
      description TEXT NULL,
      tags TEXT NULL,
      accent VARCHAR(50) NULL,
      icon VARCHAR(50) NULL,
      src VARCHAR(255) NULL,
      type VARCHAR(50) NULL,
      global_index INT NULL,
      thumbnail VARCHAR(255) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  try {
    await db.query("ALTER TABLE portfolio_items ADD COLUMN thumbnail VARCHAR(255) DEFAULT NULL");
  } catch (err) {
    // Ignore error if column already exists
  }
  console.log('Table "portfolio_items" verified.');

  // Create blogs
  await db.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content LONGTEXT NOT NULL,
      excerpt TEXT NOT NULL,
      cover_image VARCHAR(255) NULL,
      category VARCHAR(100) NOT NULL,
      published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Table "blogs" verified.');

  // Create whatsapp_logs
  await db.query(`
    CREATE TABLE IF NOT EXISTS whatsapp_logs (
      id VARCHAR(36) PRIMARY KEY,
      recipient VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      provider VARCHAR(50) NOT NULL,
      status VARCHAR(20) NOT NULL,
      error TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  // Create users table for verified checkouts
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(150) UNIQUE,
      google_id VARCHAR(100),
      phone VARCHAR(20) UNIQUE,
      phone_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Table "users" verified.');

  // 4. Seed pricing_plans
  const pricingPath = path.join(process.cwd(), "data", "pricingData.json");
  if (fs.existsSync(pricingPath)) {
    const rawPricing = fs.readFileSync(pricingPath, "utf-8");
    const pricingData = JSON.parse(rawPricing);

    await db.query("DELETE FROM pricing_plans");
    console.log("Cleared old pricing plans.");

    const categories = ["googlePlans", "facebookPlans", "combinePlans", "websitePlans", "creativePacks", "aiVideoPlans"];
    for (const cat of categories) {
      if (pricingData[cat]) {
        for (const plan of pricingData[cat]) {
          const id = Math.random().toString(36).substring(2, 15);
          await db.query(`
            INSERT INTO pricing_plans 
            (id, category, platform, badge_class, level, pill_class, price, period, features, button_text, is_popular, service_name, plan_parameter, tag_class, is_highlight, highlight_styles)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            id,
            cat,
            plan.platform || null,
            plan.badgeClass || null,
            plan.level || "",
            plan.pillClass || null,
            String(plan.price),
            plan.period || null,
            JSON.stringify(plan.features),
            plan.buttonText || "Select Plan",
            plan.isPopular ? 1 : 0,
            plan.serviceName || null,
            plan.planParameter || null,
            plan.tagClass || null,
            plan.isHighlight ? 1 : 0,
            plan.highlightStyles ? JSON.stringify(plan.highlightStyles) : null
          ]);
        }
      }
    }
    console.log("Seeded pricing packages.");
  }

  // 5. Seed portfolio_items
  const portfolioPath = path.join(process.cwd(), "data", "portfolioData.json");
  if (fs.existsSync(portfolioPath)) {
    const rawPortfolio = fs.readFileSync(portfolioPath, "utf-8");
    const portfolioData = JSON.parse(rawPortfolio);

    await db.query("DELETE FROM portfolio_items");
    console.log("Cleared old portfolio items.");

    // Showcase
    if (portfolioData.showcaseProjects) {
      for (const item of portfolioData.showcaseProjects) {
        const id = Math.random().toString(36).substring(2, 15);
        await db.query(`
          INSERT INTO portfolio_items 
          (id, section, title, category, industry, metric, metric_label, description, tags, accent, icon)
          VALUES (?, 'showcase', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          item.title,
          item.category || null,
          item.industry || null,
          item.metric || null,
          item.metricLabel || null,
          item.description || null,
          JSON.stringify(item.tags || []),
          item.accent || null,
          item.icon || null
        ]);
      }
    }

    // Featured industries
    if (portfolioData.industries) {
      for (const ind of portfolioData.industries) {
        for (const proj of ind.projects) {
          const id = Math.random().toString(36).substring(2, 15);
          await db.query(`
            INSERT INTO portfolio_items 
            (id, section, title, category, industry, description)
            VALUES (?, 'featured', ?, ?, ?, ?)
          `, [
            id,
            proj.title,
            proj.type || null,
            ind.name,
            ind.description || null
          ]);
        }
      }
    }

    // Other Projects
    if (portfolioData.otherProjects) {
      for (const proj of portfolioData.otherProjects) {
        const id = Math.random().toString(36).substring(2, 15);
        await db.query(`
          INSERT INTO portfolio_items 
          (id, section, title, category)
          VALUES (?, 'other', ?, ?)
        `, [
          id,
          proj.title,
          proj.type || null
        ]);
      }
    }

    // Creative Groups
    if (portfolioData.creativeGroups) {
      for (const grp of portfolioData.creativeGroups) {
        for (const img of grp.images) {
          const id = Math.random().toString(36).substring(2, 15);
          await db.query(`
            INSERT INTO portfolio_items 
            (id, section, title, description, src, type, global_index, industry, thumbnail)
            VALUES (?, 'creative', ?, ?, ?, ?, ?, ?, ?)
          `, [
            id,
            img.title,
            img.description || null,
            img.src,
            img.type || "image",
            img.globalIndex || null,
            grp.industry,
            img.thumbnail || null
          ]);
        }
      }
    }
    console.log("Seeded portfolio items.");
  }

  // 6. Seed default Blogs
  const defaultBlogs = [
    {
      title: "Welcome to AI Digital Blogs",
      slug: "welcome-to-ai-digital-blogs",
      category: "Marketing",
      cover_image: "/creative_content/Creative1.jpeg",
      excerpt: "An overview of how AI digital neural tech is transforming digital marketing paradigms.",
      content: `## Exploring AI Powered Digital Marketing

Welcome to our blog! We specialize in generating high-performing leads, developing optimized web applications, and building AI videos.

### Why Choose AI Marketing?
- **Efficiency**: AI algorithms analyze audience insights rapidly.
- **Conversion**: Dynamically targeted landing pages convert higher.
- **Speed**: Automating workflow saves precious time.`
    },
    {
      title: "The Future of AI-Driven Content Creation in 2026",
      slug: "the-future-of-ai-driven-content-creation-in-2026",
      category: "SEO",
      cover_image: "/blog_seo.png",
      excerpt: "Discover how artificial intelligence is reshaping organic search strategies.",
      content: `## Reshaping Organic Search Strategies in 2026

As we head into 2026, artificial intelligence continues to transform content marketing. Search engines have evolved to focus heavily on user intent, depth of knowledge, and authentic expertise.

### Key Shifts in Content Creation:
- **Generative Engine Optimization (GEO)**: Optimizing content not just for search engines, but for AI summaries and search assistants.
- **E-E-A-T First**: Prioritizing real human experiences, author authority, and structured data verification.
- **Multimedia Integration**: Combining high-quality text, interactive tools, and AI videos to capture engagement.`
    },
    {
      title: "Maximizing ROAS with Predictive Analytics",
      slug: "maximizing-roas-with-predictive-analytics",
      category: "Performance Marketing",
      cover_image: "/blog_ads.png",
      excerpt: "Learn how to predict campaign success before allocating ad spend.",
      content: `## Predicting Campaign Success Before Allocating Ad Spend

In performance marketing, predictive analytics uses machine learning algorithms to analyze historical campaign metrics and predict future outcomes.

### How to Optimize ROAS:
- **Audience Modeling**: Predictive models can identify prospective buyers who share characteristics with your top customers.
- **Budget Allocation**: Algorithms dynamically assign spend to platforms and campaigns with the highest expected conversions.
- **Creative Testing**: AI tools analyze historical click-through rates of visual assets to estimate performance before launch.`
    },
    {
      title: "Building Trust in a Digital World",
      slug: "building-trust-in-a-digital-world",
      category: "Branding",
      cover_image: "/blog_branding.png",
      excerpt: "Strategies for maintaining authentic connection while scaling your brand.",
      content: `## Maintaining Authentic Connection While Scaling Your Brand

Establishing consumer trust online requires transparency, high-quality experiences, and consistent brand presence.

### Trust-Building Pillars:
- **Social Proof**: Real customer testimonials, verified product reviews, and case studies.
- **Secure Design**: Fast page load speeds, SSL verification, and transparent data privacy guidelines.
- **Brand Voice**: Authentic storytelling and helpful content that focuses on solving real customer problems.`
    },
    {
      title: "Viral Video Marketing Secrets for Startups",
      slug: "viral-video-marketing-secrets-for-startups",
      category: "Social Media",
      cover_image: "/blog_social.png",
      excerpt: "How to conceptualize, edit, and launch short-form content that captures views.",
      content: `## Launching Short-Form Video Content That Captures Views

Short-form content on platforms like YouTube Shorts, Instagram Reels, and TikTok has become the fastest way to build brand awareness.

### Viral Secrets:
- **The 3-Second Hook**: Start with a compelling visual or question that stops users from scrolling.
- **Micro-Animations**: Add subtitles, dynamic transitions, and sound effects to retain attention.
- **Clear Call to Action**: Direct viewers to a single, easily actionable step at the end of the video.`
    },
    {
      title: "Google Ads vs. Meta Ads: Which Channel Wins?",
      slug: "google-ads-vs-meta-ads-which-channel-wins",
      category: "SEO",
      cover_image: "/blog_ads.png",
      excerpt: "A deep dive comparison of cost-per-click, target audiences, and conversion rates.",
      content: `## Comparing CPC, Target Audiences, and Conversion Rates

Deciding where to allocate your digital marketing budget depends on your target customer's intent.

### Google Ads vs. Meta Ads:
- **Google Ads**: Targets active search intent. Best for bottom-of-funnel conversions where users are actively looking to buy.
- **Meta Ads**: Focuses on demographic and interest targeting. Ideal for building brand awareness and discovery.
- **Strategy**: A hybrid approach using Meta for discovery and Google for capturing search demand yields the best results.`
    },
    {
      title: "CRO Guidelines for High-Converting Landing Pages",
      slug: "cro-guidelines-for-high-converting-landing-pages",
      category: "Web Design",
      cover_image: "/blog_seo.png",
      excerpt: "Key elements that turn casual digital marketing traffic into verified paying customers.",
      content: `## Turning Casual Visitors into Verified Paying Customers

Conversion Rate Optimization (CRO) is the practice of increasing the percentage of users who perform a desired action on a landing page.

### Best Practices:
- **Clear Headlines**: State the value proposition in 5-10 words at the top of the page.
- **Frictionless Forms**: Keep input fields to a minimum (e.g. name, email, phone).
- **Visual Hierarchy**: Use contrasting button colors for call-to-actions (CTAs) and place them above the fold.`
    },
    {
      title: "The Science Behind Curated Color Palettes",
      slug: "the-science-behind-curated-color-palettes",
      category: "Branding",
      cover_image: "/blog_branding.png",
      excerpt: "How choosing modern colors, fonts, and typography directly impacts consumer trust.",
      content: `## How Brand Aesthetics Directly Impact Consumer Trust

Visual design sets the tone for how users perceive your company. Curated colors and typography build an immediate premium impression.

### Aesthetic Decisions:
- **Color Psychology**: Sleek dark modes represent modern technology, while warm tones build approachable, human-centric vibes.
- **Font Choice**: Using modern clean typography (like Inter or Outfit) signals state-of-the-art engineering.
- **Spacing**: Generous margins and white space allow content to breathe and feel uncluttered.`
    },
    {
      title: "Dominating Google Map Listings in Your City",
      slug: "dominating-google-map-listings-in-your-city",
      category: "SEO",
      cover_image: "/blog_seo.png",
      excerpt: "Actionable local SEO guidelines to place your service business in the top local 3-pack.",
      content: `## Local SEO Strategies to Place Your Business in the Top local 3-pack

For service businesses, high local visibility on Google Maps is the single biggest source of new leads.

### Action Steps:
- **Complete Profile**: Fill out every detail on your Google Business Profile (GBP), including hours and services.
- **Review Acquisition**: Proactively request reviews from satisfied clients and respond to each review promptly.
- **Local Citations**: Ensure your business name, address, and phone number (NAP) are identical across all local directory sites.`
    }
  ];

  console.log("Checking and seeding default blogs...");
  for (const item of defaultBlogs) {
    const [existing] = await db.query("SELECT id FROM blogs WHERE slug = ?", [item.slug]);
    if (existing.length === 0) {
      const id = Math.random().toString(36).substring(2, 15);
      const expandedContent = expandBlogContent(item.content, item.category, item.title);
      await db.query(`
        INSERT INTO blogs (id, title, slug, content, excerpt, cover_image, category, published)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `, [id, item.title, item.slug, expandedContent, item.excerpt, item.cover_image, item.category]);
      console.log(`Seeded blog: "${item.title}"`);
    }
  }

  await db.end();
  console.log("Database initialized successfully!");
}

main().catch((err) => {
  console.error("Initialization failed:", err);
  process.exit(1);
});
