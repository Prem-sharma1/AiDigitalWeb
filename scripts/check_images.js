const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function readEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
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

async function checkImages() {
  const env = readEnv();
  const db = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'ai_digital',
    port: parseInt(env.DB_PORT || '3306', 10)
  });
  
  const [rows] = await db.query("SELECT title, cover_image FROM blogs");
  console.log(`Found ${rows.length} blogs:`);
  rows.forEach((r, i) => {
    console.log(`[${i+1}] Title: "${r.title}" -> Cover: "${r.cover_image}"`);
  });
  await db.end();
}

checkImages();
