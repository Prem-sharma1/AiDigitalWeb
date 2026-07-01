export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";

function checkAuth(req) {
  const session = req.cookies.get("admin_session");
  return session && session.value === "authenticated";
}

import { googlePlans, facebookPlans, combinePlans, websitePlans, creativePacks, aiVideoPlans } from "../../../pricing/pricingData";

// Fallback pricing retrieval from backup JSON file
function getJsonFallback() {
  try {
    const filePath = path.join(process.cwd(), "data", "pricingData.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not read backup pricing JSON file, using static code import. Error:", err.message);
  }
  return { googlePlans, facebookPlans, combinePlans, websitePlans, creativePacks, aiVideoPlans };
}

// Helper to auto-create pricing_plans table
async function ensurePricingTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id VARCHAR(36) NOT NULL,
      category VARCHAR(50) NOT NULL,
      platform VARCHAR(50) DEFAULT NULL,
      badge_class VARCHAR(50) DEFAULT NULL,
      level VARCHAR(50) NOT NULL,
      pill_class VARCHAR(50) DEFAULT NULL,
      price VARCHAR(50) NOT NULL,
      period VARCHAR(50) DEFAULT NULL,
      features TEXT NOT NULL,
      button_text VARCHAR(50) DEFAULT 'Select Plan',
      is_popular TINYINT(1) DEFAULT '0',
      service_name VARCHAR(100) DEFAULT NULL,
      plan_parameter VARCHAR(255) DEFAULT NULL,
      tag_class VARCHAR(50) DEFAULT NULL,
      is_highlight TINYINT(1) DEFAULT '0',
      highlight_styles TEXT DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  await connection.query(query);
}

// Helper to synchronize JSON pricing data into the database
async function syncPricingToDb(connection, pricingData) {
  try {
    await performPricingSync(connection, pricingData);
  } catch (error) {
    console.warn("Pricing sync failed, dropping table and trying again. Error:", error.message);
    await connection.query("DROP TABLE IF EXISTS pricing_plans");
    await ensurePricingTable(connection);
    await performPricingSync(connection, pricingData);
  }
}

async function performPricingSync(connection, pricingData) {
  await connection.query("DELETE FROM pricing_plans");
  const planCategories = ["googlePlans", "facebookPlans", "combinePlans", "websitePlans", "creativePacks", "aiVideoPlans"];
  for (const cat of planCategories) {
    if (pricingData[cat]) {
      for (const plan of pricingData[cat]) {
        const id = plan.id || crypto.randomUUID();
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
}

// Helper to format and sort rows for frontend response
function formatAndSortPricing(rows) {
  const formattedData = {
    googlePlans: [],
    facebookPlans: [],
    combinePlans: [],
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

  const getPriceVal = (price) => Number(String(price).replace(/,/g, "")) || 0;
  Object.keys(formattedData).forEach((cat) => {
    formattedData[cat].sort((a, b) => getPriceVal(a.price) - getPriceVal(b.price));
  });

  return formattedData;
}

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      await ensurePricingTable(connection);

      const [rows] = await connection.query("SELECT * FROM pricing_plans");
      const formatted = formatAndSortPricing(rows);
      const fallback = getJsonFallback();

      // Merge fallback data for any category that is empty in the database
      const planCategories = ["googlePlans", "facebookPlans", "combinePlans", "websitePlans", "creativePacks", "aiVideoPlans"];
      planCategories.forEach(cat => {
        if (!formatted[cat] || formatted[cat].length === 0) {
          formatted[cat] = fallback[cat] || [];
        }
      });

      return NextResponse.json(formatted, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.warn("MySQL database pricing fetch failed. Using local JSON fallback. Error:", error.message);
    const fallback = getJsonFallback();
    
    const getPriceVal = (price) => Number(String(price).replace(/,/g, "")) || 0;
    Object.keys(fallback).forEach((cat) => {
      if (fallback[cat] && Array.isArray(fallback[cat])) {
        fallback[cat].sort((a, b) => getPriceVal(a.price) - getPriceVal(b.price));
      }
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

    // 1. Direct backup copy to JSON file for safety and sync
    try {
      const backupPath = path.join(process.cwd(), "data", "pricingData.json");
      fs.writeFileSync(backupPath, JSON.stringify(pricingData, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("Failed to update backup pricing JSON file:", fsErr);
    }

    // 2. Direct write to MySQL Database
    try {
      const connection = await pool.getConnection();
      try {
        await ensurePricingTable(connection);
        await connection.beginTransaction();

        await syncPricingToDb(connection, pricingData);

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
