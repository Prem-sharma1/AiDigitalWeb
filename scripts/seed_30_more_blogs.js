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

// 30 Verified Working Unsplash IDs
const unsplashIds = [
  "photo-1551288049-bebda4e38f71", // 1. Site Hierarchy
  "photo-1557200134-90327ee9fafa", // 2. Email Deliverability
  "photo-1542831371-29b0f74f9713", // 3. React Context vs Redux
  "photo-1531403009284-440f080d1e12", // 4. Micro-Copy
  "photo-1460925895917-afdab827c52f", // 5. Meta Ads Creatives
  "photo-1504868584819-f8e8b4b6d7e3", // 6. SQL Joins Speed
  "photo-1551836022-d5d88e9218df", // 7. GA4 Attribution
  "photo-1508921912186-1d1a45ebb3c1", // 8. Brand Identity Kits
  "photo-1516321318423-f06f85e504b3", // 9. Google Maps Reviews
  "photo-1531297484001-80022131f5a1", // 10. Web Accessibility WCAG
  "photo-1556742049-0cfed4f6a45d", // 11. Dynamic Fields Validation
  "photo-1556740738-b6a63e27c4df", // 12. Checkout Page CRO
  "photo-1522071820081-009f0129c71c", // 13. WebSockets Chat
  "photo-1531538606174-0f90ff5dce83", // 14. Modern Typography Mix
  "photo-1486312338219-ce68d2c6f44d", // 15. Entity-Based SEO
  "photo-1611162617213-7d7a39e9b1d7", // 16. Landing Page Explainer Videos
  "photo-1551434678-e076c223a692", // 17. Gamification in Sales
  "photo-1454165804606-c3d57bc86b40", // 18. GTM Server-Side Tracking
  "photo-1519389950473-47ba0277781c", // 19. Next.js Dynamic ISR
  "photo-1555066931-4365d14bab8c", // 20. Designing Dark Mode
  "photo-1517694712202-14dd9538aa97", // 21. Customer Journey Touchpoints
  "photo-1579621970563-ebec7560ff3e", // 22. CORS CORS Preflight
  "photo-1556155092-490a1ba16284", // 23. Schema Markup Rich Snippets
  "photo-1507238691740-187a5b1d37b8", // 24. LinkedIn Cold Outreach
  "photo-1581291518633-83b4ebd1d83e", // 25. High-ROAS Google Ads
  "photo-1552664730-d307ca884978", // 26. React Hook Form & Yup
  "photo-1511512578047-dfb367046420", // 27. Speed & Quality Score
  "photo-1457369804613-52c61a468e7d", // 28. Visual Stock Photos
  "photo-1496096265110-f83ad7f96608", // 29. Exit-Intent Surveys
  "photo-1526374965328-7f61d4dc18c5"  // 30. Dynamic Rendering SSG vs SSR
];

