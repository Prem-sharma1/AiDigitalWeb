const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { expandBlogContent } = require('./blog_expansion_helper');

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
    .replace(/(^-|-$)+/g, "");
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

// 50 Unique Unsplash Photo IDs for tech, sales, marketing, and development
const unsplashIds = [
  "photo-1460925895917-afdab827c52f", // 1. AI Content Creation
  "photo-1551836022-d5d88e9218df", // 2. ROAS Predictive Analytics
  "photo-1516321318423-f06f85e504b3", // 3. Trust in Digital World
  "photo-1553484771-047a44eee27f", // 4. Viral Video Marketing
  "photo-1542744094-3a31f103e35f", // 5. Google Ads vs Meta Ads
  "photo-1531403009284-440f080d1e12", // 6. CRO Landing Pages
  "photo-1508921912186-1d1a45ebb3c1", // 7. Curated Color Palettes
  "photo-1557200134-90327ee9fafa", // 8. Google Map Listings
  "photo-1556740738-b6a63e27c4df", // 9. SaaS Marketing Playbook
  "photo-1486312338219-ce68d2c6f44d", // 10. Voice Search Optimization
  "photo-1498050108023-c5249f4df085", // 11. Next.js App Router Speed
  "photo-1556742049-0cfed4f6a45d", // 12. Zero-Party Data Forms
  "photo-1504868584819-f8e8b4b6d7e3", // 13. Core Web Vitals (INP)
  "photo-1454165804606-c3d57bc86b40", // 14. Lead Scoring Automation
  "photo-1519389950473-47ba0277781c", // 15. ABM B2B Growth
  "photo-1555066931-4365d14bab8c", // 16. CSS Grid & Flexbox
  "photo-1522071820081-009f0129c71c", // 17. Exit-Intent Popups
  "photo-1517694712202-14dd9538aa97", // 18. Next.js Image LCP
  "photo-1579621970563-ebec7560ff3e", // 19. B2B SaaS Pricing
  "photo-1542831371-29b0f74f9713", // 20. React without Tailwind
  "photo-1556155092-490a1ba16284", // 21. Cookie-less Marketing
  "photo-1507238691740-187a5b1d37b8", // 22. Page Speed & E-commerce
  "photo-1581291518633-83b4ebd1d83e", // 23. React Server Components
  "photo-1552664730-d307ca884978", // 24. Conversational AI Funnels
  "photo-1511512578047-dfb367046420", // 25. Viral Short-Form Video
  "photo-1457369804613-52c61a468e7d", // 26. Micro-Animations UX
  "photo-1496096265110-f83ad7f96608", // 27. Local Citations Directory
  "photo-1526374965328-7f61d4dc18c5", // 28. SQL Query Indexing
  "photo-1434030216411-0b793f4b4173", // 29. Landing Page CTAs
  "photo-1573164713714-d95e436ab8d6", // 30. Razorpay Integration
  "photo-1556741533-6e6a62bd8b49", // 31. Meta Ads Retargeting
  "photo-1542744173-8e0ee26cf8e3", // 32. On-Page SEO Checklist
  "photo-1481487196290-c152efe083f5", // 33. Brand Storytelling
  "photo-1488590528505-98d2b5aba04b", // 34. Node.js Event Loop
  "photo-1559526324-4b87b5e36e44", // 35. Subscription Churn Email
  "photo-1522202176988-66273c2fd55f", // 36. Video Ads Scriptwriting
  "photo-1531538606174-0f90ff5dce83", // 37. Tailwind CSS Benefits
  "photo-1487058792275-0ad4aaf24ca7", // 38. Programmatic SEO
  "photo-1515378791036-0648a3ef77b2", // 39. Neuromarketing Forms
  "photo-1501504905252-473c47e087f8", // 40. Secure API Routes Middleware
  "photo-1531297484001-80022131f5a1", // 41. Next.js Dynamic XML Sitemap
  "photo-1552581230-c01bc911b046", // 42. Typography & Fonts
  "photo-1560250097-0b93528c311a", // 43. Interactive Calculators Lead Gen
  "photo-1563986768609-322da13575f3", // 44. Database Migrations
  "photo-1556742502-ec7c0e9f34b1", // 45. YouTube Video SEO
  "photo-1554415707-6e8cfc93fe23", // 46. Client Onboarding Agency
  "photo-1451187580459-43490279c0fa", // 47. Advanced React Custom Hooks
  "photo-1518770660439-4636190af475", // 48. Referral Sales Programs
  "photo-1504384308090-c894fdcc538d", // 49. Next.js Dynamic OG Images
  "photo-1451187580459-43490279c0fa"  // 50. Search Intent Mapping
];

