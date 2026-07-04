const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function readEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.error(".env file not found");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf8");
  const config = {};
  content.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      config[key] = value.trim();
    }
  });
  return config;
}

async function cleanDatabase() {
  const env = readEnv();
  console.log("⚙️  Connecting to MySQL database to remove .mp4 paths...");
  console.log(`- Host: ${env.DB_HOST || "localhost"}`);
  console.log(`- Database: ${env.DB_NAME || "ai_digital"}`);
  console.log(`- User: ${env.DB_USER || "root"}`);

  try {
    const connection = await mysql.createConnection({
      host: env.DB_HOST || "localhost",
      user: env.DB_USER || "root",
      password: env.DB_PASSWORD || "",
      database: env.DB_NAME || "ai_digital",
      port: parseInt(env.DB_PORT || "3306", 10),
    });

    const [result] = await connection.query("DELETE FROM portfolio_items WHERE src LIKE '%.mp4'");
    console.log(`✅ Success: Deleted ${result.affectedRows} broken .mp4 entries from MySQL database.`);
    await connection.end();
  } catch (err) {
    console.error("❌ Database clean failed:", err.message);
  }
}

function cleanSqlFile() {
  const sqlPath = path.join(__dirname, "..", "database.sql");
  if (!fs.existsSync(sqlPath)) {
    console.warn("⚠️  database.sql file not found in project root. Skipping SQL file cleanup.");
    return;
  }

  console.log("📂 Cleaning database.sql...");
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");
  const lines = sqlContent.split("\n");
  const cleanedLines = [];
  let removedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // If the line contains .mp4 or /ai_videos/, skip it
    if (line.includes(".mp4") || line.includes("/ai_videos/")) {
      // If the line ends with a semicolon, we need to convert the previous line to end with a semicolon
      if (line.trim().endsWith(";")) {
        // Find the last added line and update it to end with a semicolon
        if (cleanedLines.length > 0) {
          const lastIdx = cleanedLines.length - 1;
          cleanedLines[lastIdx] = cleanedLines[lastIdx].trim().replace(/,$/, ";");
        }
      }
      removedCount++;
      continue;
    }
    cleanedLines.push(line);
  }

  fs.writeFileSync(sqlPath, cleanedLines.join("\n"), "utf-8");
  console.log(`✅ Success: Removed ${removedCount} lines containing .mp4 references from database.sql.`);
}

async function run() {
  await cleanDatabase();
  cleanSqlFile();
  console.log("\n🎉 Cleanup complete!");
}

run();
