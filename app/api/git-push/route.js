import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("🚀 Starting Git Push via API...");
    
    // 1. Git Status & Add
    const statusOut = execSync("git status", { encoding: "utf-8" });
    const diffOut = execSync("git diff", { encoding: "utf-8" });
    const addOut = execSync("git add -A", { encoding: "utf-8" });

    // 2. Git Commit
    let commitOut = "";
    try {
      commitOut = execSync('git commit -m "Update portfolio layout and add Google Analytics tracking"', { encoding: "utf-8" });
    } catch (commitErr) {
      commitOut = commitErr.stdout || commitErr.message;
    }
    
    // 3. Git Push
    let pushOut = "";
    try {
      pushOut = execSync("git push", { encoding: "utf-8" });
    } catch (e) {
      pushOut = e.stdout || e.message;
    }
    console.log("Git Push:", pushOut);

    return NextResponse.json({
      success: true,
      log: {
        status: statusOut,
        diff: diffOut,
        add: addOut,
        commit: commitOut,
        push: pushOut
      }
    });
  } catch (err) {
    console.error("❌ Git Push Failed:", err.message);
    return NextResponse.json({
      success: false,
      error: err.message,
      stdout: err.stdout,
      stderr: err.stderr
    });
  }
}
