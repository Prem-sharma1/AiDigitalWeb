const fs = require("fs");
const path = require("path");

const nextDir = path.join(__dirname, "..", ".next");

console.log("🧹 Clearing Next.js build cache folder...");

if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log("✅ Success: The local .next build folder has been deleted.");
  } catch (err) {
    console.error("❌ Error: Failed to delete .next folder:", err.message);
    console.log("👉 Suggestion: Make sure your Next.js server is stopped before running this script.");
  }
} else {
  console.log("ℹ️  The .next folder does not exist or has already been cleared.");
}
