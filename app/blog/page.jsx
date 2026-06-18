"use client";

import React, { useState, useEffect } from "react";
import { SiteHeader, SiteFooter, Icon } from "../components/SiteChrome";
import Link from "next/link";

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(blogs.map((b) => b.category))];

  const filteredBlogs = selectedCategory === "All"
    ? blogs
    : blogs.filter((b) => b.category === selectedCategory);

  return (
    <div style={styles.pageWrapper}>
      <SiteHeader active="blog" />

      {/* Hero Header Section */}
      <section style={styles.heroSection}>
        <div style={styles.eyebrow}>Insights & Knowledge</div>
        <h1 style={styles.mainTitle}>
          AI Digital <span>Blogs</span>
        </h1>
        <p style={styles.subtitle}>
          Stay ahead with the latest strategies in AI-driven marketing, web development frameworks, and SEO conversions.
        </p>
      </section>

      {/* Categories Filter Row */}
      <section style={styles.filterSection}>
        <div style={styles.filterRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.filterBtn,
                ...(selectedCategory === cat ? styles.filterBtnActive : {}),
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blogs Main Grid */}
      <section style={styles.gridSection}>
        {loading ? (
          <div style={styles.loader}>Loading blogs...</div>
        ) : filteredBlogs.length === 0 ? (
          <div style={styles.empty}>No blog posts found. Check back later!</div>
        ) : (
          <div style={styles.blogsGrid}>
            {filteredBlogs.map((post) => (
              <article key={post.id} style={styles.blogCard}>
                <div style={styles.cardMedia}>
                  <img
                    src={post.coverImage || "/creative_content/Creative1.jpeg"}
                    alt={post.title}
                    style={styles.cardImage}
                  />
                  <span style={styles.cardCategory}>{post.category}</span>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardMeta}>
                    <span>{new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <h2 style={styles.cardTitle}>{post.title}</h2>
                  <p style={styles.cardExcerpt}>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} style={styles.readMoreLink}>
                    Read Post <Icon name="arrow_forward" style={styles.arrowIcon} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#0f172a",
  },
  heroSection: {
    padding: "80px var(--page-gutter) 40px var(--page-gutter)",
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
  },
  eyebrow: {
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#e56030",
    letterSpacing: "0.05em",
    marginBottom: "12px",
  },
  mainTitle: {
    fontFamily: "var(--font-headline)",
    fontSize: "clamp(32px, 5vw, 52px)",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#0f172a",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  filterSection: {
    paddingInline: "var(--page-gutter)",
    marginBottom: "40px",
  },
  filterRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  filterBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    padding: "8px 20px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  filterBtnActive: {
    backgroundColor: "#e56030",
    color: "#ffffff",
    borderColor: "#e56030",
    boxShadow: "0 4px 12px rgba(229, 96, 48, 0.2)",
  },
  gridSection: {
    paddingInline: "var(--page-gutter)",
    paddingBottom: "80px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  blogsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "32px",
  },
  blogCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
    border: "1px solid #eef2f7",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    position: "relative",
    height: "220px",
    width: "100%",
    backgroundColor: "#e2e8f0",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardCategory: {
    position: "absolute",
    top: "16px",
    left: "16px",
    backgroundColor: "#ffffff",
    color: "#e56030",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    padding: "4px 12px",
    borderRadius: "6px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },
  cardBody: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardMeta: {
    display: "flex",
    gap: "8px",
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "12px",
  },
  cardTitle: {
    fontFamily: "var(--font-headline)",
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "1.3",
    color: "#0f172a",
    marginBottom: "12px",
  },
  cardExcerpt: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.5",
    marginBottom: "20px",
    flex: 1,
  },
  readMoreLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#e56030",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "auto",
  },
  arrowIcon: {
    fontSize: "14px",
  },
  loader: {
    textAlign: "center",
    fontSize: "16px",
    color: "#64748b",
    padding: "40px 0",
  },
  empty: {
    textAlign: "center",
    fontSize: "16px",
    color: "#64748b",
    padding: "60px 0",
  },
};
