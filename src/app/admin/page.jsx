"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Admin.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("leads");

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // State
  const [leads, setLeads] = useState([]);
  const [leadFilter, setLeadFilter] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({
    siteTitle: "Nilesh Kute - Home Loan Consultant",
    phone: "8356008675",
    whatsapp: "918356008675",
    email: "nileshkute43@gmail.com",
    address: "Belapur, Navi Mumbai",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com/@nileshkute",
    heroHeadline: "Your Home Loan, Guided by an Expert.",
    aboutHeading: "Experienced Home Loan Consultant You Can Trust",
    // SEO
    metaHomeTitle: "Nilesh Kute | Expert Home Loan Consultant in Belapur",
    metaHomeDesc: "Get personalized guidance for Home Loans, Balance Transfer, Top-Up Loans, and more with Nilesh Kute.",
    metaHomeKeywords: "Home loan consultant Belapur, Home loan expert, Balance transfer, LAP",
    metaServicesTitle: "Loan Services | Nilesh Kute",
    metaServicesDesc: "Explore our range of loan services including Home Loans, Balance Transfers, Top-Up Loans, LAP, Personal Loans, and Business Loans.",
    metaContactTitle: "Contact Nilesh Kute | Home Loan Consultant",
    metaContactDesc: "Get in touch with Nilesh Kute for expert home loan guidance. Call, WhatsApp, or email for a free consultation."
  });

  // Blog Form
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    category: "Home Loan",
    excerpt: "",
    content: "",
    slug: "",
    imageUrl: ""
  });

  // Notifications
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    const session = localStorage.getItem("nilesh_admin_logged_in");
    if (session === "true") {
      setIsLoggedIn(true);
      fetchLeads();
      fetchBlogs();
      fetchImages();
      fetchSettings();
      fetchTestimonials();
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    const user = username.trim().toLowerCase();
    const pass = password.trim();

    if ((user === "admin" || user === "nilesh") && (pass === "admin123" || pass === "admin" || pass === "nilesh123")) {
      localStorage.setItem("nilesh_admin_logged_in", "true");
      setIsLoggedIn(true);
      showToast("Welcome! Logged in successfully.");
      fetchLeads();
      fetchBlogs();
      fetchImages();
      fetchSettings();
      fetchTestimonials();
    } else {
      setLoginError("Invalid Username or Password. Please try again.");
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("nilesh_admin_logged_in");
    setIsLoggedIn(false);
    showToast("Logged out successfully.");
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) setLeads(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`/api/blogs?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) setBlogs(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/upload");
      if (res.ok) setImages(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/settings?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      }
    } catch (e) { console.error(e); }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`/api/testimonials?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) setTestimonials(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm("Are you sure you want to delete this customer review?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Review deleted successfully!");
        fetchTestimonials();
      }
    } catch (e) { console.error(e); }
  };

  // Lead actions
  const handleUpdateLeadStatus = async (id, status, notes) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes })
      });
      if (res.ok) {
        showToast("Lead status updated!");
        fetchLeads();
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Lead deleted!");
        fetchLeads();
      }
    } catch (e) { console.error(e); }
  };

  // Blog actions
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const method = editingBlog ? "PUT" : "POST";
      const payload = editingBlog ? { ...blogForm, id: editingBlog.id } : blogForm;
      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast(editingBlog ? "Blog updated successfully!" : "Blog created successfully!");
        setBlogForm({ title: "", category: "Home Loan", excerpt: "", content: "", slug: "", imageUrl: "" });
        setEditingBlog(null);
        fetchBlogs();
      } else {
        showToast(data.error || "Failed to save blog.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error saving blog.");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Blog post deleted!");
        fetchBlogs();
      }
    } catch (e) { console.error(e); }
  };

  // Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        showToast("Image uploaded successfully!");
        fetchImages();
      }
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const handleDeleteImage = async (filename) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast("Image deleted successfully!");
        fetchImages();
      } else {
        showToast("Failed to delete image.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error deleting image.");
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showToast("Settings saved successfully! Refresh your website tab to see changes.");
        fetchSettings();
      }
    } catch (e) { console.error(e); }
  };

  // Backup & Restore
  const handleRestoreBackup = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json)
      });
      if (res.ok) {
        showToast("Database restored successfully!");
        fetchLeads();
        fetchBlogs();
        fetchSettings();
      }
    } catch (err) {
      showToast("Invalid backup JSON file!");
    }
  };

  const handleExportPDFBackup = () => {
    try {
      showToast("Generating PDF report...");
      const doc = new jsPDF();

      // Top Navy Header Banner
      doc.setFillColor(7, 26, 61); // Navy #071A3D
      doc.rect(0, 0, 210, 32, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("NILESH KUTE", 14, 15);

      doc.setTextColor(217, 166, 46); // Gold #D9A62E
      doc.setFontSize(10);
      doc.text("Home Loan Consultancy — Customer Leads Report", 14, 23);

      const dateStr = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${dateStr}`, 196, 15, { align: "right" });
      doc.text(`Total Records: ${leads.length}`, 196, 23, { align: "right" });

      // Summary Statistics Box
      let startY = 40;
      doc.setFillColor(248, 250, 252);
      doc.rect(14, startY, 182, 16, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, startY, 182, 16, "S");

      doc.setTextColor(7, 26, 61);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");

      const newCount = leads.filter(l => (l.status || "New") === "New").length;
      const approvedCount = leads.filter(l => l.status === "Approved").length;

      doc.text(`Total Leads: ${leads.length}`, 20, startY + 10);
      doc.text(`New Inquiries: ${newCount}`, 82, startY + 10);
      doc.text(`Approved Loans: ${approvedCount}`, 145, startY + 10);

      // Customer Leads Table
      const tableColumn = ["Date", "Customer Name", "Mobile", "Email", "Loan Type", "Status", "Notes"];
      const tableRows = leads.map(l => [
        l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-IN") : "—",
        l.name || "—",
        l.phone || "—",
        l.email || "—",
        l.loanType || "—",
        l.status || "New",
        l.notes || "—"
      ]);

      autoTable(doc, {
        startY: startY + 22,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: {
          fillColor: [7, 26, 61],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [30, 41, 59]
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        styles: {
          cellPadding: 3,
          overflow: "linebreak"
        }
      });

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Confidential Customer Data Report • Nilesh Kute Home Loan Consultancy • Belapur, Navi Mumbai", 105, finalY + 15, { align: "center" });

      const filename = `nileshkute_customer_leads_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(filename);
      showToast("PDF report downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      showToast("Error generating PDF report.");
    }
  };

  const filteredLeads = leadFilter === "All" ? leads : leads.filter(l => l.status === leadFilter);

  const statusColors = {
    New: { bg: "#e0f2fe", color: "#0284c7" },
    Contacted: { bg: "#fef3c7", color: "#b45309" },
    "Follow-up": { bg: "#fde8d8", color: "#c2410c" },
    Approved: { bg: "#dcfce7", color: "#16a34a" },
    Rejected: { bg: "#fee2e2", color: "#dc2626" },
  };

  if (isCheckingAuth) {
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "#071A3D", fontWeight: "600" }}>
        Checking authentication...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{
        maxWidth: "440px",
        margin: "40px auto",
        background: "#FFFFFF",
        borderRadius: "14px",
        boxShadow: "0 20px 40px rgba(7, 26, 61, 0.12), 0 1px 3px rgba(0,0,0,0.05)",
        border: "1px solid #E2E8F0",
        overflow: "hidden"
      }}>
        {/* Top Accent Line */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, #071A3D 0%, #D9A62E 100%)" }} />

        <div style={{ padding: "40px 35px 35px 35px" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #071A3D 0%, #0c285e 100%)",
              color: "#D9A62E",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              margin: "0 auto 16px auto",
              boxShadow: "0 8px 20px rgba(7, 26, 61, 0.2)"
            }}>
              🔐
            </div>
            <h2 style={{ color: "#071A3D", fontSize: "1.6rem", margin: 0, fontWeight: "800", letterSpacing: "-0.5px" }}>
              Admin Portal
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.88rem", marginTop: "6px" }}>
              Nilesh Kute Home Loan Consultancy
            </p>
          </div>

          {loginError && (
            <div style={{
              background: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FCA5A5",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "0.88rem",
              marginBottom: "22px",
              fontWeight: "600",
              textAlign: "center"
            }}>
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "#1E293B", marginBottom: "7px" }}>
                Username / Admin ID
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your admin ID"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #CBD5E1",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  color: "#0F172A",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ marginBottom: "26px" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", color: "#1E293B", marginBottom: "7px" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #CBD5E1",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  color: "#0F172A",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #071A3D 0%, #0c285e 100%)",
                color: "#D9A62E",
                border: "none",
                padding: "14px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(7, 26, 61, 0.25)",
                letterSpacing: "0.5px"
              }}
            >
              Sign In to Dashboard →
            </button>
          </form>

          <div style={{
            marginTop: "28px",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#94A3B8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}>
            <span>🛡️</span> Protected Authorized Access Only
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {toast && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "#071A3D",
          color: "#D9A62E",
          padding: "12px 24px",
          borderRadius: "6px",
          fontWeight: "600",
          zIndex: 9999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}>
          {toast}
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px", borderBottom: "2px solid #E2E8F0", paddingBottom: "10px" }}>
        {/* Desktop Tab Navigation */}
        <div className={styles.desktopTabNav}>
          {[
            { id: "leads", label: "📊 Lead Management", count: leads.length },
            { id: "blogs", label: "📝 Blog Management", count: blogs.length },
            { id: "reviews", label: "⭐ Reviews", count: testimonials.length },
            { id: "editor", label: "✏️ Page Editor" },
            { id: "seo", label: "🔍 SEO Settings" },
            { id: "backup", label: "📄 PDF Export" }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown Navigation */}
        <div className={styles.mobileTabSelectWrapper}>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className={styles.mobileTabSelect}
          >
            <option value="leads">📊 Lead Management ({leads.length})</option>
            <option value="blogs">📝 Blog Management ({blogs.length})</option>
            <option value="reviews">⭐ Customer Reviews ({testimonials.length})</option>
            <option value="editor">✏️ Page Editor</option>
            <option value="seo">🔍 SEO Settings</option>
            <option value="backup">📄 PDF Export</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleLogoutClick}
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fca5a5",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "0.85rem",
            transform: "none",
            boxShadow: "none"
          }}
        >
          🔒 Logout
        </button>
      </div>

      {/* 1. LEAD MANAGEMENT */}
      {activeTab === "leads" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2 style={{ color: "#071A3D", margin: 0 }}>Lead Management</h2>
              <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Manage customer loan inquiries and update follow-up statuses.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontWeight: "700", fontSize: "0.88rem", color: "#071A3D", whiteSpace: "nowrap" }}>
                Filter Status:
              </label>
              <select
                value={leadFilter}
                onChange={(e) => setLeadFilter(e.target.value)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #071A3D",
                  backgroundColor: "#071A3D",
                  color: "#D9A62E",
                  fontWeight: "700",
                  fontSize: "0.88rem",
                  outline: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(7, 26, 61, 0.12)"
                }}
              >
                <option value="All" style={{ background: "#fff", color: "#071A3D" }}>All Leads ({leads.length})</option>
                <option value="New" style={{ background: "#fff", color: "#0284c7" }}>New ({leads.filter(l => l.status === "New").length})</option>
                <option value="Contacted" style={{ background: "#fff", color: "#b45309" }}>Contacted ({leads.filter(l => l.status === "Contacted").length})</option>
                <option value="Follow-up" style={{ background: "#fff", color: "#c2410c" }}>Follow-up ({leads.filter(l => l.status === "Follow-up").length})</option>
                <option value="Approved" style={{ background: "#fff", color: "#16a34a" }}>Approved ({leads.filter(l => l.status === "Approved").length})</option>
                <option value="Rejected" style={{ background: "#fff", color: "#dc2626" }}>Rejected ({leads.filter(l => l.status === "Rejected").length})</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "950px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                  <th style={{ padding: "12px" }}>Date</th>
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Contact</th>
                  <th style={{ padding: "12px" }}>Loan Type</th>
                  <th style={{ padding: "12px" }}>Source</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px" }}>Notes</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>
                      No leads found in this filter category.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "12px", fontSize: "0.85rem", color: "#64748B" }}>
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td style={{ padding: "12px", fontWeight: "600", color: "#071A3D" }}>{lead.name}</td>
                      <td style={{ padding: "12px", fontSize: "0.9rem" }}>
                        <a href={`tel:${lead.phone}`} style={{ color: "#D9A62E", fontWeight: "600" }}>📞 {lead.phone}</a>
                        {lead.email && <div style={{ fontSize: "0.8rem", color: "#64748B" }}>✉️ {lead.email}</div>}
                      </td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{lead.loanType}</td>
                      <td style={{ padding: "12px", fontSize: "0.85rem", color: "#64748B" }}>{lead.source || "Website"}</td>
                      <td style={{ padding: "12px" }}>
                        <select
                          value={lead.status || "New"}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value, lead.notes)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "15px",
                            border: "none",
                            background: (statusColors[lead.status] || statusColors.New).bg,
                            color: (statusColors[lead.status] || statusColors.New).color,
                            fontWeight: "700",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td style={{ padding: "12px", maxWidth: "200px" }}>
                        <input
                          type="text"
                          defaultValue={lead.notes || ""}
                          placeholder="Add notes..."
                          onBlur={(e) => handleUpdateLeadStatus(lead.id, lead.status, e.target.value)}
                          style={{
                            width: "100%",
                            padding: "6px",
                            border: "1px solid #CBD5E1",
                            borderRadius: "4px",
                            fontSize: "0.85rem"
                          }}
                        />
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.8rem",
                            transform: "none"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. BLOG MANAGEMENT */}
      {activeTab === "blogs" && (
        <div>
          <h2 style={{ color: "#071A3D", marginBottom: "5px" }}>Blog Management</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "25px" }}>Publish, edit, and manage loan guidance articles.</p>

          <form onSubmit={handleSaveBlog} style={{ background: "#F8FAFC", padding: "25px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ color: "#071A3D", marginBottom: "15px" }}>
              {editingBlog ? "Edit Article" : "Add New Blog Article"}
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Title *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g., How to Improve Your CIBIL Score"
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
                />
              </div>
              <div>
                <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Category</label>
                <select
                  value={blogForm.category}
                  onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
                >
                  <option value="Home Loan">Home Loan</option>
                  <option value="Balance Transfer">Balance Transfer</option>
                  <option value="CIBIL Score">CIBIL Score</option>
                  <option value="EMI Tips">EMI Tips</option>
                  <option value="Loan Documents">Loan Documents</option>
                  <option value="Government Schemes">Government Schemes</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Featured Cover Image URL</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={blogForm.imageUrl || ""}
                  onChange={e => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                  placeholder="e.g. /uploads/banner.jpg or https://..."
                  style={{ flex: 1, minWidth: "220px", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
                />
                <label style={{
                  background: "#071A3D",
                  color: "#D9A62E",
                  padding: "10px 16px",
                  borderRadius: "4px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}>
                  📷 Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                        const data = await res.json();
                        if (data.url) {
                          setBlogForm({ ...blogForm, imageUrl: data.url });
                          showToast("Cover image uploaded!");
                        }
                      } catch (err) {
                        showToast("Failed to upload image.");
                      }
                    }}
                  />
                </label>
              </div>
              {blogForm.imageUrl && (
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={blogForm.imageUrl} alt="Preview" style={{ height: "70px", borderRadius: "6px", objectFit: "cover", border: "1px solid #CBD5E1" }} />
                  <button
                    type="button"
                    onClick={() => setBlogForm({ ...blogForm, imageUrl: "" })}
                    style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Excerpt (Short Summary) *</label>
              <textarea
                rows={2}
                required
                value={blogForm.excerpt}
                onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                placeholder="Short 2-sentence summary of article..."
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Full Content *</label>
              <textarea
                rows={6}
                required
                value={blogForm.content}
                onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                placeholder="Write full article body content..."
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ background: "#071A3D", color: "#D9A62E", fontWeight: "700", padding: "10px 20px", borderRadius: "4px", border: "none", cursor: "pointer" }}>
                {editingBlog ? "Update Article" : "Publish Article"}
              </button>
              {editingBlog && (
                <button
                  type="button"
                  onClick={() => { setEditingBlog(null); setBlogForm({ title: "", category: "Home Loan", excerpt: "", content: "", slug: "", imageUrl: "" }); }}
                  style={{ background: "#E2E8F0", color: "#475569", padding: "10px 20px", borderRadius: "4px", border: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List Blogs */}
          <div style={{ display: "grid", gap: "15px" }}>
            {blogs.map(b => (
              <div key={b.id} style={{ background: "white", border: "1px solid #E2E8F0", padding: "20px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  {b.imageUrl && (
                    <img src={b.imageUrl} alt={b.title} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px" }} />
                  )}
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#D9A62E", fontWeight: "700" }}>{b.category}</span>
                    <h4 style={{ margin: "5px 0", color: "#071A3D" }}>{b.title}</h4>
                    <p style={{ color: "#64748B", fontSize: "0.85rem", margin: 0 }}>{b.excerpt}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => { setEditingBlog(b); setBlogForm({ title: b.title, category: b.category, excerpt: b.excerpt, content: b.content, slug: b.slug, imageUrl: b.imageUrl || "" }); }}
                    style={{ background: "#e0f2fe", color: "#0284c7", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlog(b.id)}
                    style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PAGE EDITOR */}
      {activeTab === "editor" && (
        <form onSubmit={handleSaveSettings}>
          <h2 style={{ color: "#071A3D", marginBottom: "5px" }}>Page Content Editor</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "25px" }}>Edit key website headings, contact details, and text blocks.</p>

          <div className={styles.formGrid2}>
            <div>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Phone Number</label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
            <div>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={settings.whatsapp || ""}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
          </div>

          <div className={styles.formGrid2}>
            <div>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Email Address</label>
              <input
                type="email"
                value={settings.email || ""}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
            <div>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Office Location / Address</label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Hero Main Headline</label>
            <input
              type="text"
              value={settings.heroHeadline || ""}
              onChange={e => setSettings({ ...settings, heroHeadline: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>About Page Main Heading</label>
            <input
              type="text"
              value={settings.aboutHeading || ""}
              onChange={e => setSettings({ ...settings, aboutHeading: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
            />
          </div>

          <div style={{ marginBottom: "25px", background: "#F8FAFC", padding: "20px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ color: "#071A3D", marginBottom: "15px" }}>Social Media Links</h3>
            <div className={styles.formGrid3}>
              <div>
                <label style={{ fontWeight: "600", fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>Facebook URL</label>
                <input
                  type="url"
                  value={settings.facebookUrl || ""}
                  onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
                />
              </div>
              <div>
                <label style={{ fontWeight: "600", fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>Instagram URL</label>
                <input
                  type="url"
                  value={settings.instagramUrl || ""}
                  onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/..."
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
                />
              </div>
              <div>
                <label style={{ fontWeight: "600", fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>YouTube URL</label>
                <input
                  type="url"
                  value={settings.youtubeUrl || ""}
                  onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@nileshkute"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
                />
              </div>
            </div>
          </div>

          <button type="submit" style={{ background: "#071A3D", color: "#D9A62E", fontWeight: "700", padding: "12px 24px", borderRadius: "4px", border: "none", cursor: "pointer" }}>
            Save Page Content
          </button>
        </form>
      )}

      {/* 5. SEO SETTINGS */}
      {activeTab === "seo" && (
        <form onSubmit={handleSaveSettings}>
          <h2 style={{ color: "#071A3D", marginBottom: "5px" }}>SEO & Meta Settings</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "25px" }}>Optimize search engine title tags, meta descriptions, and keywords.</p>

          {/* Home SEO */}
          <div style={{ background: "#F8FAFC", padding: "20px", borderRadius: "6px", marginBottom: "20px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ color: "#071A3D", marginBottom: "15px" }}>Homepage SEO</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>Meta Title</label>
              <input
                type="text"
                value={settings.metaHomeTitle || ""}
                onChange={e => setSettings({ ...settings, metaHomeTitle: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>Meta Description</label>
              <textarea
                rows={2}
                value={settings.metaHomeDesc || ""}
                onChange={e => setSettings({ ...settings, metaHomeDesc: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
            <div>
              <label style={{ fontWeight: "600", fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>Meta Keywords</label>
              <input
                type="text"
                value={settings.metaHomeKeywords || ""}
                onChange={e => setSettings({ ...settings, metaHomeKeywords: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
          </div>

          {/* Services SEO */}
          <div style={{ background: "#F8FAFC", padding: "20px", borderRadius: "6px", marginBottom: "20px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ color: "#071A3D", marginBottom: "15px" }}>Services Page SEO</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>Meta Title</label>
              <input
                type="text"
                value={settings.metaServicesTitle || ""}
                onChange={e => setSettings({ ...settings, metaServicesTitle: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
            <div>
              <label style={{ fontWeight: "600", fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>Meta Description</label>
              <textarea
                rows={2}
                value={settings.metaServicesDesc || ""}
                onChange={e => setSettings({ ...settings, metaServicesDesc: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />
            </div>
          </div>

          <button type="submit" style={{ background: "#071A3D", color: "#D9A62E", fontWeight: "700", padding: "12px 24px", borderRadius: "4px", border: "none", cursor: "pointer" }}>
            Save SEO Settings
          </button>
        </form>
      )}

      {/* 5. CUSTOMER REVIEWS MANAGEMENT */}
      {activeTab === "reviews" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2 style={{ color: "#071A3D", margin: 0 }}>Customer Reviews &amp; Testimonials</h2>
              <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Manage customer reviews displayed on the website.</p>
            </div>
            <Link
              href="/reviews"
              target="_blank"
              style={{
                background: "#071A3D",
                color: "#D9A62E",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: "700",
                fontSize: "0.85rem",
                textDecoration: "none"
              }}
            >
              View Reviews Page ↗
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "850px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                  <th style={{ padding: "12px" }}>Date</th>
                  <th style={{ padding: "12px" }}>Customer Name</th>
                  <th style={{ padding: "12px" }}>Rating</th>
                  <th style={{ padding: "12px" }}>Loan Type &amp; City</th>
                  <th style={{ padding: "12px" }}>Review Text</th>
                  <th style={{ padding: "12px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  testimonials.map((rev) => (
                    <tr key={rev.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "12px", fontSize: "0.85rem", color: "#64748B", whiteSpace: "nowrap" }}>
                        {rev.date || "—"}
                      </td>
                      <td style={{ padding: "12px", fontWeight: "700", color: "#071A3D" }}>{rev.name}</td>
                      <td style={{ padding: "12px", color: "#D9A62E", fontWeight: "700", fontSize: "1rem" }}>
                        {"★".repeat(rev.rating || 5)}
                      </td>
                      <td style={{ padding: "12px", fontSize: "0.88rem" }}>
                        <span style={{ fontWeight: "600", color: "#071A3D" }}>{rev.loanType}</span>
                        <div style={{ fontSize: "0.8rem", color: "#64748B" }}>📍 {rev.location}</div>
                      </td>
                      <td style={{ padding: "12px", fontSize: "0.88rem", color: "#334155", maxWidth: "340px", lineHeight: "1.5" }}>
                        &ldquo;{rev.testimonial}&rdquo;
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(rev.id)}
                          style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.8rem",
                            transform: "none"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. PDF EXPORT */}
      {activeTab === "backup" && (
        <div>
          <h2 style={{ color: "#071A3D", marginBottom: "5px" }}>Customer Leads PDF Export</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "25px" }}>Download a clean PDF report of customer leads & loan applications directly to your computer.</p>

          <div style={{ maxWidth: "520px" }}>
            <div style={{ background: "#F8FAFC", padding: "30px", borderRadius: "8px", border: "2px solid #D9A62E", textAlign: "center", boxShadow: "0 4px 15px rgba(7, 26, 61, 0.08)" }}>
              <div style={{ fontSize: "3.2rem", marginBottom: "12px" }}>📄</div>
              <h3 style={{ color: "#071A3D", marginBottom: "8px", fontSize: "1.25rem" }}>Export Customer PDF Report</h3>
              <p style={{ color: "#64748B", fontSize: "0.88rem", marginBottom: "24px", lineHeight: "1.5" }}>
                Downloads a formatted vector PDF document containing customer names, mobile numbers, loan types, follow-up status, and inquiry dates directly to your Downloads folder.
              </p>
              <button
                type="button"
                onClick={handleExportPDFBackup}
                style={{
                  display: "inline-block",
                  background: "#071A3D",
                  color: "#D9A62E",
                  fontWeight: "700",
                  padding: "14px 24px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "1rem",
                  boxShadow: "0 4px 12px rgba(7, 26, 61, 0.2)"
                }}
              >
                📄 Download Customer PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
