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

const { expandBlogContent } = require('./blog_expansion_helper');

async function main() {
  const env = readEnv();
  const db = await mysql.createConnection({
    host: env.DB_HOST || '127.0.0.1',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'ai_digital',
    port: parseInt(env.DB_PORT || '3306', 10)
  });

  const [blogs] = await db.query("SELECT id, title, content, category FROM blogs");
  console.log(`Analyzing word count for ${blogs.length} blogs...\n`);

  let expandedCount = 0;
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const initialContent = blog.content || "";
    const words = initialContent.trim().split(/\s+/).filter(w => w.length > 0);
    const initialWordCount = words.length;

    if (initialWordCount < 300) {
      const expandedContent = expandBlogContent(initialContent, blog.category, blog.title);
      const newWords = expandedContent.trim().split(/\s+/).filter(w => w.length > 0);

      await db.query("UPDATE blogs SET content = ? WHERE id = ?", [expandedContent, blog.id]);
      console.log(`[${i+1}] EXPANDED: "${blog.title}" (${initialWordCount} words -> ${newWords.length} words)`);
      expandedCount++;
    } else {
      console.log(`[${i+1}] SKIP: "${blog.title}" already has ${initialWordCount} words`);
    }
  }

  console.log(`\nFinished! Successfully expanded ${expandedCount} blogs to over 300 words.`);
  await db.end();
}

main().catch(err => {
  console.error("Execution error:", err);
});
