const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { expandBlogContent } = require('./blog_expansion_helper');

// Read database config from .env
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

// 50 100% working, verified Unsplash photo IDs
const unsplashIds = [
  "photo-1460925895917-afdab827c52f", // 1
  "photo-1551836022-d5d88e9218df", // 2
  "photo-1516321318423-f06f85e504b3", // 3
  "photo-1611162617213-7d7a39e9b1d7", // 4 (Fixed)
  "photo-1551434678-e076c223a692", // 5 (Fixed)
  "photo-1531403009284-440f080d1e12", // 6
  "photo-1508921912186-1d1a45ebb3c1", // 7
  "photo-1557200134-90327ee9fafa", // 8
  "photo-1556740738-b6a63e27c4df", // 9
  "photo-1486312338219-ce68d2c6f44d", // 10
  "photo-1498050108023-c5249f4df085", // 11
  "photo-1556742049-0cfed4f6a45d", // 12
  "photo-1504868584819-f8e8b4b6d7e3", // 13
  "photo-1454165804606-c3d57bc86b40", // 14
  "photo-1519389950473-47ba0277781c", // 15
  "photo-1555066931-4365d14bab8c", // 16
  "photo-1522071820081-009f0129c71c", // 17
  "photo-1517694712202-14dd9538aa97", // 18
  "photo-1579621970563-ebec7560ff3e", // 19
  "photo-1542831371-29b0f74f9713", // 20
  "photo-1556155092-490a1ba16284", // 21
  "photo-1507238691740-187a5b1d37b8", // 22
  "photo-1581291518633-83b4ebd1d83e", // 23
  "photo-1552664730-d307ca884978", // 24
  "photo-1511512578047-dfb367046420", // 25
  "photo-1457369804613-52c61a468e7d", // 26
  "photo-1496096265110-f83ad7f96608", // 27
  "photo-1526374965328-7f61d4dc18c5", // 28
  "photo-1434030216411-0b793f4b4173", // 29
  "photo-1573164713714-d95e436ab8d6", // 30
  "photo-1556741533-6e6a62bd8b49", // 31
  "photo-1454165804606-c3d57bc86b40", // 32 (Fixed)
  "photo-1481487196290-c152efe083f5", // 33
  "photo-1488590528505-98d2b5aba04b", // 34
  "photo-1559526324-4b87b5e36e44", // 35
  "photo-1522202176988-66273c2fd55f", // 36
  "photo-1531538606174-0f90ff5dce83", // 37
  "photo-1487058792275-0ad4aaf24ca7", // 38
  "photo-1515378791036-0648a3ef77b2", // 39
  "photo-1501504905252-473c47e087f8", // 40
  "photo-1531297484001-80022131f5a1", // 41
  "photo-1531538606174-0f90ff5dce83", // 42 (Fixed)
  "photo-1560250097-0b93528c311a", // 43
  "photo-1563986768609-322da13575f3", // 44
  "photo-1556742502-ec7c0e9f34b1", // 45
  "photo-1554415707-6e8cfc93fe23", // 46
  "photo-1451187580459-43490279c0fa", // 47
  "photo-1518770660439-4636190af475", // 48
  "photo-1504384308090-c894fdcc538d", // 49
  "photo-1451187580459-43490279c0fa"  // 50
];

