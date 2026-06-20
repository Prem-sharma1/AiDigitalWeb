"use client";

import React, { useState, useEffect } from "react";

function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [pricingData, setPricingData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [blogsData, setBlogsData] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [stats, setStats] = useState({ dbStatus: "checking", counts: { pricing_plans: 0, portfolio_items: 0, blogs: 0, whatsapp_logs: 0 } });

  // WhatsApp Automation States
  const [whatsappData, setWhatsappData] = useState({ config: {}, logs: [], dbConnected: false });
  const [isTestSending, setIsTestSending] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const [testMessage, setTestMessage] = useState("");

  // Blog Editor State
  const [editingBlog, setEditingBlog] = useState(null); // null if not editing/creating
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Marketing",
    published: false,
  });

  // Blog Import State
  const [importSourceType, setImportSourceType] = useState("devto");
  const [importFeedUrl, setImportFeedUrl] = useState("");
  const [importUsername, setImportUsername] = useState("");
  const [importCategory, setImportCategory] = useState("Marketing");
  const [isImporting, setIsImporting] = useState(false);

  // Pricing edit helpers
  const [selectedPriceCategory, setSelectedPriceCategory] = useState("adsPlans");

  // Auth checking on mount disabled to force manual login
  useEffect(() => {
    // Explicit email/password input is required to access the admin panel.
  }, []);

  const loadWhatsAppInfo = async () => {
    try {
      const res = await fetch("/api/admin/whatsapp?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setWhatsappData(data);
      }
    } catch (err) {
      console.warn("Failed to load WhatsApp data:", err);
    }
  };

  const loadAllData = async () => {
    try {
      loadStats();
      const pricingRes = await fetch("/api/admin/pricing?t=" + Date.now(), { cache: "no-store" });
      if (pricingRes.ok) {
        const data = await pricingRes.json();
        setPricingData(data);
      }

      const portfolioRes = await fetch("/api/admin/portfolio?t=" + Date.now(), { cache: "no-store" });
      if (portfolioRes.ok) {
        const data = await portfolioRes.json();
        setPortfolioData(data);
      }

      loadBlogs();
      loadWhatsAppInfo();
    } catch (err) {
      showToast("Failed to load configuration data", "error");
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setStats(prev => ({ ...prev, dbStatus: "offline" }));
      }
    } catch (err) {
      setStats(prev => ({ ...prev, dbStatus: "offline" }));
    }
  };

  const triggerBackup = async () => {
    try {
      const res = await fetch("/api/admin/backup", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Backup completed successfully!");
        
        // Trigger browser download of the backup payload
        if (data.backupData) {
          const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data.backupData, null, 2)
          )}`;
          const downloadAnchor = document.createElement("a");
          downloadAnchor.setAttribute("href", jsonString);
          downloadAnchor.setAttribute("download", `ai_digital_backup_${new Date().toISOString().slice(0, 10)}.json`);
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();
        }
      } else {
        showToast("Backup failed", "error");
      }
    } catch (err) {
      showToast("Network connection error", "error");
    }
  };

  const loadBlogs = async () => {
    try {
      const res = await fetch("/api/blogs?admin=true");
      if (res.ok) {
        const data = await res.json();
        setBlogsData(data);
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setAuthError(data.error || "Authentication failed");
      }
    } catch (err) {
      setAuthError("Network connection error");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  const showToast = (message, type = "success") => {
    setStatusMessage(message);
    setStatusType(type);
    setTimeout(() => {
      setStatusMessage("");
    }, 4000);
  };

  const handleSavePricing = async () => {
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricingData),
      });
      if (res.ok) {
        showToast("Pricing plans updated successfully!");
      } else {
        showToast("Error saving pricing data", "error");
      }
    } catch (err) {
      showToast("Connection failed", "error");
    }
  };

  const handleSavePortfolio = async () => {
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData),
      });
      if (res.ok) {
        showToast("Portfolio data updated successfully!");
      } else {
        showToast("Error saving portfolio data", "error");
      }
    } catch (err) {
      showToast("Connection failed", "error");
    }
  };

  // Pricing operations
  const updatePricingField = (category, index, field, value) => {
    setPricingData(prev => ({
      ...prev,
      [category]: prev[category].map((plan, idx) =>
        idx === index ? { ...plan, [field]: value } : plan
      )
    }));
  };

  const updatePricingFeatures = (category, index, commaString) => {
    setPricingData(prev => {
      const updatedCategory = prev[category].map((plan, idx) => {
        if (idx !== index) return plan;
        
        let updatedFeatures;
        if (category === "websitePlans" || category === "creativePacks" || category === "aiVideoPlans") {
          const currentFeatures = plan.features || [];
          const texts = commaString.split(",").map(t => t.trim()).filter(Boolean);
          updatedFeatures = texts.map((text, i) => ({
            icon: currentFeatures[i]?.icon || "check_circle",
            text
          }));
        } else {
          updatedFeatures = commaString.split(",").map((f) => f.trim()).filter(Boolean);
        }
        
        return { ...plan, features: updatedFeatures };
      });
      return { ...prev, [category]: updatedCategory };
    });
  };

  const addPricingPlan = (category) => {
    let newPlan;
    if (category === "adsPlans") {
      newPlan = {
        platform: "Meta Ads",
        badgeClass: "fb-badge",
        level: "New Level",
        pillClass: "basic-pill",
        price: 2999,
        period: "/month",
        features: ["Feature 1", "Feature 2"],
        buttonText: "Select Plan",
        isPopular: false,
        serviceName: "Performance Marketing",
        planParameter: "Meta Ads - New Level (₹2999/mo)"
      };
    } else if (category === "websitePlans") {
      newPlan = {
        level: "New Website Plan",
        tagClass: "static-tag",
        price: 9999,
        period: "",
        features: [
          { icon: "language", text: "Domain Name" },
          { icon: "cloud_queue", text: "Hosting" }
        ],
        buttonText: "Select Plan",
        serviceName: "Web Development",
        planParameter: "New Website Plan (₹9999)"
      };
    } else if (category === "creativePacks") {
      newPlan = {
        level: "New Pack",
        tagClass: "static-tag",
        price: 999,
        period: "",
        features: [
          { icon: "image", text: "5 Creatives" }
        ],
        buttonText: "Select Plan",
        serviceName: "SEO Growth",
        planParameter: "Creative Packs - New Pack (5 for ₹999)",
        isHighlight: false
      };
    } else if (category === "aiVideoPlans") {
      newPlan = {
        level: "New Plan",
        tagClass: "static-tag",
        price: "3,000",
        period: "",
        features: [
          { icon: "video_library", text: "3 AI Videos" }
        ],
        buttonText: "Select Plan",
        serviceName: "AI Video Production",
        planParameter: "AI Video - New Plan (3 Videos for ₹3000)",
        isHighlight: false
      };
    }
    
    if (newPlan) {
      setPricingData(prev => ({
        ...prev,
        [category]: [...prev[category], newPlan]
      }));
    }
  };

  const deletePricingPlan = (category, index) => {
    if (!confirm("Are you sure you want to delete this pricing plan?")) return;
    setPricingData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, idx) => idx !== index)
    }));
  };

  // Portfolio Operations - Showcase Carousel
  const updateShowcaseField = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      showcaseProjects: prev.showcaseProjects.map((proj, idx) =>
        idx === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const updateShowcaseTags = (index, commaString) => {
    setPortfolioData(prev => ({
      ...prev,
      showcaseProjects: prev.showcaseProjects.map((proj, idx) =>
        idx === index ? { ...proj, tags: commaString.split(",").map((t) => t.trim()).filter(Boolean) } : proj
      )
    }));
  };

  const deleteShowcaseItem = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      showcaseProjects: prev.showcaseProjects.filter((_, idx) => idx !== index)
    }));
  };

  const addShowcaseItem = () => {
    const newItem = {
      title: "New Showcase Project",
      category: "Website & SEO",
      industry: "General",
      metric: "+50%",
      metricLabel: "Conversion Rate",
      description: "Short description of the awesome dynamic project outcomes.",
      tags: ["Dynamic", "Interactive"],
      accent: "blue",
      icon: "language"
    };
    setPortfolioData(prev => ({
      ...prev,
      showcaseProjects: [...prev.showcaseProjects, newItem]
    }));
  };

  // Portfolio Operations - Featured Industries & General
  const updateFeaturedProject = (industryIndex, projectIndex, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      industries: prev.industries.map((ind, indIdx) => {
        if (indIdx !== industryIndex) return ind;
        return {
          ...ind,
          projects: ind.projects.map((proj, projIdx) =>
            projIdx === projectIndex ? { ...proj, [field]: value } : proj
          )
        };
      })
    }));
  };

  const deleteFeaturedProject = (industryIndex, projectIndex) => {
    setPortfolioData(prev => ({
      ...prev,
      industries: prev.industries.map((ind, indIdx) => {
        if (indIdx !== industryIndex) return ind;
        return {
          ...ind,
          projects: ind.projects.filter((_, projIdx) => projIdx !== projectIndex)
        };
      })
    }));
  };

  const addFeaturedProject = (industryIndex) => {
    const newProject = {
      title: "New Featured Project",
      type: "Website & SEO"
    };
    setPortfolioData(prev => ({
      ...prev,
      industries: prev.industries.map((ind, indIdx) => {
        if (indIdx !== industryIndex) return ind;
        return {
          ...ind,
          projects: [...ind.projects, newProject]
        };
      })
    }));
  };

  // Portfolio Operations - General / Other projects list
  const updateOtherProject = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      otherProjects: prev.otherProjects.map((proj, idx) =>
        idx === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const deleteOtherProject = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      otherProjects: prev.otherProjects.filter((_, idx) => idx !== index)
    }));
  };

  const addOtherProject = () => {
    const newProject = {
      title: "New Marketing Campaign",
      type: "Campaigns"
    };
    setPortfolioData(prev => ({
      ...prev,
      otherProjects: [...prev.otherProjects, newProject]
    }));
  };

  // Portfolio Operations - Creative Content Grid
  const updateCreativeMedia = (groupIndex, mediaIndex, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      creativeGroups: prev.creativeGroups.map((group, grpIdx) => {
        if (grpIdx !== groupIndex) return group;
        return {
          ...group,
          images: group.images.map((img, imgIdx) =>
            imgIdx === mediaIndex ? { ...img, [field]: value } : img
          )
        };
      })
    }));
  };

  const deleteCreativeMedia = (groupIndex, mediaIndex) => {
    setPortfolioData(prev => ({
      ...prev,
      creativeGroups: prev.creativeGroups.map((group, grpIdx) => {
        if (grpIdx !== groupIndex) return group;
        return {
          ...group,
          images: group.images.filter((_, imgIdx) => imgIdx !== mediaIndex)
        };
      })
    }));
  };

  const addCreativeMedia = (groupIndex) => {
    const newMedia = {
      src: "/creative_content/Creative1.jpeg",
      title: "New Creative Visual",
      description: "Describe this media file display visual.",
      globalIndex: Date.now() % 1000,
      type: "image"
    };
    setPortfolioData(prev => ({
      ...prev,
      creativeGroups: prev.creativeGroups.map((group, grpIdx) => {
        if (grpIdx !== groupIndex) return group;
        return {
          ...group,
          images: [...group.images, newMedia]
        };
      })
    }));
  };

  // Blog Operations
  const handleCreateBlogClick = () => {
    setEditingBlog("new");
    setBlogForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "Marketing",
      published: false,
    });
  };

  const handleEditBlogClick = (blog) => {
    setEditingBlog(blog.id);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage || "",
      category: blog.category,
      published: blog.published,
    });
  };

  const handleBlogTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setBlogForm({ ...blogForm, title, slug });
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const isNew = editingBlog === "new";
      const res = await fetch("/api/blogs", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNew ? blogForm : { id: editingBlog, ...blogForm }),
      });

      if (res.ok) {
        showToast(isNew ? "Blog post created!" : "Blog post updated!");
        setEditingBlog(null);
        loadBlogs();
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to save blog post", "error");
      }
    } catch (err) {
      showToast("Network error saving blog", "error");
    }
  };

  const handleImportBlogs = async (e) => {
    e.preventDefault();
    setIsImporting(true);
    try {
      const res = await fetch("/api/blogs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: importSourceType,
          feedUrl: importFeedUrl,
          username: importUsername,
          defaultCategory: importCategory,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Import completed successfully!");
        setImportFeedUrl("");
        setImportUsername("");
        loadBlogs();
      } else {
        showToast(data.error || "Failed to import blogs.", "error");
      }
    } catch (err) {
      showToast("Network error during import.", "error");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Blog post deleted successfully.");
        loadBlogs();
      } else {
        showToast("Error deleting blog post.", "error");
      }
    } catch (err) {
      showToast("Network error deleting blog", "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        {/* Glow Spheres for Premium Aesthetics */}
        <div style={styles.glowSphere1}></div>
        <div style={styles.glowSphere2}></div>

        <div style={styles.loginCard}>
          <div style={styles.logoRow}>
            <img src="/logo-cropped.png" alt="AI Digital Logo" style={{ height: "45px", width: "auto", objectFit: "contain" }} />
          </div>
          <p style={styles.loginSubtitle}>Sign in to manage your premium assets</p>
          <form onSubmit={handleLogin} style={styles.loginForm}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Admin Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aidigital.com"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
                required
              />
            </div>
            {authError && <div style={styles.errorAlert}>{authError}</div>}
            <button type="submit" style={styles.loginButton}>Unlock Panel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.adminWrapper}>
      {/* Toast Notification */}
      {statusMessage && (
        <div style={{ ...styles.toast, backgroundColor: statusType === "success" ? "#10B981" : "#EF4444" }}>
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/logo-cropped.png" alt="AI Digital Logo" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
          <div style={{ marginLeft: "12px", borderLeft: "1px solid rgba(255, 255, 255, 0.15)", paddingLeft: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Admin Panel</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <Icon name="logout" /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={styles.mainGrid}>
        {/* Navigation Sidebar */}
        <aside style={styles.sidebar}>
          <button
            onClick={() => { setActiveTab("overview"); setEditingBlog(null); }}
            style={{ ...styles.sidebarBtn, ...(activeTab === "overview" ? styles.sidebarBtnActive : {}) }}
          >
            <Icon name="analytics" /> Overview Dashboard
          </button>
          <button
            onClick={() => { setActiveTab("pricing"); setEditingBlog(null); }}
            style={{ ...styles.sidebarBtn, ...(activeTab === "pricing" ? styles.sidebarBtnActive : {}) }}
          >
            <Icon name="payments" /> Pricing Packages
          </button>
          <button
            onClick={() => { setActiveTab("portfolio"); setEditingBlog(null); }}
            style={{ ...styles.sidebarBtn, ...(activeTab === "portfolio" ? styles.sidebarBtnActive : {}) }}
          >
            <Icon name="dashboard" /> Portfolio Showcase
          </button>
          <button
            onClick={() => { setActiveTab("blogs"); setEditingBlog(null); }}
            style={{ ...styles.sidebarBtn, ...(activeTab === "blogs" ? styles.sidebarBtnActive : {}) }}
          >
            <Icon name="article" /> Blogs Editor
          </button>
          <button
            onClick={() => { setActiveTab("whatsapp"); setEditingBlog(null); loadWhatsAppInfo(); }}
            style={{ ...styles.sidebarBtn, ...(activeTab === "whatsapp" ? styles.sidebarBtnActive : {}) }}
          >
            <Icon name="forum" /> WhatsApp Alerts
          </button>
        </aside>

        {/* Workspace Content */}
        <section style={styles.content}>
          {activeTab === "overview" && (
            <div>
              <div style={styles.contentHeader}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0 }}>Overview</h2>
                  <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>System status and metrics overview</p>
                </div>
                <button onClick={loadStats} style={styles.refreshBtn}>
                  <Icon name="refresh" /> Refresh Status
                </button>
              </div>

              {/* Status Section */}
              <div style={styles.overviewGrid}>
                {/* Database Status Card */}
                <div style={styles.statusCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={{ margin: 0, fontSize: "18px" }}>Database Connection</h3>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: stats.dbStatus === "online" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                      color: stats.dbStatus === "online" ? "#10B981" : "#EF4444",
                      border: `1px solid ${stats.dbStatus === "online" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`
                    }}>
                      {stats.dbStatus === "online" ? "Online" : "Offline"}
                    </span>
                  </div>
                  <p style={styles.cardDesc}>
                    Status of your connection to the local XAMPP MySQL database. If it's offline, make sure Apache and MySQL are running in your XAMPP Control Panel.
                  </p>
                  <div style={styles.databaseActions}>
                    <button 
                      onClick={triggerBackup} 
                      disabled={stats.dbStatus !== "online"}
                      style={{
                        ...styles.actionBtn,
                        opacity: stats.dbStatus === "online" ? 1 : 0.5,
                        cursor: stats.dbStatus === "online" ? "pointer" : "not-allowed"
                      }}
                    >
                      <Icon name="backup" /> Backup Database to JSON
                    </button>
                  </div>
                </div>

                {/* Stats Summary Cards */}
                <div style={styles.statsSummaryGrid}>
                  <div style={styles.miniCard}>
                    <div style={styles.miniCardHeader}>
                      <Icon name="payments" style={{ color: "#FD7E14" }} />
                      <h4 style={{ margin: 0 }}>Pricing Plans</h4>
                    </div>
                    <p style={styles.statNumber}>{stats.counts.pricing_plans}</p>
                    <span style={styles.statLabel}>Active packages</span>
                  </div>

                  <div style={styles.miniCard}>
                    <div style={styles.miniCardHeader}>
                      <Icon name="dashboard" style={{ color: "#3B82F6" }} />
                      <h4 style={{ margin: 0 }}>Portfolio Items</h4>
                    </div>
                    <p style={styles.statNumber}>{stats.counts.portfolio_items}</p>
                    <span style={styles.statLabel}>Showcase & creatives</span>
                  </div>

                  <div style={styles.miniCard}>
                    <div style={styles.miniCardHeader}>
                      <Icon name="article" style={{ color: "#10B981" }} />
                      <h4 style={{ margin: 0 }}>Blogs</h4>
                    </div>
                    <p style={styles.statNumber}>{stats.counts.blogs}</p>
                    <span style={styles.statLabel}>Published posts</span>
                  </div>

                  <div style={styles.miniCard}>
                    <div style={styles.miniCardHeader}>
                      <Icon name="forum" style={{ color: "#ec4899" }} />
                      <h4 style={{ margin: 0 }}>WhatsApp Logs</h4>
                    </div>
                    <p style={styles.statNumber}>{stats.counts.whatsapp_logs || 0}</p>
                    <span style={styles.statLabel}>Dispatched alerts</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "pricing" && pricingData && (
            <div>
              <div style={styles.contentHeader}>
                <h2>Manage Pricing Packages</h2>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => addPricingPlan(selectedPriceCategory)} style={styles.addBtn}>
                    <Icon name="add" /> Add Plan
                  </button>
                  <button onClick={handleSavePricing} style={styles.saveBtn}>
                    <Icon name="save" /> Save Changes
                  </button>
                </div>
              </div>

              <div style={styles.infoBanner}>
                <Icon name="info" />
                <span>Any edits, additions, or deletions will only be permanently saved when you click the <strong>Save Changes</strong> button at the top right.</span>
              </div>

              {/* Selector tabs for price categories */}
              <div style={styles.tabRow}>
                <button
                  onClick={() => setSelectedPriceCategory("adsPlans")}
                  style={{ ...styles.tabSelectBtn, ...(selectedPriceCategory === "adsPlans" ? styles.tabSelectBtnActive : {}) }}
                >
                  Lead Campaigns
                </button>
                <button
                  onClick={() => setSelectedPriceCategory("websitePlans")}
                  style={{ ...styles.tabSelectBtn, ...(selectedPriceCategory === "websitePlans" ? styles.tabSelectBtnActive : {}) }}
                >
                  Websites
                </button>
                <button
                  onClick={() => setSelectedPriceCategory("creativePacks")}
                  style={{ ...styles.tabSelectBtn, ...(selectedPriceCategory === "creativePacks" ? styles.tabSelectBtnActive : {}) }}
                >
                  Creative Packs
                </button>
                <button
                  onClick={() => setSelectedPriceCategory("aiVideoPlans")}
                  style={{ ...styles.tabSelectBtn, ...(selectedPriceCategory === "aiVideoPlans" ? styles.tabSelectBtnActive : {}) }}
                >
                  AI Video
                </button>
              </div>

              {/* Edit forms list */}
              <div style={styles.formGrid}>
                {pricingData[selectedPriceCategory].map((plan, index) => (
                  <div key={index} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3>{plan.level || plan.platform || "Plan Level"}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <label style={styles.switchLabel}>
                          <input
                            type="checkbox"
                            checked={plan.isPopular || false}
                            onChange={(e) => updatePricingField(selectedPriceCategory, index, "isPopular", e.target.checked)}
                          />{" "}
                          Popular/Featured
                        </label>
                        <button onClick={() => deletePricingPlan(selectedPriceCategory, index)} style={styles.deleteBtnIcon}>
                          <Icon name="delete" />
                        </button>
                      </div>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Plan Title / Level</label>
                      <input
                        type="text"
                        value={plan.level || ""}
                        onChange={(e) => updatePricingField(selectedPriceCategory, index, "level", e.target.value)}
                        style={styles.input}
                      />
                    </div>

                    {plan.platform !== undefined && (
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Platform (e.g. Meta Ads)</label>
                        <input
                          type="text"
                          value={plan.platform || ""}
                          onChange={(e) => updatePricingField(selectedPriceCategory, index, "platform", e.target.value)}
                          style={styles.input}
                        />
                      </div>
                    )}

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Price (INR ₹)</label>
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => updatePricingField(selectedPriceCategory, index, "price", e.target.value)}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Billing Period / Cycle (e.g. /month, /3 months, /6 months)</label>
                      <input
                        type="text"
                        value={plan.period || ""}
                        onChange={(e) => updatePricingField(selectedPriceCategory, index, "period", e.target.value)}
                        placeholder="Leave blank for one-time payments"
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Features (Comma-separated)</label>
                      <textarea
                        rows={4}
                        value={
                          selectedPriceCategory === "adsPlans"
                            ? plan.features.join(", ")
                            : plan.features.map(f => f.text).join(", ")
                        }
                        onChange={(e) => updatePricingFeatures(selectedPriceCategory, index, e.target.value)}
                        style={styles.textarea}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "portfolio" && portfolioData && (
            <div>
              <div style={styles.contentHeader}>
                <h2>Manage Portfolio Showcase</h2>
                <button onClick={handleSavePortfolio} style={styles.saveBtn}>
                  <Icon name="save" /> Save Changes
                </button>
              </div>

              <div style={styles.infoBanner}>
                <Icon name="info" />
                <span>Any edits, additions, or deletions will only be permanently saved when you click the <strong>Save Changes</strong> button at the top right.</span>
              </div>

              {/* 1. SHOWCASE CAROUSEL ITEMS */}
              <div style={styles.portfolioSectionHeader}>
                <h3>Header Showcase Carousel</h3>
                <button onClick={addShowcaseItem} style={styles.addBtn}>
                  <Icon name="add" /> Add Showcase Item
                </button>
              </div>

              <div style={styles.formGrid}>
                {portfolioData.showcaseProjects.map((proj, idx) => (
                  <div key={idx} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h4>{proj.title || "Untitled"}</h4>
                      <button onClick={() => deleteShowcaseItem(idx)} style={styles.deleteBtn}>
                        <Icon name="delete" /> Delete
                      </button>
                    </div>

                    <div style={styles.inputRow}>
                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateShowcaseField(idx, "title", e.target.value)}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Category</label>
                        <input
                          type="text"
                          value={proj.category}
                          onChange={(e) => updateShowcaseField(idx, "category", e.target.value)}
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.inputRow}>
                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Industry</label>
                        <input
                          type="text"
                          value={proj.industry}
                          onChange={(e) => updateShowcaseField(idx, "industry", e.target.value)}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Metric (e.g. +142%)</label>
                        <input
                          type="text"
                          value={proj.metric}
                          onChange={(e) => updateShowcaseField(idx, "metric", e.target.value)}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Metric Label</label>
                        <input
                          type="text"
                          value={proj.metricLabel}
                          onChange={(e) => updateShowcaseField(idx, "metricLabel", e.target.value)}
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Description</label>
                      <textarea
                        value={proj.description}
                        onChange={(e) => updateShowcaseField(idx, "description", e.target.value)}
                        style={styles.textarea}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={proj.tags.join(", ")}
                        onChange={(e) => updateShowcaseTags(idx, e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. FEATURED PROJECTS BY INDUSTRY */}
              <div style={styles.portfolioSectionHeader}>
                <h3>Featured Work by Industry</h3>
              </div>

              {portfolioData.industries.map((ind, indIdx) => (
                <div key={indIdx} style={styles.industryBox}>
                  <div style={styles.industryTitleRow}>
                    <h4>{ind.name}</h4>
                    <button onClick={() => addFeaturedProject(indIdx)} style={styles.addBtnSmall}>
                      <Icon name="add" /> Add Project
                    </button>
                  </div>
                  <div style={styles.projectListGrid}>
                    {ind.projects.map((proj, projIdx) => (
                      <div key={projIdx} style={{ ...styles.projectItemCard, flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "10px", color: "#cbd5e1", fontWeight: "600", letterSpacing: "0.03em" }}>PROJECT TITLE</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateFeaturedProject(indIdx, projIdx, "title", e.target.value)}
                            style={styles.inputSmall}
                            placeholder="Enter project name..."
                          />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                            <label style={{ fontSize: "10px", color: "#cbd5e1", fontWeight: "600", letterSpacing: "0.03em" }}>CATEGORY</label>
                            <select
                              value={proj.type}
                              onChange={(e) => updateFeaturedProject(indIdx, projIdx, "type", e.target.value)}
                              style={styles.selectSmall}
                            >
                              <option value="Website & SEO">Website & SEO</option>
                              <option value="Campaigns">Campaigns</option>
                              <option value="AI Videos">AI Videos</option>
                              <option value="Creative Content">Creative Content</option>
                              <option value="Reels">Reels</option>
                            </select>
                          </div>
                          <button 
                            onClick={() => deleteFeaturedProject(indIdx, projIdx)} 
                            style={{ ...styles.deleteBtnIcon, marginTop: "14px", padding: "6px", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "4px" }}
                            title="Delete project"
                          >
                            <Icon name="delete" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 3. GENERAL / OTHER PROJECTS */}
              <div style={styles.portfolioSectionHeader}>
                <h3>General Other Projects</h3>
                <button onClick={addOtherProject} style={styles.addBtnSmall}>
                  <Icon name="add" /> Add Project
                </button>
              </div>

              <div style={styles.projectListGrid}>
                {portfolioData.otherProjects.map((proj, idx) => (
                  <div key={idx} style={{ ...styles.projectItemCard, flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "10px", color: "#cbd5e1", fontWeight: "600", letterSpacing: "0.03em" }}>PROJECT TITLE</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateOtherProject(idx, "title", e.target.value)}
                        style={styles.inputSmall}
                        placeholder="Enter project name..."
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                        <label style={{ fontSize: "10px", color: "#cbd5e1", fontWeight: "600", letterSpacing: "0.03em" }}>CATEGORY</label>
                        <select
                          value={proj.type}
                          onChange={(e) => updateOtherProject(idx, "type", e.target.value)}
                          style={styles.selectSmall}
                        >
                          <option value="Website & SEO">Website & SEO</option>
                          <option value="Campaigns">Campaigns</option>
                          <option value="AI Videos">AI Videos</option>
                          <option value="Creative Content">Creative Content</option>
                          <option value="Reels">Reels</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => deleteOtherProject(idx)} 
                        style={{ ...styles.deleteBtnIcon, marginTop: "14px", padding: "6px", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "4px" }}
                        title="Delete project"
                      >
                        <Icon name="delete" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4. CREATIVE MEDIA GRID GROUPS */}
              <div style={styles.portfolioSectionHeader}>
                <h3>Creative Grid Items</h3>
              </div>

              {portfolioData.creativeGroups.map((group, grpIdx) => (
                <div key={grpIdx} style={styles.industryBox}>
                  <div style={styles.industryTitleRow}>
                    <h4>{group.industry} Media</h4>
                    <button onClick={() => addCreativeMedia(grpIdx)} style={styles.addBtnSmall}>
                      <Icon name="add" /> Add Media File
                    </button>
                  </div>

                  <div style={styles.mediaGrid}>
                    {group.images.map((img, imgIdx) => (
                      <div key={imgIdx} style={styles.mediaCard}>
                        <div style={styles.mediaCardTop}>
                          <span style={styles.mediaTypeLabel}>{img.type}</span>
                          <button onClick={() => deleteCreativeMedia(grpIdx, imgIdx)} style={styles.deleteBtnIcon}>
                            <Icon name="delete" />
                          </button>
                        </div>

                        <div style={styles.inputGroupSmall}>
                          <label style={styles.labelSmall}>Title</label>
                          <input
                            type="text"
                            value={img.title}
                            onChange={(e) => updateCreativeMedia(grpIdx, imgIdx, "title", e.target.value)}
                            style={styles.inputSmall}
                          />
                        </div>

                        <div style={styles.inputGroupSmall}>
                          <label style={styles.labelSmall}>Media path / URL</label>
                          <input
                            type="text"
                            value={img.src}
                            onChange={(e) => updateCreativeMedia(grpIdx, imgIdx, "src", e.target.value)}
                            style={styles.inputSmall}
                          />
                        </div>

                        <div style={styles.inputGroupSmall}>
                          <label style={styles.labelSmall}>Description</label>
                          <textarea
                            rows={2}
                            value={img.description}
                            onChange={(e) => updateCreativeMedia(grpIdx, imgIdx, "description", e.target.value)}
                            style={styles.textareaSmall}
                          />
                        </div>

                        <div style={styles.inputGroupSmall}>
                          <label style={styles.labelSmall}>Media Type</label>
                          <select
                            value={img.type}
                            onChange={(e) => updateCreativeMedia(grpIdx, imgIdx, "type", e.target.value)}
                            style={styles.selectSmall}
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="reel">Reel</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "blogs" && (
            <div>
              {editingBlog === null ? (
                <div>
                  <div style={styles.contentHeader}>
                    <h2>Manage Blog Posts</h2>
                    <button onClick={handleCreateBlogClick} style={styles.saveBtn}>
                      <Icon name="add" /> Create Blog Post
                    </button>
                  </div>

                  {/* Import External Blogs Box */}
                  <div style={{ ...styles.card, marginBottom: "32px", border: "1px dashed rgba(253, 126, 20, 0.4)", backgroundColor: "rgba(253, 126, 20, 0.02)" }}>
                    <div style={styles.cardHeader}>
                      <h3 style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FD7E14", margin: 0 }}>
                        <Icon name="cloud_download" /> Import from External Blog Source
                      </h3>
                    </div>
                    <form onSubmit={handleImportBlogs} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                      <div style={styles.inputRow}>
                        <div style={styles.inputGroupFluid}>
                          <label style={styles.label}>Source Platform</label>
                          <select
                            value={importSourceType}
                            onChange={(e) => setImportSourceType(e.target.value)}
                            style={styles.select}
                          >
                            <option value="devto">Dev.to (by Username)</option>
                            <option value="rss">RSS Feed (Medium, WordPress, etc.)</option>
                          </select>
                        </div>
                        <div style={styles.inputGroupFluid}>
                          <label style={styles.label}>Default Category</label>
                          <select
                            value={importCategory}
                            onChange={(e) => setImportCategory(e.target.value)}
                            style={styles.select}
                          >
                            <option value="Marketing">Marketing</option>
                            <option value="SEO">SEO</option>
                            <option value="Web Development">Web Development</option>
                            <option value="AI Reels">AI Reels</option>
                            <option value="Agency Growth">Agency Growth</option>
                          </select>
                        </div>
                      </div>

                      <div style={styles.inputGroup}>
                        {importSourceType === "devto" ? (
                          <>
                            <label style={styles.label}>Dev.to Username</label>
                            <input
                              type="text"
                              value={importUsername}
                              onChange={(e) => setImportUsername(e.target.value)}
                              placeholder="e.g. nutlope"
                              style={styles.input}
                              required
                            />
                          </>
                        ) : (
                          <>
                            <label style={styles.label}>RSS Feed URL</label>
                            <input
                              type="url"
                              value={importFeedUrl}
                              onChange={(e) => setImportFeedUrl(e.target.value)}
                              placeholder="e.g. https://medium.com/feed/tag/technology"
                              style={styles.input}
                              required
                            />
                          </>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isImporting}
                        style={{
                          ...styles.saveBtn,
                          alignSelf: "flex-start",
                          backgroundColor: "#FD7E14",
                          opacity: isImporting ? 0.7 : 1,
                        }}
                      >
                        {isImporting ? (
                          <>Importing...</>
                        ) : (
                          <>
                            <Icon name="cloud_download" /> Sync & Import
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div style={styles.blogListGrid}>
                    {blogsData.map((blog) => (
                      <div key={blog.id} style={styles.blogAdminCard}>
                        <div>
                          <div style={styles.blogMetaRow}>
                            <span style={styles.blogCategoryTag}>{blog.category}</span>
                            <span style={blog.published ? styles.blogPublishedTag : styles.blogDraftTag}>
                              {blog.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <h3 style={styles.blogAdminTitle}>{blog.title}</h3>
                          <p style={styles.blogAdminExcerpt}>{blog.excerpt}</p>
                        </div>

                        <div style={styles.blogAdminActionRow}>
                          <button onClick={() => handleEditBlogClick(blog)} style={styles.editBtnSmall}>
                            <Icon name="edit" /> Edit
                          </button>
                          <button onClick={() => handleDeleteBlog(blog.id)} style={styles.deleteBtnIconOnly}>
                            <Icon name="delete" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={styles.contentHeader}>
                    <h2>{editingBlog === "new" ? "Create New Blog Post" : "Edit Blog Post"}</h2>
                    <button onClick={() => setEditingBlog(null)} style={styles.cancelBtn}>
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveBlog} style={styles.blogFormContainer}>
                    <div style={styles.inputRow}>
                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Title</label>
                        <input
                          type="text"
                          value={blogForm.title}
                          onChange={handleBlogTitleChange}
                          placeholder="How AI is changing marketing..."
                          style={styles.input}
                          required
                        />
                      </div>

                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Slug URL path</label>
                        <input
                          type="text"
                          value={blogForm.slug}
                          onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                          placeholder="how-ai-is-changing-marketing"
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.inputRow}>
                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Category</label>
                        <select
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          style={styles.select}
                        >
                          <option value="Marketing">Marketing</option>
                          <option value="SEO">SEO</option>
                          <option value="Web Development">Web Development</option>
                          <option value="AI Reels">AI Reels</option>
                          <option value="Agency Growth">Agency Growth</option>
                        </select>
                      </div>

                      <div style={styles.inputGroupFluid}>
                        <label style={styles.label}>Cover Image path</label>
                        <input
                          type="text"
                          value={blogForm.coverImage}
                          onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                          placeholder="/creative_content/Creative1.jpeg"
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Excerpt (Summary)</label>
                      <input
                        type="text"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        placeholder="A short summary of the blog post details..."
                        style={styles.input}
                        required
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Content Markdown Body (or paste External Redirect URL e.g. https://medium.com/...)</label>
                      <textarea
                        rows={12}
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="Paste the redirect URL (e.g. https://medium.com/@username/title) or type the Markdown body..."
                        style={styles.textarea}
                        required
                      />
                    </div>

                    <div style={styles.checkboxGroup}>
                      <label style={styles.switchLabel}>
                        <input
                          type="checkbox"
                          checked={blogForm.published}
                          onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                        />{" "}
                        Publish immediately
                      </label>
                    </div>

                    <button type="submit" style={styles.saveBtn}>
                      <Icon name="save" /> Save Post
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === "whatsapp" && (
            <div>
              <div style={styles.contentHeader}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0 }}>WhatsApp Automation Panel</h2>
                  <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>Configure provider keys, test delivery, and review notification logs</p>
                </div>
                <button onClick={loadWhatsAppInfo} style={styles.refreshBtn}>
                  <Icon name="refresh" /> Refresh Logs & Status
                </button>
              </div>

              {/* Status & Test Form Grid */}
              <div style={styles.overviewGrid}>
                
                {/* Configuration details */}
                <div style={styles.statusCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={{ margin: 0, fontSize: "18px" }}>Active Connection</h3>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: whatsappData.config?.provider !== "none" ? "rgba(16, 185, 129, 0.15)" : "rgba(253, 126, 20, 0.15)",
                      color: whatsappData.config?.provider !== "none" ? "#10B981" : "#FD7E14",
                      border: `1px solid ${whatsappData.config?.provider !== "none" ? "rgba(16, 185, 129, 0.3)" : "rgba(253, 126, 20, 0.3)"}`
                    }}>
                      {whatsappData.config?.provider ? whatsappData.config.provider.toUpperCase() : "NONE (SANDBOX)"}
                    </span>
                  </div>
                  <p style={styles.cardDesc}>
                    Dynamic routing configuration based on server-side `.env` variables. Fallback is set to sandbox console logging if no API keys are provided.
                  </p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                      <span style={{ color: "#94a3b8" }}>Admin Recipient Phone Number:</span>
                      <span style={{ fontWeight: "600" }}>+{whatsappData.config?.adminNumber || "N/A"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                      <span style={{ color: "#94a3b8" }}>Meta Cloud API status:</span>
                      <span style={{ fontWeight: "600", color: whatsappData.config?.meta?.configured ? "#10B981" : "#ef4444" }}>
                        {whatsappData.config?.meta?.configured ? "Configured" : "Not Set"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                      <span style={{ color: "#94a3b8" }}>Twilio WhatsApp status:</span>
                      <span style={{ fontWeight: "600", color: whatsappData.config?.twilio?.configured ? "#10B981" : "#ef4444" }}>
                        {whatsappData.config?.twilio?.configured ? `Configured (From: ${whatsappData.config.twilio.from})` : "Not Set"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "#94a3b8" }}>UltraMsg HTTP status:</span>
                      <span style={{ fontWeight: "600", color: whatsappData.config?.ultramsg?.configured ? "#10B981" : "#ef4444" }}>
                        {whatsappData.config?.ultramsg?.configured ? "Configured" : "Not Set"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Message Sender Form */}
                <div style={styles.statusCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={{ margin: 0, fontSize: "18px" }}>Dispatch Test WhatsApp</h3>
                  </div>
                  <p style={styles.cardDesc}>Send manual notification test to verify webhook routing and network credentials.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                    <div style={styles.inputGroupSmall}>
                      <label style={styles.labelSmall}>Recipient Number (e.g. 919096090701)</label>
                      <input
                        type="text"
                        value={testRecipient}
                        onChange={(e) => setTestRecipient(e.target.value)}
                        placeholder="Country code + phone"
                        style={styles.inputSmall}
                      />
                    </div>
                    <div style={styles.inputGroupSmall}>
                      <label style={styles.labelSmall}>Message Body</label>
                      <textarea
                        rows={2}
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="Type test message body..."
                        style={styles.textareaSmall}
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!testRecipient || !testMessage) {
                          showToast("Please fill in all manual test fields.", "error");
                          return;
                        }
                        setIsTestSending(true);
                        try {
                          const res = await fetch("/api/admin/whatsapp", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ recipient: testRecipient, message: testMessage })
                          });
                          const resData = await res.json();
                          if (resData.success) {
                            showToast(resData.message || "Message dispatched successfully!");
                            setTestMessage("");
                            loadWhatsAppInfo();
                          } else {
                            showToast(resData.error || "Failed to dispatch message.", "error");
                          }
                        } catch (err) {
                          showToast("Network dispatch error.", "error");
                        } finally {
                          setIsTestSending(false);
                        }
                      }}
                      disabled={isTestSending}
                      style={{
                        ...styles.actionBtn,
                        backgroundColor: "#FD7E14",
                        color: "#fff",
                        border: "none",
                        marginTop: "4px"
                      }}
                    >
                      <Icon name="send" /> {isTestSending ? "Dispatching..." : "Send Message"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Delivery logs list */}
              <div style={{ ...styles.portfolioSectionHeader, marginTop: "40px" }}>
                <h3>Recent Delivery Notification Logs</h3>
                <span style={{ fontSize: "12px", color: whatsappData.dbConnected ? "#10B981" : "#ef4444" }}>
                  {whatsappData.dbConnected ? "Database Storage Online" : "Database Offline (No logs history saved)"}
                </span>
              </div>

              <div style={{ overflowX: "auto", marginTop: "16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}>
                      <th style={{ padding: "12px 8px" }}>ID</th>
                      <th style={{ padding: "12px 8px" }}>Recipient</th>
                      <th style={{ padding: "12px 8px" }}>Message</th>
                      <th style={{ padding: "12px 8px" }}>Provider</th>
                      <th style={{ padding: "12px 8px" }}>Status</th>
                      <th style={{ padding: "12px 8px" }}>Error Info</th>
                      <th style={{ padding: "12px 8px" }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whatsappData.logs && whatsappData.logs.length > 0 ? (
                      whatsappData.logs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "10px 8px", fontFamily: "monospace", color: "#94a3b8" }}>{log.id}</td>
                          <td style={{ padding: "10px 8px", fontWeight: "600" }}>+{log.recipient}</td>
                          <td style={{ padding: "10px 8px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={log.message}>
                            {log.message}
                          </td>
                          <td style={{ padding: "10px 8px" }}>
                            <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#94a3b8" }}>{log.provider}</span>
                          </td>
                          <td style={{ padding: "10px 8px" }}>
                            <span style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "600",
                              backgroundColor: log.status === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                              color: log.status === "success" ? "#10B981" : "#ef4444"
                            }}>
                              {log.status}
                            </span>
                          </td>
                          <td style={{ padding: "10px 8px", color: "#f87171", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={log.error || ""}>
                            {log.error || "-"}
                          </td>
                          <td style={{ padding: "10px 8px", color: "#94a3b8" }}>
                            {new Date(log.created_at).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ padding: "20px 8px", textAlign: "center", color: "#94a3b8" }}>
                          No notification dispatch logs recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  loginContainer: {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    padding: "20px",
    fontFamily: "Inter, sans-serif"
  },
  loginCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "40px 32px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
    justifyContent: "center"
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(to top right, #3B82F6, #FD7E14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "800",
    fontSize: "12px"
  },
  logoText: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.025em"
  },
  loginSubtitle: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "28px"
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  inputGroupFluid: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1
  },
  label: {
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "600"
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s"
  },
  textarea: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit"
  },
  select: {
    backgroundColor: "rgba(9, 13, 22, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none"
  },
  errorAlert: {
    color: "#f87171",
    fontSize: "12px",
    textAlign: "center"
  },
  loginButton: {
    backgroundColor: "#FD7E14",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    padding: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s"
  },
  adminWrapper: {
    minHeight: "100vh",
    backgroundColor: "#090d16",
    color: "#f8fafc",
    fontFamily: "Inter, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(10px)"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  headerTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: 0,
    lineHeight: "1.2"
  },
  headerSubtitle: {
    fontSize: "11px",
    color: "#94a3b8"
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#cbd5e1",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    minHeight: "calc(100vh - 69px)"
  },
  sidebar: {
    padding: "24px 16px",
    borderRight: "1px solid rgba(255, 255, 255, 0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  sidebarBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "#94a3b8",
    padding: "10px 14px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px"
  },
  sidebarBtnActive: {
    backgroundColor: "rgba(253, 126, 20, 0.15)",
    color: "#FD7E14"
  },
  content: {
    padding: "32px 40px",
    overflowY: "auto",
    maxHeight: "calc(100vh - 69px)"
  },
  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#3B2FC9",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px"
  },
  cancelBtn: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#cbd5e1",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },
  tabRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px"
  },
  tabSelectBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.08)",
    color: "#94a3b8",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },
  tabSelectBtnActive: {
    backgroundColor: "#fff",
    color: "#0f172a",
    borderColor: "#fff"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
    marginBottom: "32px"
  },
  infoBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "rgba(253, 126, 20, 0.08)",
    border: "1px solid rgba(253, 126, 20, 0.25)",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "24px",
    fontSize: "13px",
    color: "#e2e8f0"
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  switchLabel: {
    fontSize: "12px",
    color: "#cbd5e1",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  toast: {
    position: "fixed",
    top: "24px",
    right: "24px",
    zIndex: 9999,
    padding: "12px 24px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  portfolioSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
    marginBottom: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "8px"
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#FD7E14",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
  },
  addBtnSmall: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#cbd5e1",
    padding: "4px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "600"
  },
  deleteBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "transparent",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    color: "#ef4444",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px"
  },
  inputRow: {
    display: "flex",
    gap: "16px"
  },
  industryBox: {
    backgroundColor: "rgba(255,255,255,0.01)",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px"
  },
  industryTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  projectListGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "12px"
  },
  projectItemCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "6px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  inputSmall: {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "4px",
    padding: "6px 10px",
    color: "#fff",
    fontSize: "12px",
    outline: "none",
    flex: 1
  },
  textareaSmall: {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "4px",
    padding: "6px 10px",
    color: "#fff",
    fontSize: "12px",
    outline: "none",
    width: "100%",
    fontFamily: "inherit"
  },
  selectSmall: {
    backgroundColor: "rgba(9, 13, 22, 0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "4px",
    padding: "6px",
    color: "#fff",
    fontSize: "12px",
    outline: "none"
  },
  deleteBtnIcon: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px"
  },
  mediaCard: {
    backgroundColor: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  mediaCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  mediaTypeLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    backgroundColor: "#3B2FC9",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "700"
  },
  inputGroupSmall: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  labelSmall: {
    fontSize: "10px",
    color: "#94a3b8"
  },
  blogListGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px"
  },
  blogAdminCard: {
    backgroundColor: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "16px"
  },
  blogMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px"
  },
  blogCategoryTag: {
    fontSize: "10px",
    color: "#FD7E14",
    fontWeight: "600",
    textTransform: "uppercase"
  },
  blogPublishedTag: {
    fontSize: "10px",
    color: "#10B981",
    fontWeight: "600"
  },
  blogDraftTag: {
    fontSize: "10px",
    color: "#f59e0b",
    fontWeight: "600"
  },
  blogAdminTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px"
  },
  blogAdminExcerpt: {
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.4"
  },
  blogAdminActionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: "12px",
    marginTop: "8px"
  },
  editBtnSmall: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "600"
  },
  deleteBtnIconOnly: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },
  blogFormContainer: {
    backgroundColor: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center"
  },
  glowSphere1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
    top: "10%",
    left: "10%",
    zIndex: 0,
    pointerEvents: "none"
  },
  glowSphere2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(253, 126, 20, 0.12) 0%, rgba(0, 0, 0, 0) 70%)",
    bottom: "10%",
    right: "10%",
    zIndex: 0,
    pointerEvents: "none"
  },
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "24px",
    marginTop: "20px"
  },
  statusCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backdropFilter: "blur(12px)"
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase"
  },
  cardDesc: {
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: "1.5"
  },
  databaseActions: {
    marginTop: "auto"
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#3B2FC9",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    width: "100%",
    transition: "background-color 0.2s"
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#cbd5e1",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },
  statsSummaryGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  miniCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backdropFilter: "blur(12px)"
  },
  miniCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "600"
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    margin: 0
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b"
  }
};
