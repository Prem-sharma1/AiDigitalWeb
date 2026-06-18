"use client";

import React, { useState, useEffect } from "react";
import { SiteHeader, SiteFooter, Icon } from "../../components/SiteChrome";
import Link from "next/link";

export default function BlogDetailPage({ params }) {
  // Safe extraction of params (React.use is standard for React 19)
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogsList, setBlogsList] = useState([]);

  useEffect(() => {
    // Fetch all blogs to filter and find current slug, plus recent suggestions
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const current = data.find((b) => b.slug === slug);
          setBlog(current || null);
          // Suggest other blogs excluding current
          setBlogsList(data.filter((b) => b.slug !== slug).slice(0, 3));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blog post:", err);
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
          {blog.content.split("\n").map((paragraph, index) => {
            if (paragraph.startsWith("## ")) {
              return <h2 key={index} style={styles.bodyH2}>{paragraph.replace("## ", "")}</h2>;
            }
            if (paragraph.startsWith("### ")) {
              return <h3 key={index} style={styles.bodyH3}>{paragraph.replace("### ", "")}</h3>;
            }
            if (paragraph.startsWith("- ")) {
              return <li key={index} style={styles.bodyLi}>{paragraph.replace("- ", "")}</li>;
            }
            if (paragraph.trim() === "") return null;
            return <p key={index} style={styles.bodyParagraph}>{paragraph}</p>;
          })}
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
    fontSize: "16px",
    color: "#334155",
    lineHeight: "1.7",
    marginBottom: "60px",
  },
  bodyH2: {
    fontFamily: "var(--font-headline)",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginTop: "32px",
    marginBottom: "16px",
  },
  bodyH3: {
    fontFamily: "var(--font-headline)",
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginTop: "24px",
    marginBottom: "12px",
  },
  bodyParagraph: {
    marginBottom: "20px",
  },
  bodyLi: {
    marginLeft: "20px",
    marginBottom: "8px",
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
