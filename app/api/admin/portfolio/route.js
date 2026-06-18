export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import fs from "fs";
import path from "path";

function checkAuth(req) {
  const session = req.cookies.get("admin_session");
  return session && session.value === "authenticated";
}

function getJsonFallback() {
  try {
    const filePath = path.join(process.cwd(), "data", "portfolioData.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Critical: Failed to read backup portfolio JSON file:", err);
  }
  return { showcaseProjects: [], industries: [], otherProjects: [], creativeGroups: [] };
}

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM portfolio_items");

    const formattedData = {
      showcaseProjects: [],
      industries: [],
      otherProjects: [],
      creativeGroups: [],
    };

    const industriesMap = {};
    const creativeGroupsMap = {};

    rows.forEach((item) => {
      if (item.section === "showcase") {
        formattedData.showcaseProjects.push({
          id: item.id,
          title: item.title,
          category: item.category,
          industry: item.industry,
          metric: item.metric,
          metricLabel: item.metric_label,
          description: item.description,
          tags: JSON.parse(item.tags || "[]"),
          accent: item.accent,
          icon: item.icon,
        });
      } else if (item.section === "featured") {
        const indName = item.industry || "General";
        if (!industriesMap[indName]) {
          industriesMap[indName] = {
            name: indName,
            description: item.description || "",
            projects: [],
          };
        }
        industriesMap[indName].projects.push({
          title: item.title,
          type: item.category || "Website & SEO",
        });
      } else if (item.section === "other") {
        formattedData.otherProjects.push({
          title: item.title,
          type: item.category || "Campaigns",
        });
      } else if (item.section === "creative") {
        const indName = item.industry || "Other Projects";
        if (!creativeGroupsMap[indName]) {
          creativeGroupsMap[indName] = {
            industry: indName,
            description: item.description || "Creative assets",
            images: [],
          };
        }
        creativeGroupsMap[indName].images.push({
          src: item.src,
          title: item.title,
          description: item.description,
          globalIndex: item.global_index || undefined,
          type: item.type || "image",
        });
      }
    });

    formattedData.industries = Object.values(industriesMap);
    formattedData.creativeGroups = Object.values(creativeGroupsMap);

    return NextResponse.json(formattedData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.warn("MySQL database connection failed. Falling back to local portfolio JSON backup. Error:", error.message);
    const fallback = getJsonFallback();
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

    const portfolioData = await req.json();

    try {
      const backupPath = path.join(process.cwd(), "data", "portfolioData.json");
      fs.writeFileSync(backupPath, JSON.stringify(portfolioData, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("Failed to update backup portfolio JSON file:", fsErr);
    }

    try {
      const connection = await pool.getConnection();

      try {
        await connection.beginTransaction();

        await connection.query("DELETE FROM portfolio_items");

        // 1. Showcase
        if (portfolioData.showcaseProjects) {
          for (const item of portfolioData.showcaseProjects) {
            const id = Math.random().toString(36).substring(2, 15);
            await connection.query(`
              INSERT INTO portfolio_items 
              (id, section, title, category, industry, metric, metric_label, description, tags, accent, icon)
              VALUES (?, 'showcase', ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              id,
              item.title,
              item.category || null,
              item.industry || null,
              item.metric || null,
              item.metricLabel || null,
              item.description || null,
              JSON.stringify(item.tags || []),
              item.accent || null,
              item.icon || null
            ]);
          }
        }

        // 2. Featured
        if (portfolioData.industries) {
          for (const ind of portfolioData.industries) {
            for (const proj of ind.projects) {
              const id = Math.random().toString(36).substring(2, 15);
              await connection.query(`
                INSERT INTO portfolio_items 
                (id, section, title, category, industry, description)
                VALUES (?, 'featured', ?, ?, ?, ?)
              `, [
                id,
                proj.title,
                proj.type || null,
                ind.name,
                ind.description || null
              ]);
            }
          }
        }

        // 3. Other
        if (portfolioData.otherProjects) {
          for (const proj of portfolioData.otherProjects) {
            const id = Math.random().toString(36).substring(2, 15);
            await connection.query(`
              INSERT INTO portfolio_items 
              (id, section, title, category)
              VALUES (?, 'other', ?, ?)
            `, [
              id,
              proj.title,
              proj.type || null
            ]);
          }
        }

        // 4. Creative
        if (portfolioData.creativeGroups) {
          for (const grp of portfolioData.creativeGroups) {
            for (const img of grp.images) {
              const id = Math.random().toString(36).substring(2, 15);
              await connection.query(`
                INSERT INTO portfolio_items 
                (id, section, title, description, src, type, global_index, industry)
                VALUES (?, 'creative', ?, ?, ?, ?, ?, ?)
              `, [
                id,
                img.title,
                img.description || null,
                img.src,
                img.type || "image",
                img.globalIndex || null,
                grp.industry
              ]);
            }
          }
        }

        await connection.commit();
        return NextResponse.json({ success: true, message: "Portfolio saved to MySQL and JSON backup successfully" });
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
        message: "Portfolio saved to local JSON backup successfully (Database offline)" 
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to persist portfolio: " + error.message }, { status: 500 });
  }
}
