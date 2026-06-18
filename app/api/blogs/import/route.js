import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import crypto from "crypto";

function checkAuth(req) {
  const session = req.cookies.get("admin_session");
  return session && session.value === "authenticated";
}

// Clean CDATA wrappers from XML text
function cleanCData(text) {
  let clean = text.trim();
  if (clean.startsWith("<![CDATA[")) {
    clean = clean.substring(9);
  }
  if (clean.endsWith("]]>")) {
    clean = clean.substring(0, clean.length - 3);
  }
  return clean.trim();
}

// Simple XML tag parser helper
function extractTagContent(xml, tagName) {
  const openTag = `<${tagName}>`;
  const closeTag = `</${tagName}>`;
  const startIndex = xml.indexOf(openTag);
  if (startIndex === -1) {
    // Try namespace tag matching (e.g. content:encoded)
    const nsRegex = new RegExp(`<[^>]*:?${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/[^>]*:?${tagName}>`, "i");
    const match = xml.match(nsRegex);
    return match ? cleanCData(match[1]) : "";
  }
  const endIndex = xml.indexOf(closeTag, startIndex);
  if (endIndex === -1) return "";
  return cleanCData(xml.substring(startIndex + openTag.length, endIndex));
}

// Clean HTML into simple markdown-like/readable text for fallback if needed
function htmlToMarkdown(html) {
  if (!html) return "";
  let text = html;
  // Replace simple HTML tags
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "\n## $1\n");
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, "\n$1\n");
  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "\n- $1");
  text = text.replace(/<ul[^>]*>/gi, "\n");
  text = text.replace(/<\/ul>/gi, "\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  text = text.replace(/<img\s+[^>]*src="([^"]*)"[^>]*>/gi, "\n![]($1)\n");
  // Remove remaining tags
  text = text.replace(/<[^>]+>/g, "");
  // Unescape common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  return text.trim();
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 6);
}

export async function POST(req) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sourceType, feedUrl, username, defaultCategory } = await req.json();

    if (sourceType === "devto" && !username) {
      return NextResponse.json({ error: "Dev.to username is required." }, { status: 400 });
    }
    if (sourceType === "rss" && !feedUrl) {
      return NextResponse.json({ error: "RSS Feed URL is required." }, { status: 400 });
    }

    let articlesToImport = [];

    if (sourceType === "devto") {
      // 1. Fetch articles list from Dev.to
      const listRes = await fetch(`https://www.youngurbanproject.com/blog/?username=${encodeURIComponent(username)}`, {
        headers: { "User-Agent": "Mozilla/5.0 (AI Digital Blog Importer)" },
      });
      if (!listRes.ok) {
        throw new Error(`Failed to fetch Dev.to articles list: ${listRes.statusText}`);
      }
      const list = await listRes.json();

      // 2. Fetch full body markdown for the latest 10 articles
      const limitList = list.slice(0, 10);
      for (const item of limitList) {
        try {
          const detailRes = await fetch(`https://www.youngurbanproject.com/blog/${item.id}`, {
            headers: { "User-Agent": "Mozilla/5.0 (AI Digital Blog Importer)" },
          });
          if (detailRes.ok) {
            const detail = await detailRes.json();
            articlesToImport.push({
              title: detail.title,
              slug: detail.slug || generateSlug(detail.title),
              excerpt: detail.description || item.description || "A blog post imported from Dev.to.",
              content: detail.url || detail.body_markdown || "",
              coverImage: detail.cover_image || detail.social_image || "",
              category: defaultCategory || "Marketing",
              published: true,
            });
          }
        } catch (detailErr) {
          console.error(`Failed to fetch Dev.to article details for ID ${item.id}:`, detailErr);
        }
      }
    } else if (sourceType === "rss") {
      // 1. Fetch RSS Feed XML
      const rssRes = await fetch(feedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (AI Digital Blog Importer)" },
      });
      if (!rssRes.ok) {
        throw new Error(`Failed to fetch RSS Feed: ${rssRes.statusText}`);
      }
      const xml = await rssRes.text();

      // 2. Parse XML items manually
      const itemRegex = /<item>([\s\\S]*?)<\/item>/g;
      let match;
      const items = [];
      while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
        items.push(match[1]);
      }

      for (const itemXml of items) {
        const title = extractTagContent(itemXml, "title");
        const link = extractTagContent(itemXml, "link");
        const rawContent = extractTagContent(itemXml, "content:encoded") || extractTagContent(itemXml, "description");

        // Extract plain text excerpt from HTML content
        const cleanTextOnly = rawContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        const excerpt = cleanTextOnly.substring(0, 150) + (cleanTextOnly.length > 150 ? "..." : "");

        // Find cover image if present
        let coverImage = "";
        const imgMatch = rawContent.match(/<img[^>]+src="([^"]+)"/i);
        if (imgMatch) {
          coverImage = imgMatch[1];
        }

        if (title) {
          articlesToImport.push({
            title,
            slug: generateSlug(title),
            excerpt: excerpt || "A blog post imported from external RSS feed.",
            content: link || htmlToMarkdown(rawContent) || "",
            coverImage,
            category: defaultCategory || "Marketing",
            published: true,
          });
        }
      }
    }

    if (articlesToImport.length === 0) {
      return NextResponse.json({ success: true, importedCount: 0, message: "No new articles found to import." });
    }

    // Insert into MySQL database using connection pool
    let importedCount = 0;
    let skippedCount = 0;

    for (const art of articlesToImport) {
      try {
        // Double check slug uniqueness
        const [existing] = await pool.query("SELECT id FROM blogs WHERE slug = ? OR title = ?", [art.slug, art.title]);
        if (existing.length > 0) {
          skippedCount++;
          continue;
        }

        const id = "ext_" + Math.random().toString(36).substring(2, 15);
        await pool.query(
          `INSERT INTO blogs (id, title, slug, content, excerpt, cover_image, category, published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, art.title, art.slug, art.content, art.excerpt, art.coverImage || null, art.category, art.published ? 1 : 0]
        );
        importedCount++;
      } catch (dbErr) {
        console.error("Database insert error for imported article:", dbErr);
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      skippedCount,
      message: `Import completed. Imported: ${importedCount}, Skipped/Duplicates: ${skippedCount}`,
    });
  } catch (error) {
    console.error("External blog import route error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
