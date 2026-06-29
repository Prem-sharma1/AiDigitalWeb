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

async function testUrls() {
  console.log("Testing Unsplash URLs...");
  let failed = 0;
  for (let i = 0; i < unsplashIds.length; i++) {
    const id = unsplashIds[i];
    const url = `https://images.unsplash.com/${id}?w=100&auto=format&fit=crop&q=10`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) {
        console.log(`[${i+1}] FAILED: ${id} (Status ${res.status})`);
        failed++;
      }
    } catch (err) {
      console.log(`[${i+1}] ERROR: ${id} (${err.message})`);
      failed++;
    }
  }
  console.log(`Finished. Total tested: ${unsplashIds.length}, Failed: ${failed}`);
}

testUrls();