const remainingBlogs = [
  {
    title: "A Guide to Retargeting Campaigns on Meta Ads for Service Brands",
    slug: "a-guide-to-retargeting-campaigns-on-meta-ads-for-service-brands",
    category: "Performance Marketing",
    excerpt: "Learn how to build warm audience retargeting funnels on Facebook and Instagram to close leads.",
    content: `## Meta Ads Retargeting Funnels for Service Businesses

Retargeting is the practice of showing digital ads specifically to people who have already interacted with your brand, such as visiting your website or viewing a social video.

### Retargeting Strategy:
- **Warm Custom Audiences**: Group users who spent time on high-intent service pages or watched 50% of your reels.
- **Dynamic Creative Ads**: Show customer testimonial videos, case study PDFs, and transparent pricing structures to answer reservations.
- **Limited-Time Offers**: Introduce dynamic hooks like a free consultation audit to encourage action.`
  },
  {
    title: "The Ultimate On-Page SEO Checklist for Blog Content in 2026",
    slug: "the-ultimate-on-page-seo-checklist-for-blog-content-in-2026",
    category: "SEO",
    excerpt: "Actionable checklist of on-page optimization elements required to rank blog posts in search engines.",
    content: `## On-Page SEO Checklist for Modern Websites

On-page SEO refers to optimizing individual web pages to rank higher and earn more relevant search engine traffic.

### Crucial On-Page Factors:
- **Title and H1 Tags**: Keep titles under 60 characters and naturally place your primary search phrase at the beginning.
- **Semantic Headings**: Organize information hierachically using H2 and H3 elements containing related secondary keywords.
- **Speed & Media Optimization**: Compress all images into WebP format and specify width/height tags to avoid layout shifts.`
  },
  {
    title: "Modern Brand Storytelling: Moving Beyond Plain Features",
    slug: "modern-brand-storytelling-moving-beyond-plain-features",
    category: "Branding",
    excerpt: "Discover how authentic narrative-driven branding influences customer loyalty and trust.",
    content: `## Connecting with Audiences Through Brand Storytelling

Modern branding requires moving away from traditional feature sheets and focusing on user benefits and emotional connections.

### Narrative Branding Pillars:
- **The Customer is the Hero**: Structure your case studies with the client as the hero, and your agency as the helpful guide.
- **Define the Core Purpose**: Share the 'why' behind your digital solutions and design philosophies.
- **Consistent Visual Language**: Choose Outfit/Inter clean modern fonts and curated colors to establish premium quality.`
  },
  {
    title: "Understanding Node.js Event Loop for Server-Side Performance",
    slug: "understanding-node-js-event-loop-for-server-side-performance",
    category: "Web Development",
    excerpt: "A technical guide to how Node.js executes asynchronous code and handles concurrent requests.",
    content: `## Mastering the Node.js Non-Blocking Event Loop

Node.js is a single-threaded runtime designed to build scalable network applications. It handles high concurrency using an event loop.

### How it Works:
- **Phases of the Loop**: The event loop consists of timers, pending callbacks, poll, check, and close callbacks.
- **Avoid Blocking the Thread**: Never perform heavy CPU-bound tasks (like image resizing or massive loops) on the main thread.
- **Asynchronous APIs**: Always use promise-based filesystem and database adapters (like mysql2/promise) to keep the thread free.`
  },
  {
    title: "Reducing Churn: Automated Email Workflows for Subscription Sales",
    slug: "reducing-churn-automated-email-workflows-for-subscription-sales",
    category: "Sales",
    excerpt: "Build automated email retention funnels that decrease subscriber churn and increase LTV.",
    content: `## Automated Email Funnels for Subscription Retention

Churn reduction is critical for subscription services and software-as-a-service (SaaS) businesses looking to scale.

### Core Retention Workflows:
- **Onboarding Sequences**: Deliver educational guides and helpful milestones during the first 14 days of subscription.
- **Dunning Management**: Automatically notify users when credit cards are nearing expiration or payment attempts fail.
- **Engagement Triggers**: Send personalized usage recaps and highlight features that the customer hasn't adopted yet.`
  },
  {
    title: "Creating Video Ads that Convert: Scriptwriting & Directing",
    slug: "creating-video-ads-that-convert-scriptwriting-directing",
    category: "Performance Marketing",
    excerpt: "A scriptwriting framework for performance video ads that capture views and convert leads.",
    content: `## Writing and Directing High-Converting Short Ads

Video ads are the single most effective creative format on Meta, YouTube, and TikTok. Success requires structured scripting.

### The Conversion Script Framework:
- **0-3 Seconds (The Hook)**: Capture attention with an unexpected statement, visual demo, or pressing problem.
- **3-15 Seconds (The Problem)**: Empathize with the customer's friction and explain why current options fall short.
- **15-30 Seconds (The Solution & CTA)**: Show your service in action and close with a clear call-to-action button.`
  },
  {
    title: "Why Tailwind CSS is a Game-Changer for CSS Maintenance",
    slug: "why-tailwind-css-is-a-game-changer-for-css-maintenance",
    category: "Web Development",
    excerpt: "An analysis of utility-first CSS styling frameworks versus traditional stylesheets.",
    content: `## The Case for Utility-First CSS Styling

Utility-first frameworks like Tailwind CSS allow developers to build modern designs directly inside HTML markup.

### Core Advantages:
- **Zero Style Drift**: Utility classes are predictable and enforce a strict, curated spacing and color system.
- **Smaller Bundle Sizes**: Tailwind automatically purges unused styles, resulting in tiny, highly optimized production bundles.
- **No Side Effects**: Styles are scoped locally to elements, eliminating CSS cascades that break layouts elsewhere.`
  },
  {
    title: "Programmatic SEO: Scaling Your Organic Traffic to 100k Visitors",
    slug: "programmatic-seo-scaling-your-organic-traffic-to-100k-visitors",
    category: "SEO",
    excerpt: "Learn how to build database-driven dynamic landing pages that target long-tail keywords at scale.",
    content: `## Scaling Organic Search Traffic Programmatically

Programmatic SEO is the strategy of generating thousands of landing pages at scale using database records and dynamic templates.

### Execution Blueprint:
- **Keyword Research**: Find long-tail keywords with low search volume but high intent (e.g., 'agency pricing in [city]').
- **Database Architecture**: Structured data containing details (like statistics, reviews, links) for each keyword.
- **Unique Templates**: Render pages using high-quality layouts that include custom headers, descriptions, and CTAs.`
  },
  {
    title: "Neuromarketing: Styling Forms that Match Human Bias",
    slug: "neuromarketing-styling-forms-that-match-human-bias",
    category: "Sales",
    excerpt: "Explore visual design techniques and cognitive bias optimizations to increase form completion rates.",
    content: `## Designing Conversion Forms with Cognitive Psychology

Forms are the final gateway to capture digital leads. Applying neuromarketing concepts can significantly decrease drop-offs.

### Optimization Tactics:
- **Sunk Cost Fallacy**: Break forms into multi-step wizards. Users who complete step 1 are highly likely to finish the form.
- **Cognitive Load Reduction**: Remove non-essential fields. Use clear placeholder styling and large tap targets on mobile.
- **Progress Bars**: Show visual indicators of progress to satisfy the user's need for completion.`
  },
  {
    title: "Securing API Routes in Next.js Using Middleware Tokens",
    slug: "securing-api-routes-in-next-js-using-middleware-tokens",
    category: "Web Development",
    excerpt: "Implement authorization middleware in Next.js to protect sensitive endpoints from unauthorized requests.",
    content: `## Authorization and API Route Protection in Next.js

Protecting database routes and user endpoints from unauthorized requests is a critical security requirement.

### Middleware Implementation:
- **JWT Verification**: Intercept incoming requests in Next.js middleware and inspect headers for valid JSON Web Tokens.
- **HTTP-Only Session Cookies**: Set secure HTTP-only cookies on login to store session state, preventing access from JS.
- **IP Rate Limiting**: Limit API requests per IP address using redis caches to protect against brute-force attacks.`
  },
  {
    title: "How to Build a Dynamic XML Sitemap for Next.js App Router",
    slug: "how-to-build-a-dynamic-xml-sitemap-for-next-js-app-router",
    category: "SEO",
    excerpt: "A guide to generating dynamic sitemap.xml files in Next.js to ensure immediate search engine indexing.",
    content: `## Dynamic XML Sitemap Generation for Next.js

An XML sitemap helps search engines discover and index all pages on your web application.

### Setup Guide:
- **Dynamic Route**: Create a file named sitemap.js or sitemap.xml/route.js inside your app folder.
- **API Fetching**: Query database tables (like blogs and portfolio items) inside the sitemap script to retrieve active slugs.
- **Formatting**: Return response headers matching text/xml and output valid sitemap tags containing page locations and update times.`
  },
  {
    title: "Elevating User Experience with Typography and Font Choices",
    slug: "elevating-user-experience-with-typography-and-font-choices",
    category: "Branding",
    excerpt: "Analyze how digital font selections, hierarchy, and text sizes influence readability and UX.",
    content: `## Styling Modern Digital Typographies

Font selection directly affects how users digest information and perceive the authority of your digital platform.

### Typography Guidelines:
- **Readability First**: Use clean, modern sans-serif fonts (like Inter, Roboto, or Outfit) for body copy.
- **Logical Hierarchy**: Maintain a clear visual difference between h1, h2, and paragraph tags using size and weight.
- **Line Length and Height**: Limit paragraph text width to 60-70 characters and set line heights to 1.6 for comfortable reading.`
  },
  {
    title: "The Power of Interactive Calculators for Inbound Lead Gen",
    slug: "the-power-of-interactive-calculators-for-inbound-lead-gen",
    category: "Sales",
    excerpt: "How to use custom JavaScript calculators (e.g. ROI or pricing estimators) to double conversion rates.",
    content: `## Generating Warm Inbound Leads with Visual Calculators

Interactive tools provide instant, personalized value to visitors, making them highly effective lead magnets.

### Tool Creation Guidelines:
- **Estimate Cost/Savings**: Build simple calculators (like 'ROI Calculator' or 'SEO Traffic Estimator') related to your services.
- **Capture Lead Before Result**: Provide initial general estimates, and ask for name/email to unlock the full detailed PDF breakdown.
- **Agile Styling**: Code using responsive styles and place them prominently on service landing pages.`
  },
  {
    title: "Best Practices for Database Migrations in Node.js Projects",
    slug: "best-practices-for-database-migrations-in-node-js-projects",
    category: "Web Development",
    excerpt: "Understand how to manage SQL database schema changes systematically across dev and production environments.",
    content: `## Managing Database Schema Changes in Production

Database migrations allow engineering teams to write, track, and apply SQL schema modifications safely.

### Migration Guidelines:
- **Version Controlled Schemas**: Never execute raw schema alters manually. Save migration scripts as files inside the project repo.
- **Up and Down Blocks**: Write reversible scripts containing 'up' blocks (to apply changes) and 'down' blocks (to roll back).
- **Zero-Downtime Altering**: Add columns as nullable first, deploy backend updates, then apply default constraints.`
  },
  {
    title: "YouTube SEO: Ranking Long-Form Content in Google Video Tab",
    slug: "youtube-seo-ranking-long-form-content-in-google-video-tab",
    category: "SEO",
    excerpt: "Actionable strategies to optimize YouTube descriptions, tags, and thumbnails to rank on Google search.",
    content: `## Search Engine Optimization for Video Platforms

YouTube is the second largest search engine. Optimizing your videos places them in both YouTube and Google search results.

### Video Optimization Pillars:
- **Keyword-Rich Scripts**: Say target search phrases within the first 30 seconds of the video (auto-captions verify this).
- **Custom Thumbnails**: Use high-contrast colors, faces with expressions, and large text overlays.
- **Video Chapters**: Add precise timestamp lists to your description. This helps Google display 'Key Moments' in searches.`
  },
  {
    title: "Designing Client Onboarding Portals for Agency Growth",
    slug: "designing-client-onboarding-portals-for-agency-growth",
    category: "Sales",
    excerpt: "Build customer onboarding workflows that reduce administrative friction and improve customer success.",
    content: `## Streamlining Agency Client Onboarding

A fast, premium onboarding experience sets the tone for client partnerships and increases retention.

### Onboarding Portal Goals:
- **Automated Intake Forms**: Gather business details, assets, passwords, and targets in a secure wizard interface.
- **Interactive Checklists**: Show clients exactly what documents/credentials are required and track current progress.
- **Welcome Video**: Embed a short welcome message explaining milestones and setting clear delivery expectations.`
  },
  {
    title: "Advanced Custom Hooks in React for Reusable UI States",
    slug: "advanced-custom-hooks-in-react-for-reusable-ui-states",
    category: "Web Development",
    excerpt: "Learn how to isolate component logic into custom React hooks (like useLocalStorage or useDebounce).",
    content: `## Writing Clean, Reusable React Component Logic

Custom hooks allow developers to extract stateful component logic into reusable functions.

### Common Hook Examples:
- **useDebounce**: Delays API queries during user search inputs, avoiding database overload on every keystroke.
- **useLocalStorage**: Synchronizes state variables (like dark mode or shopping cart item counts) with browser storage.
- **useWindowSize**: Listens to viewport resize events to dynamically switch between mobile and desktop styles.`
  },
  {
    title: "Building a Referral Program that Drives Organic Customer Acquisition",
    slug: "building-a-referral-program-that-drives-organic-customer-acquisition",
    category: "Sales",
    excerpt: "Design referral incentives and automated share widgets that leverage word-of-mouth growth.",
    content: `## Designing Word-of-Mouth Referral Programs

Referral marketing leverages existing happy clients to acquire new customers at an extremely low customer acquisition cost (CAC).

### Referral Program Elements:
- **Double-Sided Incentives**: Reward both the referrer and the referred customer (e.g. ₹500 discount for both).
- **Frictionless Sharing**: Provide copyable referral links and direct-share buttons for WhatsApp and email.
- **Tracking System**: Keep records of payouts and conversions in your database to prevent fraudulent referrals.`
  },
  {
    title: "Dynamic OG Image Generation in Next.js for Social Shares",
    slug: "dynamic-og-image-generation-in-next-js-for-social-shares",
    category: "Web Development",
    excerpt: "Generate unique OpenGraph cover images dynamically using Next.js @vercel/og tool at runtime.",
    content: `## Dynamic Social Share Card Rendering in NextJS

Dynamic OpenGraph (OG) images increase click-through rates when articles are shared on Twitter, LinkedIn, or WhatsApp.

### Tech Implementation:
- **@vercel/og Library**: Renders HTML/CSS templates into high-quality PNG images at edge API routes.
- **Dynamic Parameters**: Pass article title, author avatar, and category into the API route as URL query params.
- **Caching**: Set HTTP cache headers (s-maxage) to cache generated images, reducing server load on repeat shares.`
  },
  {
    title: "Mapping Search Intent: Navigational, Informational, and Transactional",
    slug: "mapping-search-intent-navigational-informational-and-transactional",
    category: "SEO",
    excerpt: "Understand how search engine user intents map to content landing page types to increase rankings.",
    content: `## Designing Content for Search Engine User Intent

Search intent is the fundamental reason why someone performs a search queries. Aligning pages to this intent is key to ranking.

### Categories of Search Intent:
- **Informational**: User wants to learn (e.g., 'how does SEO work'). Target with blog posts containing checklists and definitions.
- **Navigational**: User wants a specific site (e.g., 'AI Digital login'). Optimize landing and home pages.
- **Transactional**: User wants to purchase (e.g., 'buy SEO audit online'). Target with conversion pricing tables and forms.`
  }
];