// Define the 50 target topics
const topics = [
  { title: "The Future of AI-Driven Content Creation in 2026", category: "SEO" },
  { title: "Maximizing ROAS with Predictive Analytics", category: "Performance Marketing" },
  { title: "Building Trust in a Digital World", category: "Branding" },
  { title: "Viral Video Marketing Secrets for Startups", category: "Social Media" },
  { title: "Google Ads vs. Meta Ads: Which Channel Wins?", category: "SEO" },
  { title: "CRO Guidelines for High-Converting Landing Pages", category: "Web Design" },
  { title: "The Science Behind Curated Color Palettes", category: "Branding" },
  { title: "Dominating Google Map Listings in Your City", category: "SEO" },
  { title: "SaaS Marketing Playbook: Retaining Users Post-Acquisition", category: "Sales" },
  { title: "Voice Search Optimization (VSO) Strategies for 2026", category: "SEO" },
  { title: "Next.js App Router: Best Practices for Performance & Speed", category: "Web Development" },
  { title: "Zero-Party Data: Designing High-Converting Forms", category: "Sales" },
  { title: "Understanding Core Web Vitals and Interaction to Next Paint (INP)", category: "Web Development" },
  { title: "A Comprehensive Guide to AI-Powered Lead Scoring", category: "Sales" },
  { title: "Account-Based Marketing (ABM) Setup for B2B Growth", category: "SEO" },
  { title: "Mastering CSS Grid and Flexbox for Responsive Landing Pages", category: "Web Development" },
  { title: "The Psychology of Urgency: Smart Exit-Intent Popup Triggers", category: "Sales" },
  { title: "How to Optimize Next.js Images for LCP Improvements", category: "Web Development" },
  { title: "B2B SaaS Pricing Models: Flat-Rate vs. Usage-Based", category: "Sales" },
  { title: "Building high-performance landing pages in React without Tailwind CSS", category: "Web Development" },
  { title: "Cookie-less Marketing: Leveraging First-Party Data Networks", category: "SEO" },
  { title: "Why Page Load Speed Directly Controls E-commerce Conversions", category: "Sales" },
  { title: "A Deep Dive into React Server Components (RSC)", category: "Web Development" },
  { title: "Conversational AI Funnels: Building Chatbots that Close Deals", category: "Sales" },
  { title: "Creating Viral Short-Form Video Hooks for Reels and Shorts", category: "Social Media" },
  { title: "The Role of Micro-Animations in User Retention and UX", category: "Web Development" },
  { title: "Local Citations & Directory Listings for Local SEO Dominance", category: "SEO" },
  { title: "Optimizing SQL Queries: Indexing Guidelines for Web Developers", category: "Web Development" },
  { title: "Designing Landing Page CTAs that Earn a 10% Conversion Rate", category: "Sales" },
  { title: "How to Integrate Razorpay Sandbox Payments Safely in Next.js", category: "Web Development" },
  { title: "A Guide to Retargeting Campaigns on Meta Ads for Service Brands", category: "Performance Marketing" },
  { title: "The Ultimate On-Page SEO Checklist for Blog Content in 2026", category: "SEO" },
  { title: "Modern Brand Storytelling: Moving Beyond Plain Features", category: "Branding" },
  { title: "Understanding Node.js Event Loop for Server-Side Performance", category: "Web Development" },
  { title: "Reducing Churn: Automated Email Workflows for Subscription Sales", category: "Sales" },
  { title: "Creating Video Ads that Convert: Scriptwriting & Directing", category: "Performance Marketing" },
  { title: "Why Tailwind CSS is a Game-Changer for CSS Maintenance", category: "Web Development" },
  { title: "Programmatic SEO: Scaling Your Organic Traffic to 100k Visitors", category: "SEO" },
  { title: "Neuromarketing: Styling Forms that Match Human Bias", category: "Sales" },
  { title: "Securing API Routes in Next.js Using Middleware Tokens", category: "Web Development" },
  { title: "How to Build a Dynamic XML Sitemap for Next.js App Router", category: "SEO" },
  { title: "Elevating User Experience with Typography and Font Choices", category: "Branding" },
  { title: "The Power of Interactive Calculators for Inbound Lead Gen", category: "Sales" },
  { title: "Best Practices for Database Migrations in Node.js Projects", category: "Web Development" },
  { title: "YouTube SEO: Ranking Long-Form Content in Google Video Tab", category: "SEO" },
  { title: "Designing Client Onboarding Portals for Agency Growth", category: "Sales" },
  { title: "Advanced Custom Hooks in React for Reusable UI States", category: "Web Development" },
  { title: "Building a Referral Program that Drives Organic Customer Acquisition", category: "Sales" },
  { title: "Dynamic OG Image Generation in Next.js for Social Shares", category: "Web Development" },
  { title: "Mapping Search Intent: Navigational, Informational, and Transactional", category: "SEO" }
];

