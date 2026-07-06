/**
 * sync-portfolio-to-db.js
 * Run once: node scripts/sync-portfolio-to-db.js
 * Reads portfolioData.json and pushes ALL data into MySQL portfolio_items table.
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Load .env manually
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of envLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    const val = trimmed.substring(eqIdx + 1).trim().replace(/^"|"$/g, "");
    process.env[key] = val;
  }
}
console.log("⚙️  Env Loaded. User:", process.env.DB_USER, "| Password Status:", process.env.DB_PASSWORD ? "[Set]" : "[Empty]");

const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "ai_digital",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  connectTimeout: 10000,
};

async function main() {
  console.log("🔌 Connecting to MySQL...", DB_CONFIG.host, DB_CONFIG.database);

  const connection = await mysql.createConnection(DB_CONFIG);
  console.log("✅ Connected.");

  // Ensure table exists
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id VARCHAR(36) NOT NULL,
      section VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT NULL,
      industry VARCHAR(100) DEFAULT NULL,
      metric VARCHAR(50) DEFAULT NULL,
      metric_label VARCHAR(100) DEFAULT NULL,
      description TEXT DEFAULT NULL,
      tags TEXT DEFAULT NULL,
      accent VARCHAR(50) DEFAULT NULL,
      icon VARCHAR(50) DEFAULT NULL,
      src VARCHAR(500) DEFAULT NULL,
      type VARCHAR(50) DEFAULT NULL,
      global_index INT DEFAULT NULL,
      thumbnail VARCHAR(255) DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  try {
    await connection.execute("ALTER TABLE portfolio_items ADD COLUMN thumbnail VARCHAR(255) DEFAULT NULL");
  } catch (err) {
    // Ignore error if column already exists
  }
  console.log("✅ Table ready.");

  // Read JSON data
  const jsonPath = path.join(__dirname, "..", "data", "portfolioData.json");
  const portfolioData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // Clear existing data
  await connection.execute("DELETE FROM portfolio_items");
  console.log("🗑️  Cleared existing portfolio_items.");

  let inserted = 0;

  // 1. Showcase Projects
  for (const item of (portfolioData.showcaseProjects || [])) {
    const id = item.id || crypto.randomUUID();
    await connection.execute(
      `INSERT INTO portfolio_items (id, section, title, category, industry, metric, metric_label, description, tags, accent, icon)
       VALUES (?, 'showcase', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, item.title, item.category || null, item.industry || null, item.metric || null,
       item.metricLabel || null, item.description || null, JSON.stringify(item.tags || []),
       item.accent || null, item.icon || null]
    );
    inserted++;
  }
  console.log(`  ✅ Showcase Projects: ${portfolioData.showcaseProjects?.length || 0} rows`);

  // 2. Featured Industries & Projects
  for (const ind of (portfolioData.industries || [])) {
    for (const proj of (ind.projects || [])) {
      const id = crypto.randomUUID();
      await connection.execute(
        `INSERT INTO portfolio_items (id, section, title, category, industry, description)
         VALUES (?, 'featured', ?, ?, ?, ?)`,
        [id, proj.title, proj.type || null, ind.name, ind.description || null]
      );
      inserted++;
    }
  }
  console.log(`  ✅ Featured Industries: ${portfolioData.industries?.length || 0} industries`);

  // 3. Other Projects
  for (const proj of (portfolioData.otherProjects || [])) {
    const id = crypto.randomUUID();
    await connection.execute(
      `INSERT INTO portfolio_items (id, section, title, category) VALUES (?, 'other', ?, ?)`,
      [id, proj.title, proj.type || null]
    );
    inserted++;
  }
  console.log(`  ✅ Other Projects: ${portfolioData.otherProjects?.length || 0} rows`);

  // 4. Creative Groups (all 52 images + videos)
  let creativeCount = 0;
  for (const grp of (portfolioData.creativeGroups || [])) {
    for (const img of (grp.images || [])) {
      const id = crypto.randomUUID();
      await connection.execute(
        `INSERT INTO portfolio_items (id, section, title, description, src, type, global_index, industry, category, thumbnail)
         VALUES (?, 'creative', ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, img.title, img.description || null, img.src, img.type || "image",
         img.globalIndex || null, grp.industry, img.category || null, img.thumbnail || null]
      );
      inserted++;
      creativeCount++;
    }
  }
  console.log(`  ✅ Creative Groups: ${portfolioData.creativeGroups?.length || 0} groups, ${creativeCount} media items`);

  await connection.end();
  console.log(`\n🎉 Done! Total ${inserted} rows saved to database.`);
  console.log("   Restart your Next.js server to see the changes live.");
}

main().catch((err) => {
  console.error("❌ Sync failed:", err.message);
  process.exit(1);
});
