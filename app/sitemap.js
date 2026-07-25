import pool from "../lib/db";

export default async function sitemap() {
  const baseUrl = "https://www.aidigital.biz";

  const staticRoutes = [
    "",
    "/pricing",
    "/blog",
    "/portfolio",
    "/checkout",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  let blogRoutes = [];
  try {
    const [rows] = await pool.query(
      "SELECT slug, updated_at FROM blogs WHERE published = 1"
    );
    if (Array.isArray(rows)) {
      blogRoutes = rows.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updated_at
          ? new Date(blog.updated_at).toISOString()
          : new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.warn("Sitemap DB fetch fallback:", error.message);
  }

  return [...staticRoutes, ...blogRoutes];
}
