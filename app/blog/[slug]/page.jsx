"use client";

import React, { useState, useEffect } from "react";
import { SiteHeader, SiteFooter, Icon } from "../../components/SiteChrome";
import Link from "next/link";

function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let listItems = [];

  const parseInline = (lineText) => {
    const tokens = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const parts = lineText.split(regex);
    
    parts.forEach((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        tokens.push(
          <strong key={i} style={{ fontWeight: "700", color: "#0f172a" }}>
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith("`") && part.endsWith("`")) {
        tokens.push(
          <code key={i} style={{ fontFamily: "monospace", backgroundColor: "#e2e8f0", padding: "2px 6px", borderRadius: "4px", fontSize: "0.9em" }}>
            {part.slice(1, -1)}
          </code>
        );
      } else {
        tokens.push(part);
      }
    });
    return tokens;
  };

  const flushList = (key) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} style={{ margin: "0 0 20px 20px", padding: 0 }}>
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList(index);
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(index);
      elements.push(
        <h2 key={index} style={styles.bodyH2}>
          {parseInline(trimmed.substring(3))}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList(index);
      elements.push(
        <h3 key={index} style={styles.bodyH3}>
          {parseInline(trimmed.substring(4))}
        </h3>
      );
    } else if (trimmed.startsWith("#### ")) {
      flushList(index);
      elements.push(
        <h4 key={index} style={{ ...styles.bodyH3, fontSize: "18px", marginTop: "20px" }}>
          {parseInline(trimmed.substring(5))}
        </h4>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.substring(2);
      listItems.push(
        <li key={`li-${index}`} style={styles.bodyLi}>
          {parseInline(content)}
        </li>
      );
    } else {
      flushList(index);
      elements.push(
        <p key={index} style={styles.bodyParagraph}>
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  flushList(lines.length);
  return elements;
}

export default function BlogDetailPage({ params }) {
  // Safe extraction of params (React.use is standard for React 19)
  const resolvedParams = React.use(params);
  const slug = resolvedParams?.slug;
  console.log("BlogDetailPage rendered. params:", params, "resolvedParams:", resolvedParams, "slug:", slug);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogsList, setBlogsList] = useState([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

    // 1. Fetch single blog post details (with full content)
    fetch(`/api/blogs?slug=${encodeURIComponent(decodedSlug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Blog not found");
        return res.json();
      })
      .then((detailData) => {
        setBlog(detailData);
        
        // 2. Fetch list summaries for suggestions (omitting heavy content)
        return fetch("/api/blogs");
      })
      .then((res) => {
        if (res) return res.json();
      })
      .then((listData) => {
        if (Array.isArray(listData)) {
          const filtered = listData.filter((b) => {
            const dbSlug = decodeURIComponent(b.slug || "").toLowerCase().trim();
            return dbSlug !== decodedSlug;
          });
          setBlogsList(filtered.slice(0, 3));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blog details:", err);
        setBlog(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <SiteHeader active="blog" />
        <div style={styles.centerText}>Loading blog article...</div>
        <SiteFooter />
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={styles.errorWrapper}>
        <SiteHeader active="blog" />
        <div style={styles.errorContent}>
          <h2>Blog Post Not Found</h2>
          <p>We couldn't locate the blog post you are looking for.</p>
          <Link href="/blog" style={styles.backBtn}>
            Back to Blogs
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <SiteHeader active="blog" />

      {/* Blog Article Layout */}
      <main style={styles.mainContainer}>
        {/* Back Link */}
        <Link href="/blog" style={styles.backLink}>
          <Icon name="arrow_back" /> Back to all articles
        </Link>

        {/* Article Header */}
        <header style={styles.articleHeader}>
          <span style={styles.category}>{blog.category}</span>
          <h1 style={styles.title}>{blog.title}</h1>
          <div style={styles.metaRow}>
            <span>Published on {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
        </header>

        {/* Cover Image */}
        <div style={styles.coverWrapper}>
          <img
            src={blog.coverImage || "/creative_content/Creative1.jpeg"}
            alt={blog.title}
            style={styles.coverImage}
          />
        </div>

        {/* Article Body */}
        <article style={styles.articleBody}>
          {renderMarkdown(blog.content)}
        </article>

        {/* Suggestions Row */}
        {blogsList.length > 0 && (
          <section style={styles.suggestionsSection}>
            <h3 style={styles.suggestionsTitle}>Related Articles</h3>
            <div style={styles.suggestionsGrid}>
              {blogsList.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} style={styles.suggestionCard}>
                  <img
                    src={post.coverImage || "/creative_content/Creative1.jpeg"}
                    alt={post.title}
                    style={styles.suggestionImg}
                  />
                  <div style={styles.suggestionBody}>
                    <span style={styles.suggestionCategory}>{post.category}</span>
                    <h4 style={styles.suggestionCardTitle}>{post.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

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
  loadingWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
  },
  centerText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b",
    padding: "100px 0",
  },
  errorWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
  },
  errorContent: {
    textAlign: "center",
    padding: "80px var(--page-gutter)",
    maxWidth: "500px",
    margin: "0 auto",
  },
  backBtn: {
    display: "inline-block",
    marginTop: "20px",
    backgroundColor: "#e56030",
    color: "#ffffff",
    padding: "10px 24px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
  },
  mainContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px var(--page-gutter) 80px var(--page-gutter)",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "32px",
  },
  articleHeader: {
    marginBottom: "32px",
  },
  category: {
    fontSize: "11px",
    color: "#e56030",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "inline-block",
    marginBottom: "12px",
  },
  title: {
    fontFamily: "var(--font-headline)",
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: "1.2",
    marginBottom: "16px",
  },
  metaRow: {
    display: "flex",
    gap: "8px",
    fontSize: "13px",
    color: "#94a3b8",
  },
  coverWrapper: {
    borderRadius: "16px",
    overflow: "hidden",
    height: "clamp(240px, 40vw, 400px)",
    marginBottom: "40px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  articleBody: {
    fontSize: "18px",
    color: "#334155",
    lineHeight: "1.8",
    marginBottom: "60px",
  },
  bodyH2: {
    fontFamily: "var(--font-headline)",
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    marginTop: "36px",
    marginBottom: "18px",
  },
  bodyH3: {
    fontFamily: "var(--font-headline)",
    fontSize: "21px",
    fontWeight: "700",
    color: "#0f172a",
    marginTop: "28px",
    marginBottom: "14px",
  },
  bodyParagraph: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  bodyLi: {
    fontSize: "18px",
    marginLeft: "20px",
    marginBottom: "10px",
    listStyleType: "disc",
  },
  suggestionsSection: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "40px",
  },
  suggestionsTitle: {
    fontFamily: "var(--font-headline)",
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "24px",
  },
  suggestionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  suggestionCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #eef2f7",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
    transition: "transform 0.2s ease",
  },
  suggestionImg: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
  },
  suggestionBody: {
    padding: "16px",
  },
  suggestionCategory: {
    fontSize: "9px",
    color: "#e56030",
    fontWeight: "700",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "8px",
  },
  suggestionCardTitle: {
    fontFamily: "var(--font-headline)",
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: "1.3",
    margin: 0,
  },
};
