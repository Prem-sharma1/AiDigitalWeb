import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("🚀 Starting Git Push via API...");
    
    // 1. Git Add
    const addOut = execSync("git add .", { encoding: "utf-8" });
    console.log("Git Add:", addOut);

    // 2. Git Commit
    let commitOut = "";
    try {
      commitOut = execSync('git commit -m "Update portfolio layout and add Google Analytics tracking"', { encoding: "utf-8" });
    } catch (commitErr) {
      commitOut = commitErr.stdout || commitErr.message;
    }
    console.log("Git Commit:", commitOut);

    // 3. Git Push
    const pushOut = execSync("git push origin HEAD", { encoding: "utf-8" });
    console.log("Git Push:", pushOut);

    return NextResponse.json({
      success: true,
      log: {
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
