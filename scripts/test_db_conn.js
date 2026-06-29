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

async function testConnection() {
  const env = readEnv();
  console.log('Connecting with details:');
  console.log(`Host: ${env.DB_HOST}`);
  console.log(`User: ${env.DB_USER}`);
  console.log(`Database: ${env.DB_NAME}`);
  console.log(`Port: ${env.DB_PORT}`);
  
  try {
    const db = await mysql.createConnection({
      host: env.DB_HOST || 'localhost',
      user: env.DB_USER || 'root',
      password: env.DB_PASSWORD || '',
      database: env.DB_NAME || 'ai_digital',
      port: parseInt(env.DB_PORT || '3306', 10)
    });
    
    console.log('Connection successful!');
    const [rows] = await db.query("SELECT id, title, slug, published FROM blogs");
    console.log(`Found ${rows.length} blogs in database:`);
    rows.forEach(r => {
      console.log(` - [${r.published ? 'Active' : 'Draft'}] Title: "${r.title}", Slug: "${r.slug}"`);
    });
    await db.end();
  } catch (err) {
    console.error('DATABASE CONNECTION FAILED:', err.message);
  }
}

testConnection();
