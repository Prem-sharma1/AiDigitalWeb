const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

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
      global_index INT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
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
  console.log('Table "whatsapp_logs" verified.');

  // 4. Seed pricing_plans
  const pricingPath = path.join(process.cwd(), "data", "pricingData.json");
  if (fs.existsSync(pricingPath)) {
    const rawPricing = fs.readFileSync(pricingPath, "utf-8");
    const pricingData = JSON.parse(rawPricing);

    await db.query("DELETE FROM pricing_plans");
    console.log("Cleared old pricing plans.");

    const categories = ["adsPlans", "websitePlans", "creativePacks", "aiVideoPlans"];
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
            (id, section, title, description, src, type, global_index, industry)
            VALUES (?, 'creative', ?, ?, ?, ?, ?, ?)
          `, [
            id,
            img.title,
            img.description || null,
            img.src,
            img.type || "image",
            img.globalIndex || null,
            grp.industry
          ]);
        }
      }
    }
    console.log("Seeded portfolio items.");
  }

  // 6. Seed default Blog
  const [blogs] = await db.query("SELECT COUNT(*) as cnt FROM blogs");
  if (blogs[0].cnt === 0) {
    const id = Math.random().toString(36).substring(2, 15);
    await db.query(`
      INSERT INTO blogs (id, title, slug, content, excerpt, category, published)
      VALUES (?, 'Welcome to AI Digital Blogs', 'welcome-to-ai-digital-blogs', ?, ?, 'Marketing', 1)
    `, [
      id,
      `## Exploring AI Powered Digital Marketing

Welcome to our blog! We specialize in generating high-performing leads, developing optimized web applications, and building AI videos.

### Why Choose AI Marketing?
- **Efficiency**: AI algorithms analyze audience insights rapidly.
- **Conversion**: Dynamically targeted landing pages convert higher.
- **Speed**: Automating workflow saves precious time.`,
      "An overview of how AI digital neural tech is transforming digital marketing paradigms."
    ]);
    console.log("Seeded default blog article.");
  }

  await db.end();
  console.log("Database initialized successfully!");
}

main().catch((err) => {
  console.error("Initialization failed:", err);
  process.exit(1);
});