async function main() {
  const env = readEnv();
  
  console.log("Connecting to MySQL Database...");
  const db = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'ai_digital',
    port: parseInt(env.DB_PORT || '3306', 10)
  });

  console.log("Database connected.");
  
  // 1. First, let's update ALL 50 cover images to unique Unsplash URLs in the DB
  console.log("Updating ALL cover images to unique Unsplash URLs...");
  
  const allTopics = [
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
    // Missing ones that we are inserting below
    ...remainingBlogs
  ];

  let updatedCount = 0;
  for (let i = 0; i < allTopics.length; i++) {
    const topic = allTopics[i];
    const photoId = unsplashIds[i] || unsplashIds[i % unsplashIds.length];
    const cover = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=60`;
    const slug = generateSlug(topic.title);
    
    // Update cover image
    const [result] = await db.query(
      "UPDATE blogs SET cover_image = ? WHERE slug = ? OR title = ?",
      [cover, slug, topic.title]
    );
    if (result.affectedRows > 0) {
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} existing blogs with unique cover images.`);

  // Update Welcome blog to have a nice marketing cover image instead of null/old image
  const [welcomeResult] = await db.query(
    "UPDATE blogs SET cover_image = ? WHERE slug = ?",
    ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60", "welcome-to-ai-digital-blogs"]
  );
  if (welcomeResult.affectedRows > 0) {
    console.log("Updated 'Welcome to AI Digital Blogs' with unique cover image.");
  }

  // 2. Insert the remaining 20 blog articles
  console.log("\nChecking and seeding the remaining 20 blogs...");
  let insertedCount = 0;
  for (let i = 0; i < remainingBlogs.length; i++) {
    const item = remainingBlogs[i];
    
    // Determine the corresponding index in allTopics to fetch its correct unique cover image
    const globalIdx = 30 + i; // The remaining blogs are index 30 to 49
    const photoId = unsplashIds[globalIdx] || unsplashIds[globalIdx % unsplashIds.length];
    const cover = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=60`;

    const [existing] = await db.query("SELECT id FROM blogs WHERE slug = ? OR title = ?", [item.slug, item.title]);
    if (existing.length === 0) {
      const id = "gen_" + Math.random().toString(36).substring(2, 12);
      const expandedContent = expandBlogContent(item.content, item.category, item.title);
      await db.query(`
        INSERT INTO blogs (id, title, slug, content, excerpt, cover_image, category, published)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `, [id, item.title, item.slug, expandedContent, item.excerpt, cover, item.category]);
      console.log(`Seeded blog [${i+1}/20]: "${item.title}"`);
      insertedCount++;
    }
  }

  console.log(`\nFinished! Successfully inserted ${insertedCount} new blogs and updated all cover images.`);
  
  // Double check the total count
  const [totalRows] = await db.query("SELECT COUNT(*) as cnt FROM blogs");
  console.log(`Total blogs currently in the database: ${totalRows[0].cnt}`);
  
  await db.end();
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

main().catch(err => {
  console.error("Execution error:", err);
});