// Add unique cover image URL mapping
for (let i = 0; i < topics.length; i++) {
  const photoId = unsplashIds[i] || unsplashIds[i % unsplashIds.length];
  topics[i].cover = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=60`;
}

async function callGemini(apiKey, prompt, retries = 3) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Handle rate limits (429) gracefully with custom timeout
      if (response.status === 429) {
        console.warn("Gemini Rate Limit hit (429). Waiting 35 seconds to reset quota window...");
        await new Promise(r => setTimeout(r, 35000));
        return callGemini(apiKey, prompt, retries);
      }
      throw new Error(`Gemini API error (Status ${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    return generatedText;
  } catch (err) {
    if (retries > 0) {
      console.warn(`Gemini call failed: ${err.message}. Retrying in 15 seconds... (${retries} retries left)`);
      await new Promise(r => setTimeout(r, 15000));
      return callGemini(apiKey, prompt, retries - 1);
    }
    throw err;
  }
}

async function main() {
  const env = readEnv();
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined in .env file.");
    process.exit(1);
  }

  console.log("Connecting to MySQL Database...");
  const db = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'ai_digital',
    port: parseInt(env.DB_PORT || '3306', 10)
  });

  console.log("Database connected successfully.");
  console.log("Updating existing cover images to unique Unsplash URLs...");

  let updatedCount = 0;
  for (const topic of topics) {
    const slug = generateSlug(topic.title);
    // Update the cover image in case it already exists in the database
    const [result] = await db.query(
      "UPDATE blogs SET cover_image = ? WHERE slug = ? OR title = ?",
      [topic.cover, slug, topic.title]
    );
    if (result.affectedRows > 0) {
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} existing blogs with unique cover images!`);

  console.log(`\nStarting generation for remaining articles (total target: ${topics.length})...\n`);

  let successCount = 0;

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const slug = generateSlug(topic.title);

    // 1. Check if the blog article already exists in the database
    const [existing] = await db.query("SELECT id FROM blogs WHERE slug = ? OR title = ?", [slug, topic.title]);
    if (existing.length > 0) {
      // It exists and we updated its cover image above
      continue;
    }

    console.log(`[${i + 1}/${topics.length}] Generating article: "${topic.title}"...`);

    // 2. Draft the prompt
    const prompt = `Write a highly professional, detailed blog article of about 400-500 words about the topic: '${topic.title}'. 
The category is: '${topic.category}'. 
The format must be raw Markdown content. Do not enclose it in code fences (like \`\`\`markdown) or provide extra introduction sentences. Start directly with a markdown heading '## [Detailed Subtitle]'. 
Include clear structure: subheadings (###), paragraphs, and structured bullet lists containing specific strategies, examples, and expert insights. 
Keep the tone authoritative, technical, and high-value.`;

    try {
      let content;
      try {
        const rawContent = await callGemini(apiKey, prompt);
        content = rawContent.trim();
      } catch (geminiErr) {
        console.warn(` -> Gemini API failed: ${geminiErr.message}. Using high-quality fallback template.`);
        const intro = `## Overview of ${topic.title}\n\nUnderstanding and implementing professional strategies for ${topic.title} is essential for digital success. In this article, we explore key concepts, actionable strategies, and solutions to help you scale.`;
        content = expandBlogContent(intro, topic.category, topic.title);
      }

      // 4. Generate Excerpt
      const plainText = content.replace(/[#*\-`_]/g, "").replace(/\s+/g, " ").trim();
      const excerpt = plainText.substring(0, 180) + (plainText.length > 180 ? "..." : "");

      // 5. Insert into Database
      const id = "gen_" + Math.random().toString(36).substring(2, 12);
      await db.query(
        `INSERT INTO blogs (id, title, slug, content, excerpt, cover_image, category, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [id, topic.title, slug, content, excerpt, topic.cover, topic.category]
      );

      console.log(` -> Successfully seeded: "${topic.title}" (ID: ${id})`);
      successCount++;

      // 6. Sleep for rate limiting (10 seconds delay between requests to stay safe under free-tier limits)
      if (i < topics.length - 1) {
        await new Promise(r => setTimeout(r, 10000));
      }
    } catch (err) {
      console.error(` -> FAILED to generate article for "${topic.title}":`, err.message);
    }
  }

  console.log(`\nExecution finished. Seeded ${successCount} new articles. Cover images successfully updated.`);
  await db.end();
}

main().catch(err => {
  console.error("Batch seeding execution error:", err);
});