const newBlogs = [
  {
    title: "The Role of Site Hierarchy in Information Architecture and SEO",
    slug: "the-role-of-site-hierarchy-in-information-architecture-and-seo",
    category: "SEO",
    excerpt: "Understand how structuring your web pages logically helps search engine crawlers index your content.",
    content: `## Structuring Site Hierarchy for SEO Crawlability

Information Architecture (IA) defines how content is grouped and linked together on a website. A clean hierarchy improves indexing and UX.

### Key Hierarchy Concepts:
- **Pyramid Structure**: Flow link authority from the homepage to categories, then down to individual subtopics.
- **Three-Click Rule**: Users and search bots should be able to reach any page on your website within three clicks.
- **Internal Anchor Links**: Link related sub-articles together to distribute ranking power and guide navigation.`
  },
  {
    title: "Email Deliverability Checklist: Avoiding SPAM Filters in Cold Sales",
    slug: "email-deliverability-checklist-avoiding-spam-filters-in-cold-sales",
    category: "Sales",
    excerpt: "Ensure your sales campaigns land in the inbox by setting up DKIM, SPF, and DMARC records.",
    content: `## Landing in the Inbox: Cold Email Deliverability

Cold outreach requires high technical setup to avoid email domains getting flagged by spam filters.

### Deliverability Checklist:
- **SPF and DKIM Verification**: Verify server sending permissions by setting up TXT records in your DNS dashboard.
- **DMARC Configuration**: Enforce policies to prevent domain spoofing and monitor deliverability reports.
- **Domain Warmup**: Gradually increase daily send limits over 30 days to build sender reputation.`
  },
  {
    title: "Mastering React Context API vs. Redux for State Management",
    slug: "mastering-react-context-api-vs-redux-for-state-management",
    category: "Web Development",
    excerpt: "A comparison of state management options in React, explaining when to use Context or Redux.",
    content: `## Choosing State Tools: Context API vs. Redux

Managing global variables across nested React components can become complex as applications scale.

### Comparison Guidelines:
- **React Context**: Best for low-frequency updates like UI themes, language preferences, or shopping cart item lists.
- **Redux / Toolkit**: Ideal for high-frequency state updates, dashboard actions, and massive enterprise datasets.
- **Performance**: Context API triggers re-renders on all consumers, while Redux optimizes updates dynamically.`
  },
  {
    title: "Why Micro-Copy is Your Branding's Hidden Conversion Weapon",
    slug: "why-micro-copy-is-your-brandings-hidden-conversion-weapon",
    category: "Branding",
    excerpt: "Learn how small textual snippets (micro-copy) in buttons and tooltips improve brand loyalty.",
    content: `## The Power of Tiny Words in Digital UI Design

Micro-copy refers to the small labels, buttons, tooltips, error warnings, and helper texts across a digital interface.

### Crafting Micro-Copy:
- **Humanize Error Messages**: Instead of 'Invalid Input', write 'Oops! That password looks a bit short. Let's try again!'.
- **Reduce Form Anxiety**: Place helpful hints under fields, like 'We will never share your email. No spam, ever.'
- **Action-Oriented CTAs**: Replace generic 'Submit' buttons with descriptive terms like 'Claim My Free Audit Now'.`
  },
  {
    title: "A Guide to Retexturing Creatives in Meta Ads for Better CTR",
    slug: "a-guide-to-retexturing-creatives-in-meta-ads-for-better-ctr",
    category: "Performance Marketing",
    excerpt: "How to swap overlays, color tones, and text hooks on existing ad creatives to beat ad fatigue.",
    content: `## Combating Ad Fatigue with Creative Retexturing

Ad fatigue occurs when target audiences see the same advertisement repeatedly, leading to decreased click-through rates (CTR).

### Retexturing Workflow:
- **Text Hook Swaps**: Keep the video footage but modify the first 3 seconds with contrasting text overlays.
- **Color Variations**: Alternate between sleek dark modes and warm vibrant gradients to capture scrolling attention.
- **Layout Tweaks**: Rotate structural elements or adjust cropping to make old visual assets feel fresh.`
  },
  {
    title: "How to Optimize SQL Joins for Faster Web App Loading",
    slug: "how-to-optimize-sql-joins-for-faster-web-app-loading",
    category: "Web Development",
    excerpt: "A guide to understanding INNER JOIN, LEFT JOIN, and optimization practices in MySQL queries.",
    content: `## Speeding Up Relational Database Queries

Relational database JOIN operations can become major performance bottlenecks if queries are poorly structured.

### Join Optimization Rules:
- **Indexing Foreign Keys**: Ensure all columns used in JOIN conditions (like ON a.id = b.user_id) are indexed.
- **Avoid SELECT *:** Retrieve only the specific columns needed by the frontend, reducing memory transfer overhead.
- **INNER JOIN vs LEFT JOIN**: Use INNER JOIN when records must exist in both tables; it executes faster than LEFT JOIN.`
  },
  {
    title: "Designing Multi-Channel Attribution Models in GA4",
    slug: "designing-multi-channel-attribution-models-in-ga4",
    category: "Performance Marketing",
    excerpt: "Learn how to attribute conversion sales correctly across organic, paid search, and social channels in GA4.",
    content: `## Attribution Modeling in Google Analytics 4

Attribution modeling defines how conversion credit is distributed among touchpoints along a buyer's conversion path.

### Attribution Systems:
- **Data-Driven Attribution**: GA4's default model uses machine learning to assign conversion credit dynamically.
- **Last Click vs First Click**: Understanding whether campaigns are initiating discovery or closing transactional leads.
- **Channel Optimization**: Analyze reports to see which channels assist conversions, preventing wrong budget cuts.`
  },
  {
    title: "Creating Brand Identity Kits that Win Customer Loyalty",
    slug: "creating-brand-identity-kits-that-win-customer-loyalty",
    category: "Branding",
    excerpt: "Develop style guidelines including custom typography, brand assets, and tone manuals.",
    content: `## Building Cohesive Brand Style Identity Guidelines

A brand identity kit ensures visual consistency across every single webpage, graphic, and social media post.

### Brand Kit Essentials:
- **Color Codes**: Define Primary, Secondary, and Accent colors in HEX, RGB, and HSL formats.
- **Font Rules**: Select a strong modern display font for headings and highly readable fonts for paragraphs.
- **Tone Guide**: Document how the brand communicates—approachability rules, professional boundaries, and key phrases.`
  },
  {
    title: "Leveraging Google Maps Business Reviews for Local Lead Gen",
    slug: "leveraging-google-maps-business-reviews-for-local-lead-gen",
    category: "SEO",
    excerpt: "How reviews, keywords in responses, and review scores boost local SEO map pack listings.",
    content: `## Ranking Local Businesses with Map Pack Reviews

Customer reviews on your Google Business Profile (GBP) are a primary local SEO search engine ranking factor.

### Review Strategies:
- **Keyword Responses**: Respond to reviews using natural city name and service keywords (e.g. 'glad to provide SEO in Delhi').
- **Easy Link Sharing**: Generate a short GBP review link and share it automatically in client closing emails.
- **Freshness Matters**: Acquire reviews consistently over time; a steady stream ranks higher than a sudden batch.`
  },
  {
    title: "Building Accessible Web Apps: An Introduction to WCAG Guidelines",
    slug: "building-accessible-web-apps-an-introduction-to-wcag-guidelines",
    category: "Web Development",
    excerpt: "Implement accessibility standards including semantic HTML, ARIA tags, and keyboard focus outlines.",
    content: `## Accessibility Engineering: Coding for Everyone

Web accessibility ensuring that websites are usable by people with visual, motor, or cognitive disabilities.

### WCAG Implementation Checklist:
- **Semantic HTML**: Use native button, header, and input elements instead of custom divs to support screen readers.
- **Color Contrast**: Verify text-to-background contrast ratios are at least 4.5:1 for standard readable text.
- **Keyboard Navigation**: Ensure all interactive elements have visible focus indicators and are fully keyboard-navigable.`
  },
  {
    title: "Form Fields Optimization: Dynamic Field Validation with React",
    slug: "form-fields-optimization-dynamic-field-validation-with-react",
    category: "Sales",
    excerpt: "How to use real-time inline validation in input forms to boost signup and checkout success.",
    content: `## Inline Form Validation for Higher Registrations

Validating form fields only *after* a user clicks submit causes friction. Dynamic real-time validation is the best practice.

### Form Validation Practices:
- **Instant inline Error Messages**: Display clear helper texts immediately when an input fails validation criteria.
- **Dynamic CSS Styling**: Switch borders to green for valid entries and subtle red for error inputs.
- **Debounced Validation**: Avoid checking formatting on every keystroke; wait until the user pauses typing.`
  },
  {
    title: "A Guide to E-commerce Checkout Page CRO Optimization",
    slug: "a-guide-to-e-commerce-checkout-page-cro-optimization",
    category: "Sales",
    excerpt: "Design checkout pages that eliminate buying hesitation, cart abandonment, and steps friction.",
    content: `## Reducing E-commerce Cart Abandonment at Checkout

The checkout page is the ultimate conversion step. Eliminating buying friction directly increases transactional profit.

### Checkout Page CRO Rules:
- **Guest Checkout Option**: Never force users to create accounts before completing payments.
- **Trust Elements**: Display security badges, clear return policies, and shipping guarantees near the payment form.
- **Progress Tracking**: Show visual checkout steps (e.g. Shipping > Payment > Confirmation) so the path is clear.`
  },
  {
    title: "Understanding WebSockets: Building Real-time Chat in Node.js",
    slug: "understanding-websockets-building-real-time-chat-in-node-js",
    category: "Web Development",
    excerpt: "Code bi-directional server connection channels using WebSockets (socket.io) for real-time web features.",
    content: `## Bi-directional Network Connections in Node.js

Unlike HTTP requests which are one-way, WebSockets maintain an active, full-duplex connection between client and server.

### Socket Implementation:
- **Connection Handshake**: Client initiates socket request; server upgrades connection from HTTP to WebSocket.
- **Real-Time Messaging**: Broadcast events instantly (like new message triggers, typing indicators, notifications).
- **Socket.io Library**: Standard library containing automatic connection fallbacks and channel grouping (rooms).`
  },
  {
    title: "Modern Typography: Combining Display Serif Fonts with Clean Sans-Serifs",
    slug: "modern-typography-combining-display-serif-fonts-with-clean-sans-serifs",
    category: "Branding",
    excerpt: "Learn how pairing classic serif headings with clean sans-serif bodies creates premium UI vibes.",
    content: `## Art of Pairings: Modern Font Matchings

Pairing fonts correctly establishes a website's tone. Combining classy display serif headings with sans-serif bodies is highly popular.

### Typography Selection:
- **Display Serif Headings**: Fonts like Playfair Display or Outfit add sophistication, character, and visual hierarchy.
- **Sans-Serif Bodies**: Simple fonts (like Inter or Roboto) ensure fast reading, clean alignment, and consistent scaling.
- **Spacing Guidelines**: Increase letter-spacing slightly for uppercase subheaders, and keep line-heights balanced.`
  },
  {
    title: "Scaling SEO Traffic with Entity-Based Optimization",
    slug: "scaling-seo-traffic-with-entity-based-optimization",
    category: "SEO",
    excerpt: "Move beyond plain keyword stuffing and learn how to optimize topics using semantic entities in search.",
    content: `## Moving Beyond Keywords: Entity SEO

Modern search engines analyze topics using semantic relationships between entities (concepts, places, names), rather than plain strings.

### Entity Optimization:
- **Build Topic Clusters**: Cover all surrounding questions and concepts related to a parent topic.
- **Structured Schema Markup**: Express entity relationships clearly using JSON-LD metadata for search crawlers.
- **Relevant Connections**: Link your articles to authoritative resources and mention defining terms naturally.`
  },
  {
    title: "Creating High-Impact Landing Page Explainer Videos",
    slug: "creating-high-impact-landing-page-explainer-videos",
    category: "Social Media",
    excerpt: "How to use concise explainer videos above the fold on service landing pages to boost sales.",
    content: `## Video Production for Landing Page Conversion

An explainer video above the fold can increase landing page conversions by conveying your service value proposition in 90 seconds.

### Explainer Video Structure:
- **The Hook (First 10s)**: Immediately frame the primary pain point your service resolves.
- **Explain the Process**: Show a clear 3-step visualization of how your service/software works.
- **Show Proof**: Include quick visual slides of client success statistics, dashboard reviews, or testimonials.`
  },
  {
    title: "The Power of Gamification in Sales Funnels",
    slug: "the-power-of-gamification-in-sales-funnels",
    category: "Sales",
    excerpt: "Use interactive games, quizzes, and rewards triggers to guide users towards making purchases.",
    content: `## Increasing Conversion Funnel Engagement with Gamification

Gamification integrates game mechanics (like points, unlockable badges, or fortune wheels) into sales pipelines.

### Practical Funnel Games:
- **Discount Fortune Wheels**: Let users spin a digital wheel on exit-intent to unlock discounts (saves lost sales).
- **Interactive Quizzes**: Lead users through a personalized questionnaire and offer recommendations based on responses.
- **Unlocked Milestones**: Offer free shipping or badges when cart values cross specific thresholds (encourages upsell).`
  },
  {
    title: "Setting Up Server-Side Tracking for Meta Pixel & Google Tag Manager",
    slug: "setting-up-server-side-tracking-for-meta-pixel-&-google-tag-manager",
    category: "Performance Marketing",
    excerpt: "How server-side tracking bypasses browser ad-blockers to record accurate event conversions.",
    content: `## Server-Side Analytics Tracking Setup

Traditional browser tracking is becoming unreliable due to ad-blockers, tracking restrictions, and cookie policies.

### Server Tracking Workflow:
- **Conversion API (CAPI)**: Post payment and lead events directly from your Next.js server to Meta/Google servers.
- **Server GTM Container**: Run Google Tag Manager on a cloud server to intercept and distribute tracking data.
- **Accurate Attribution**: Ensure conversion event deduplication to prevent double-counting analytics.`
  },
  {
    title: "Optimizing Next.js for Dynamic Rendering and Incremental Static Regeneration (ISR)",
    slug: "optimizing-next-js-for-dynamic-rendering-and-incremental-static-regeneration-isr",
    category: "Web Development",
    excerpt: "Implement Next.js static generation caching alongside real-time data updates using ISR config.",
    content: `## Caching Dynamic Pages with Next.js ISR

Incremental Static Regeneration (ISR) lets you update static pages on your live Next.js application without rebuilding the site.

### Coding ISR:
- **Revalidate Tag**: Specify a revalidate time interval inside your fetching route (e.g. export const revalidate = 3600).
- **Static Generation**: Next.js serves the cached static page instantly, while rebuilding the page in the background.
- **Scale Traffic**: Reduces database overhead to zero for popular articles, while maintaining updated content.`
  },
  {
    title: "Designing Dark Mode UI/UX: Accessibility and Aesthetic Rules",
    slug: "designing-dark-mode-ui-ux-accessibility-and-aesthetic-rules",
    category: "Branding",
    excerpt: "Best practices for selecting color palettes, text contrast, and graphic assets for dark mode.",
    content: `## Art of Designing Premium Dark Mode Interfaces

Dark mode interfaces reduce eye strain in low-light environments and offer a premium, modern aesthetic.

### Dark Mode Design Rules:
- **Never Use Pure Black**: Use deep grey/blue colors (like #0B0F19) for page backgrounds; it reduces harsh contrast.
- **Muted Typography Tones**: Avoid pure white (#FFF) text. Select off-white (like #E2E8F0) to ensure readability.
- **Theme-Scoped Assets**: Swap harsh bright graphics or line illustrations with customized dark-themed assets.`
  },
  {
    title: "Mapping Customer Journey Touchpoints to Increase Sales Velocity",
    slug: "mapping-customer-journey-touchpoints-to-increase-sales-velocity",
    category: "Sales",
    excerpt: "Analyze buyer touchpoints from initial ad click to checkout to identify funnel drop-offs.",
    content: `## Optimizing the Digital Customer Buying Journey

A customer journey map visualizes every interaction a buyer has with your brand before purchasing.

### Touchpoint Optimization Steps:
- **Discovery Channel Audit**: Check metrics of traffic sources (ads, search, social) to identify highest-converting paths.
- **Educational Nurturing**: Deliver matching content (case studies, definitions) depending on buyer funnel stage.
- **Friction Reduction**: Eliminate redirects and optimize loading speeds on the final checkout steps.`
  },
  {
    title: "Understanding CORS and Preflight Requests in Express & Node",
    slug: "understanding-cors-and-preflight-requests-in-express-&-node",
    category: "Web Development",
    excerpt: "A guide to Cross-Origin Resource Sharing (CORS) headers, options, and server configurations.",
    content: `## Handling Origin Security in Node.js Endpoints

CORS is a browser security mechanism that restricts web applications from making queries to a different domain.

### CORS Setup Guidelines:
- **Preflight Options**: Browsers send an initial HTTP OPTIONS preflight request before executing complex API queries.
- **Access-Control-Allow-Origin**: Set headers explicitly to trust only authorized partner domains.
- **Credentials and Cookie Sharing**: Enable credentials settings when sharing session cookies across subdomains.`
  },
  {
    title: "A Comprehensive Guide to Schema Markup for Rich Search Snippets",
    slug: "a-comprehensive-guide-to-schema-markup-for-rich-search-snippets",
    category: "SEO",
    excerpt: "How to write structured JSON-LD schema (FAQ, Product, Article) to win rich elements in search results.",
    content: `## Rich Snippets Schema Markup Integration

Schema markup is code that you place on your website to help search engines return informative results for users.

### Schema Integrations:
- **JSON-LD Script Format**: Embed structured scripts containing schema definitions directly in page headers.
- **Article Schema**: Tag blog title, author metadata, publication dates, and cover image URLs.
- **FAQ Schema**: Define matching questions and answers to win visual FAQ drop-downs in search results.`
  },
  {
    title: "How to Pitch Services in cold LinkedIn Messages Successfully",
    slug: "how-to-pitch-services-in-cold-linkedin-messages-successfully",
    category: "Sales",
    excerpt: "Discover copywriting templates and networking rules to acquire high-ticket clients on LinkedIn.",
    content: `## B2B Sales Outreach via LinkedIn Messaging

Cold pitching on social professional networks requires personalized, value-first messaging to build interest.

### Outreach Rules:
- **Personalize Connection Request**: Reference specific posts, articles, or shared mutual connections in 150 characters.
- **Deliver Value First**: Offer free audits, checklists, or industry insights instead of pitching immediate calls.
- **Keep it Short**: Frame follow-up messages in 2-3 sentences max. Focus on addressing a specific business pain point.`
  },
  {
    title: "Creating High-ROAS Search Campaigns on Google Ads",
    slug: "creating-high-roas-search-campaigns-on-google-ads",
    category: "Performance Marketing",
    excerpt: "Master keyword match types, negative lists, and bidding strategies to maximize Google Ads returns.",
    content: `## Maximizing Google Ads Conversion Returns

Google Search Ads capture customers at the exact moment they are looking for your digital services.

### High-ROAS Setup Blueprint:
- **Keyword Match Types**: Use phrase match and exact match targeting to avoid spending budget on generic search phrases.
- **Negative Keyword Lists**: Proactively compile lists of words (like 'free', 'jobs') to prevent triggering impressions.
- **Smart Bidding**: Leverage Maximize Conversions or Target CPA automatic bidding once tracking tags verify data.`
  },
  {
    title: "Handling Complex Forms in React with React Hook Form & Yup",
    slug: "handling-complex-forms-in-react-with-react-hook-form-&-yup",
    category: "Web Development",
    excerpt: "Implement high-performance multi-step React forms utilizing schema-based schema validation libraries.",
    content: `## Form State Management with React Hook Form

Handling massive, complex data inputs in React components can trigger excessive re-renders and slow performance.

### Form Libraries Setup:
- **React Hook Form**: Keeps inputs uncontrolled, ensuring component renders only occur when validation state changes.
- **Yup Schema Validation**: Define validation schemas (required fields, emails, matches) outside the component.
- **Multi-Step State Flow**: Save inputs to a parent context object or global state on each step transition.`
  },
  {
    title: "The Influence of Page Loading Speed on Google Quality Score",
    slug: "the-influence-of-page-loading-speed-on-google-quality-score",
    category: "SEO",
    excerpt: "Understand how website loading performance directly impacts Google Ads CPC and auction rankings.",
    content: `## Ad Optimization: Page Speed & Quality Scores

Google Ads uses Quality Score to measure the relevance of your keywords, ad copies, and landing page experiences.

### Auction Performance Rules:
- **Landing Page Experience**: Google algorithms crawl landing pages. Fast pages earn higher Quality Scores.
- **Lower Cost-Per-Click**: Higher Quality Scores decrease the bid amount required to place ads in top positions.
- **CRO Integration**: Fast pages reduce bounce rates, ensuring clicks turn into successful sales leads.`
  },
  {
    title: "Visual Storytelling: Integrating Curated Stock Photos Effectively",
    slug: "visual-storytelling-integrating-curated-stock-photos-effectively",
    category: "Branding",
    excerpt: "How to use, crop, and filter stock photography to match a premium visual brand language.",
    content: `## Premium Visual Aesthetics with Stock Media

Images set the visual tone of your web pages. Avoid generic corporate stock photos and focus on authentic-looking media.

### Visual Curation Rules:
- **Curated Palettes**: Choose photos containing colors that match your brand design token colors.
- **Dynamic Overlays**: Apply brand color gradients or dark overlays to photos to ensure text stays readable.
- **Clean Sourcing**: Utilize high-quality collections from platforms like Unsplash and crop them to focus on active elements.`
  },
  {
    title: "Designing Exit-Intent Surveys to Capture B2B Lead Loss Reasons",
    slug: "designing-exit-intent-surveys-to-capture-b2b-lead-loss-reasons",
    category: "Sales",
    excerpt: "Use exit-intent overlays to ask users why they are leaving, gathering critical conversion audit data.",
    content: `## Capturing Customer Loss Insights with Exit Surveys

Exit-intent surveys trigger when a user's cursor moves outside the active browser window, indicating they are leaving.

### Survey Best Practices:
- **Keep it to 1 Question**: Ask a single multiple-choice question, e.g. 'Why did you choose not to purchase today?'.
- **Simple Options**: Provide clear options (Pricing, Lack of details, Just researching) and a short write-in box.
- **Doubt Resolution**: Dynamically show a matching helpful link or discount coupon based on their selected answer.`
  },
  {
    title: "Static Site Generation (SSG) vs. SSR: When to Use Which",
    slug: "static-site-generation-ssg-vs-ssr-when-to-use-which",
    category: "Web Development",
    excerpt: "Analyze build-time page generation versus server-time rendering, selecting the best strategy for speed.",
    content: `## Rendering Architecture Decisions: SSG vs. SSR

Modern JavaScript frameworks (like Next.js) support both pre-rendering strategies on a page-by-page basis.

### Deciding Factors:
- **Static Site Generation (SSG)**: Pre-renders pages at build time. Best for static landing pages, portfolios, and blogs.
- **Server-Side Rendering (SSR)**: Generates HTML on the fly on each user request. Best for user dashboards or checkout pages.
- **Hybrid Performance**: Combine SSG for speed and search indexing, with CSR (client fetch) for personalized user states.`
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

  console.log("Database connected. Starting seeding of 30 additional blogs...");

  let insertedCount = 0;
  for (let i = 0; i < newBlogs.length; i++) {
    const item = newBlogs[i];
    
    // Determine the cover image
    const photoId = unsplashIds[i] || unsplashIds[i % unsplashIds.length];
    const cover = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=60`;

    // Check duplicate
    const [existing] = await db.query("SELECT id FROM blogs WHERE slug = ? OR title = ?", [item.slug, item.title]);
    if (existing.length === 0) {
      const id = "gen30_" + Math.random().toString(36).substring(2, 12);
      const expandedContent = expandBlogContent(item.content, item.category, item.title);
      await db.query(`
        INSERT INTO blogs (id, title, slug, content, excerpt, cover_image, category, published)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `, [id, item.title, item.slug, expandedContent, item.excerpt, cover, item.category]);
      console.log(`Seeded blog [${i+1}/30]: "${item.title}"`);
      insertedCount++;
    } else {
      // Update existing to use the new cover image
      await db.query(
        "UPDATE blogs SET cover_image = ? WHERE slug = ? OR title = ?",
        [cover, item.slug, item.title]
      );
    }
  }

  // Double check total count
  const [totalRows] = await db.query("SELECT COUNT(*) as cnt FROM blogs");
  console.log(`\nFinished! Successfully inserted ${insertedCount} new blogs.`);
  console.log(`Total blogs currently in the database: ${totalRows[0].cnt}`);
  
  await db.end();
}

main().catch(err => {
  console.error("Execution error:", err);
});
