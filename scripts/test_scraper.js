async function scrapeUnsplash() {
  console.log("Scraping Unsplash search pages...");
  const categories = ["digital-marketing", "web-development", "sales-business"];
  const photoUrls = new Set();
  
  for (const cat of categories) {
    try {
      console.log(`Fetching category: ${cat}...`);
      const res = await fetch(`https://unsplash.com/s/photos/${cat}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!res.ok) {
        console.error(`Failed to fetch category ${cat}: Status ${res.status}`);
        continue;
      }
      const html = await res.text();
      // Look for images.unsplash.com/photo-XXXXX links
      const regex = /https:\/\/images\.unsplash\.com\/(photo-[a-zA-Z0-9\-]+)/g;
      let match;
      while ((match = regex.exec(html)) !== null) {
        const photoId = match[1];
        // Clean up suffix if any (some might have query params attached in raw matches)
        const cleanId = photoId.split('?')[0];
        // Filter out tiny thumbnail IDs if they are not standard length
        if (cleanId.length > 20) {
          photoUrls.add(cleanId);
        }
      }
    } catch (err) {
      console.error(`Error fetching category ${cat}:`, err.message);
    }
  }

  console.log(`Found ${photoUrls.size} unique Unsplash photo IDs:`);
  const list = Array.from(photoUrls);
  list.slice(0, 10).forEach(id => console.log(` - ${id}`));
  
  // Test if they are valid
  if (list.length > 0) {
    const testId = list[0];
    const testUrl = `https://images.unsplash.com/${testId}?w=200&auto=format&fit=crop`;
    const check = await fetch(testUrl, { method: "HEAD" });
    console.log(`Testing first ID "${testId}": Status ${check.status} (${check.ok ? 'VALID' : 'INVALID'})`);
  }
}

scrapeUnsplash();
