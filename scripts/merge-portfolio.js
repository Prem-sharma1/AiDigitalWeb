const fs = require("fs");
const path = require("path");

function main() {
  console.log("🔄 Starting portfolio merge process...");

  const jsonPath = path.join(__dirname, "..", "data", "portfolioData.json");
  const sqlPath = path.join(__dirname, "..", "database.sql");

  if (!fs.existsSync(jsonPath)) {
    console.error("❌ Error: portfolioData.json not found at " + jsonPath);
    return;
  }
  if (!fs.existsSync(sqlPath)) {
    console.error("❌ Error: database.sql not found at " + sqlPath);
    return;
  }

  // 1. Read files
  const portfolioData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  // 2. Parse SQL lines to extract portfolio_items
  const lines = sqlContent.split("\n");
  const sqlCreativeItems = [];

  console.log("Parsing database.sql for creative items...");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("('") || !trimmed.includes("'creative'")) {
      continue;
    }

    const values = [];
    let currentVal = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      if ((char === "'" || char === "`") && trimmed[i - 1] !== "\\") {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
        }
      } else if (char === "," && !inQuotes) {
        values.push(currentVal.trim());
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim());

    const cleanValues = values.map((val) => {
      let cleaned = val.replace(/^\(|\);?$/g, "").trim();
      if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
        cleaned = cleaned.slice(1, -1);
      }
      if (cleaned === "NULL") return null;
      return cleaned;
    });

    if (cleanValues.length >= 14) {
      sqlCreativeItems.push({
        id: cleanValues[0],
        section: cleanValues[1],
        title: cleanValues[2],
        category: cleanValues[3],
        industry: cleanValues[4],
        metric: cleanValues[5],
        metricLabel: cleanValues[6],
        description: cleanValues[7],
        tags: cleanValues[8],
        accent: cleanValues[9],
        icon: cleanValues[10],
        src: cleanValues[11],
        type: cleanValues[12],
        globalIndex: cleanValues[13] ? parseInt(cleanValues[13], 10) : null,
      });
    }
  }

  console.log(`Found ${sqlCreativeItems.length} creative items in database.sql.`);

  const normalizeIndustry = (name) => {
    if (!name) return "Other Projects";
    if (name === "Hospitality") return "Hospitality & Food";
    return name;
  };

  let updatedCount = 0;
  let addedCount = 0;

  for (const sqlItem of sqlCreativeItems) {
    const targetIndustryName = normalizeIndustry(sqlItem.industry);
    
    let jsonGroup = portfolioData.creativeGroups.find(
      (g) => normalizeIndustry(g.industry) === targetIndustryName
    );

    if (!jsonGroup) {
      jsonGroup = {
        industry: targetIndustryName,
        description: "Creative assets for " + targetIndustryName,
        images: [],
      };
      portfolioData.creativeGroups.push(jsonGroup);
    }

    const normalizedSqlTitle = sqlItem.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    let jsonItem = jsonGroup.images.find((img) => {
      const normalizedJsonTitle = img.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        normalizedJsonTitle === normalizedSqlTitle ||
        (img.src && sqlItem.src && img.src.split("/").pop().split(".")[0] === sqlItem.src.split("/").pop().split(".")[0])
      );
    });

    if (jsonItem) {
      jsonItem.src = sqlItem.src || jsonItem.src;
      jsonItem.type = sqlItem.type || jsonItem.type;
      if (sqlItem.globalIndex !== null) jsonItem.globalIndex = sqlItem.globalIndex;
      if (sqlItem.description) jsonItem.description = sqlItem.description;
      updatedCount++;
    } else {
      jsonGroup.images.push({
        src: sqlItem.src,
        title: sqlItem.title,
        description: sqlItem.description || "",
        globalIndex: sqlItem.globalIndex !== null ? sqlItem.globalIndex : undefined,
        type: sqlItem.type || "image",
      });
      addedCount++;
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(portfolioData, null, 2), "utf-8");
  console.log(`\n🎉 Merge Completed successfully!`);
  console.log(`- Updated ${updatedCount} items in portfolioData.json`);
  console.log(`- Added ${addedCount} new items to portfolioData.json`);
  console.log(`\n👉 Next step: Run 'node scripts/sync-portfolio-to-db.js' to update your MySQL database!`);
}

main();
