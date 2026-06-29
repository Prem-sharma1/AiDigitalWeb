const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function readEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const config = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
      config[key] = value.trim();
    }
  });
  return config;
}

async function main() {
  const env = readEnv();
  const db = await mysql.createConnection({
    host: env.DB_HOST || '127.0.0.1',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'ai_digital'
  });

  const [rows] = await db.query("SELECT id, title, cover_image FROM blogs");
  console.log(`Pinging cover images for ${rows.length} blogs...\n`);

  let brokenCount = 0;
  for (let i = 0; i < rows.length; i++) {
    const blog = rows[i];
    const url = blog.cover_image;
    if (!url) {
      console.log(`[${i+1}] FAILED: Blog "${blog.title}" has NO cover_image value!`);
      brokenCount++;
      continue;
    }

    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) {
        console.log(`[${i+1}] FAILED (Status ${res.status}): Blog "${blog.title}" -> ${url}`);
        brokenCount++;
      } else {
        console.log(`[${i+1}] OK (Status ${res.status}): Blog "${blog.title}"`);
      }
    } catch (err) {
      console.log(`[${i+1}] ERROR (${err.message}): Blog "${blog.title}" -> ${url}`);
      brokenCount++;
    }
  }

  console.log(`\nFinished testing. Total blogs: ${rows.length}, Broken images: ${brokenCount}`);
  await db.end();
}

main().catch(err => {
  console.error("Execution error:", err);
});
