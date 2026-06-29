const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Helper to unescape HTML entities
function unescapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 6);
}

// Read database config from .env
function readEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found at:', envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const config = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if present
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

async function scrapeArticle(url) {
  console.log(`Scraping article: ${url}...`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) {
      console.error(`Failed to fetch article: ${url}. Status: ${res.status} ${res.statusText}`);
      return null;
    }
    const html = await res.text();

    // Title
    let title = "";
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i) ||
                        html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (ogTitleMatch) {
      title = unescapeHtml(ogTitleMatch[1] || ogTitleMatch[0]);
    }
    if (!title) title = "Imported Neil Patel Post";

    // Excerpt
    let excerpt = "";
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i) ||
                       html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    if (ogDescMatch) {
      excerpt = unescapeHtml(ogDescMatch[1] || ogDescMatch[0]);
    }

    // Cover Image
    let coverImage = "";
    const ogImgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogImgMatch) {
      coverImage = ogImgMatch[1];
    }

    // Content extraction (extract paragraph text blocks)
    let contentArea = html;
    contentArea = contentArea.replace(/<head[^>]*>([\s\S]*?)<\/head>/gi, "");
    contentArea = contentArea.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");
    contentArea = contentArea.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "");
    
    const entryMatch = html.match(/<div[^>]+class=["'][^"']*entry-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                       html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (entryMatch) {
      contentArea = entryMatch[1];
    }

    const blockRegex = /<(h[1-6]|p|li)[^>]*>([\s\S]*?)<\/\1>/gi;
    let blockMatch;
    const blocks = [];
    while ((blockMatch = blockRegex.exec(contentArea)) !== null) {
      const tag = blockMatch[1].toLowerCase();
      let blockContent = blockMatch[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      blockContent = unescapeHtml(blockContent);
      if (blockContent.length > 15) {
        if (tag.startsWith("h")) {
          blocks.push(`## ${blockContent}`);
        } else if (tag === "li") {
          blocks.push(`- ${blockContent}`);
        } else {
          blocks.push(blockContent);
        }
      }
    }

    const content = blocks.join("\n\n");
    return {
      title,
      slug: generateSlug(title),
      excerpt: excerpt.substring(0, 240) + "...",
      content: content || `Read more at: ${url}`,
      coverImage
    };
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return null;
  }
}

async function run() {
  const env = readEnv();
  
  console.log('Connecting to database...');
  const db = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'ai_digital',
    port: parseInt(env.DB_PORT || '3306', 10)
  });

  console.log('Fetching Neil Patel Blog Home...');
  const res = await fetch('https://neilpatel.com/blog/', {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  if (!res.ok) {
    console.error('Failed to load Neil Patel blog home page.');
    process.exit(1);
  }
  const html = await res.text();

  // Extract individual article links from the main page
  const linkRegex = /href=["'](https:\/\/neilpatel\.com\/blog\/[a-zA-Z0-9\-]+\/)["']/g;
  let match;
  const urls = new Set();
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    if (!url.endsWith('/blog/') && !url.includes('/page/') && !url.includes('/category/')) {
      urls.add(url);
    }
  }

  const listUrls = Array.from(urls).slice(0, 3);
  console.log(`Found ${urls.size} articles. Importing the latest ${listUrls.length}:`, listUrls);

  let imported = 0;
  for (const url of listUrls) {
    const art = await scrapeArticle(url);
    if (!art) continue;

    // Check if duplicate
    const [existing] = await db.query("SELECT id FROM blogs WHERE title = ?", [art.title]);
    if (existing.length > 0) {
      console.log(`Skipped (already exists): "${art.title}"`);
      continue;
    }

    const id = "neil_" + Math.random().toString(36).substring(2, 12);
    await db.query(
      `INSERT INTO blogs (id, title, slug, content, excerpt, cover_image, category, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [id, art.title, art.slug, art.content, art.excerpt, art.coverImage || null, "SEO"]
    );
    console.log(`Successfully imported: "${art.title}"`);
    imported++;
  }

  console.log(`Finished! Successfully imported ${imported} articles from Neil Patel Blog.`);
  await db.end();
}

run().catch(err => {
  console.error(err);
});
