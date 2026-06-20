export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import fs from "fs";
import path from "path";

function checkAuth(req) {
  const session = req.cookies.get("admin_session");
  return session && session.value === "authenticated";
}

// Fallback pricing retrieval from backup JSON file
function getJsonFallback() {
  try {
    const filePath = path.join(process.cwd(), "data", "pricingData.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Critical: Failed to read backup pricing JSON file:", err);
  }
  return { adsPlans: [], websitePlans: [], creativePacks: [], aiVideoPlans: [] };
}

export async function GET() {
  try {
    // Attempt querying MySQL database
    const [rows] = await pool.query("SELECT * FROM pricing_plans");

    const formattedData = {
      adsPlans: [],
      websitePlans: [],
      creativePacks: [],
      aiVideoPlans: [],
    };

    rows.forEach((plan) => {
      const parsedPlan = {
        id: plan.id,
        platform: plan.platform,
        badgeClass: plan.badge_class,
        level: plan.level,
        pillClass: plan.pill_class,
        price: plan.price.includes(",") ? plan.price : Number(plan.price),
        period: plan.period,
        features: JSON.parse(plan.features),
        buttonText: plan.button_text,
        isPopular: Boolean(plan.is_popular),
        serviceName: plan.service_name,
        planParameter: plan.plan_parameter,
        tagClass: plan.tag_class,
        isHighlight: Boolean(plan.is_highlight),
        highlightStyles: plan.highlight_styles ? JSON.parse(plan.highlight_styles) : undefined,
      };

      if (formattedData[plan.category]) {
        formattedData[plan.category].push(parsedPlan);
      }
    });

    const levelOrder = {
      "basic": 1, "static": 1, "starter": 1, "starter plan": 1,
      "standard": 2, "dynamic": 2, "growth": 2, "value": 2, "growth plan": 2,
      "premium": 3, "premium plan": 3, "pro": 3, "pro plan": 3
    };
    const getWeight = (lvl) => levelOrder[String(lvl).toLowerCase().trim()] || 99;

    Object.keys(formattedData).forEach((cat) => {
      formattedData[cat].sort((a, b) => getWeight(a.level) - getWeight(b.level));
    });

    return NextResponse.json(formattedData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.warn("MySQL database connection failed. Falling back to local pricing JSON backup. Error:", error.message);
    const fallback = getJsonFallback();

    const levelOrder = {
      "basic": 1, "static": 1, "starter": 1, "starter plan": 1,
      "standard": 2, "dynamic": 2, "growth": 2, "value": 2, "growth plan": 2,
      "premium": 3, "premium plan": 3, "pro": 3, "pro plan": 3
    };
    const getWeight = (lvl) => levelOrder[String(lvl).toLowerCase().trim()] || 99;

    Object.keys(fallback).forEach((cat) => {
      fallback[cat].sort((a, b) => getWeight(a.level) - getWeight(b.level));
    });

    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  }
}

export async function POST(req) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pricingData = await req.json();

    // Direct backup copy to JSON file for safety and sync
    try {
      const backupPath = path.join(process.cwd(), "data", "pricingData.json");
      fs.writeFileSync(backupPath, JSON.stringify(pricingData, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("Failed to update backup pricing JSON file:", fsErr);
    }

    try {
      const connection = await pool.getConnection();

      try {
        await connection.beginTransaction();

        await connection.query("DELETE FROM pricing_plans");

        const planCategories = ["adsPlans", "websitePlans", "creativePacks", "aiVideoPlans"];
        for (const cat of planCategories) {
          if (pricingData[cat]) {
            for (const plan of pricingData[cat]) {
              const id = Math.random().toString(36).substring(2, 15);
              await connection.query(`
                INSERT INTO pricing_plans 
                (id, category, platform, badge_class, level, pill_class, price, period, features, button_text, is_popular, service_name, plan_parameter, tag_class, is_highlight, highlight_styles)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                id,
                cat,
                plan.platform || null,
                plan.badgeClass || null,
                plan.level || "",
                plan.pillClass || null,
                String(plan.price),
                plan.period || null,
                JSON.stringify(plan.features),
                plan.buttonText || "Select Plan",
                plan.isPopular ? 1 : 0,
                plan.serviceName || null,
                plan.planParameter || null,
                plan.tagClass || null,
                plan.isHighlight ? 1 : 0,
                plan.highlightStyles ? JSON.stringify(plan.highlightStyles) : null
              ]);
            }
          }
        }

        await connection.commit();
        return NextResponse.json({ success: true, message: "Pricing plans saved to MySQL and JSON backup successfully" });
      } catch (transactionError) {
        await connection.rollback();
        throw transactionError;
      } finally {
        connection.release();
      }
    } catch (dbError) {
      console.warn("MySQL connection or query failed. Saved only to local JSON backup. Error:", dbError.message);
      return NextResponse.json({ 
        success: true, 
        warning: "MySQL offline. Saved to local JSON backup.",
        message: "Pricing plans saved to local JSON backup successfully (Database offline)" 
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to persist pricing: " + error.message }, { status: 500 });
  }
}
