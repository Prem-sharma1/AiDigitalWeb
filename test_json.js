const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('./data/pricingData.json', 'utf8'));
  console.log("JSON parsed successfully.");
  console.log("facebookPlans length:", data.facebookPlans.length);
  console.log(data.facebookPlans.map(p => p.level));
} catch (e) {
  console.error("JSON parse error:", e);
}
