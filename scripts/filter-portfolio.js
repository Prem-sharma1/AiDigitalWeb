const fs = require("fs");
const path = require("path");

function main() {
  const jsonPath = path.join(__dirname, "..", "data", "portfolioData.json");

  if (!fs.existsSync(jsonPath)) {
    console.error("❌ Error: portfolioData.json not found at " + jsonPath);
    return;
  }

  console.log("🧹 Filtering portfolioData.json...");
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // 1. Keep only "AI Videos" and "Reels" in showcaseProjects
  const originalShowcaseCount = data.showcaseProjects ? data.showcaseProjects.length : 0;
  data.showcaseProjects = (data.showcaseProjects || []).filter((item) => {
    return item.category === "AI Videos" || item.category === "Reels";
  });
  console.log(`- Showcase Projects: reduced from ${originalShowcaseCount} to ${data.showcaseProjects.length}`);

  // 2. Keep only "AI Videos" and "Reels" projects inside industries
  const originalIndustriesCount = data.industries ? data.industries.length : 0;
  data.industries = (data.industries || [])
    .map((ind) => {
      const originalProjCount = ind.projects ? ind.projects.length : 0;
      ind.projects = (ind.projects || []).filter((proj) => {
        return proj.type === "AI Videos" || proj.type === "Reels";
      });
      return ind;
    })
    .filter((ind) => ind.projects.length > 0);
  console.log(`- Industries: filtered projects (kept ${data.industries.length} active industries)`);

  // 3. Keep only "AI Videos" and "Reels" in otherProjects
  const originalOtherCount = data.otherProjects ? data.otherProjects.length : 0;
  data.otherProjects = (data.otherProjects || []).filter((proj) => {
    return proj.type === "AI Videos" || proj.type === "Reels";
  });
  console.log(`- Other Projects: reduced from ${originalOtherCount} to ${data.otherProjects.length}`);

  // 4. Keep only video type media items in creativeGroups (video, youtube, instagram, reel)
  let totalOriginalMedia = 0;
  let totalNewMedia = 0;

  data.creativeGroups = (data.creativeGroups || [])
    .map((grp) => {
      const originalMediaCount = grp.images ? grp.images.length : 0;
      totalOriginalMedia += originalMediaCount;

      grp.images = (grp.images || []).filter((img) => {
        const type = img.type ? img.type.toLowerCase() : "";
        return type === "video" || type === "youtube" || type === "instagram" || type === "reel";
      });

      totalNewMedia += grp.images.length;
      return grp;
    })
    .filter((grp) => grp.images.length > 0);
  
  console.log(`- Creative Media Items: reduced from ${totalOriginalMedia} to ${totalNewMedia}`);

  // 5. Save the filtered JSON
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
  console.log("✅ Success: portfolioData.json filtered successfully.");
  console.log("\n👉 Next step: Run 'node scripts/sync-portfolio-to-db.js' to push these changes to your database!");
}

main();
