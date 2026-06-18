import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

function checkAuth(req) {
  const session = req.cookies.get("admin_session");
  return session && session.value === "authenticated";
}

export async function GET(req) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let dbStatus = "online";
  let counts = {
    pricing_plans: 0,
    portfolio_items: 0,
    blogs: 0
  };

  try {
    const [pricingRows] = await pool.query("SELECT COUNT(*) as count FROM pricing_plans");
    counts.pricing_plans = pricingRows[0].count;

    const [portfolioRows] = await pool.query("SELECT COUNT(*) as count FROM portfolio_items");
    counts.portfolio_items = portfolioRows[0].count;

    const [blogRows] = await pool.query("SELECT COUNT(*) as count FROM blogs");
    counts.blogs = blogRows[0].count;
  } catch (error) {
    console.error("Database status check error:", error);
    dbStatus = "offline";
  }

  return NextResponse.json({
    dbStatus,
    counts
  });
}
