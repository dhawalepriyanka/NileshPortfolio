"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Admin.module.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("leads");
  
  // State
  const [leads, setLeads] = useState([]);
  const [leadFilter, setLeadFilter] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState([]);
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
    slug: ""
  });

  // Notifications
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    fetchLeads();
    fetchBlogs();
    fetchImages();
    fetchSettings();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) setLeads(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
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
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
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
      if (res.ok) {
        showToast(editingBlog ? "Blog updated!" : "Blog created!");
        setBlogForm({ title: "", category: "Home Loan", excerpt: "", content: "", slug: "" });
        setEditingBlog(null);
        fetchBlogs();
      }
    } catch (e) { console.error(e); }
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
        showToast("Settings saved successfully!");
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

  const filteredLeads = leadFilter === "All" ? leads : leads.filter(l => l.status === leadFilter);

  const statusColors = {
    New: { bg: "#e0f2fe", color: "#0284c7" },
    Contacted: { bg: "#fef3c7", color: "#b45309" },
    "Follow-up": { bg: "#fde8d8", color: "#c2410c" },
    Approved: { bg: "#dcfce7", color: "#16a34a" },
    Rejected: { bg: "#fee2e2", color: "#dc2626" },
  };

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
      <div className={styles.tabNav}>
        {[
          { id: "leads", label: "📊 Lead Management", count: leads.length },
          { id: "blogs", label: "📝 Blog Management", count: blogs.length },
          { id: "images", label: "🖼️ Image Upload", count: images.length },
          { id: "editor", label: "✏️ Page Editor" },
          { id: "seo", label: "🔍 SEO Settings" },
          { id: "backup", label: "💾 Backup & Restore" }
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

      {/* 1. LEAD MANAGEMENT */}
      {activeTab === "leads" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2 style={{ color: "#071A3D", margin: 0 }}>Lead Management</h2>
              <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Manage customer loan inquiries and update follow-up statuses.</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "New", "Contacted", "Follow-up", "Approved", "Rejected"].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setLeadFilter(st)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: "1px solid #CBD5E1",
                    background: leadFilter === st ? "#071A3D" : "#fff",
                    color: leadFilter === st ? "#fff" : "#475569",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transform: "none",
                    boxShadow: "none"
                  }}
                >
                  {st}
                </button>
              ))}
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
                  onClick={() => { setEditingBlog(null); setBlogForm({ title: "", category: "Home Loan", excerpt: "", content: "", slug: "" }); }}
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
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#D9A62E", fontWeight: "700" }}>{b.category}</span>
                  <h4 style={{ margin: "5px 0", color: "#071A3D" }}>{b.title}</h4>
                  <p style={{ color: "#64748B", fontSize: "0.85rem", margin: 0 }}>{b.excerpt}</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => { setEditingBlog(b); setBlogForm({ title: b.title, category: b.category, excerpt: b.excerpt, content: b.content, slug: b.slug }); }}
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

      {/* 3. IMAGE UPLOAD */}
      {activeTab === "images" && (
        <div>
          <h2 style={{ color: "#071A3D", marginBottom: "5px" }}>Image Upload & Library</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "25px" }}>Upload images for website banners, profile pictures, and blog articles.</p>

          <div style={{ background: "#F8FAFC", padding: "30px", border: "2px dashed #CBD5E1", borderRadius: "8px", textAlign: "center", marginBottom: "30px" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="imgUploadInput"
              style={{ display: "none" }}
            />
            <label htmlFor="imgUploadInput" style={{ cursor: "pointer", display: "inline-block" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📁</div>
              <div style={{ fontWeight: "700", color: "#071A3D", marginBottom: "5px" }}>
                {uploading ? "Uploading Image..." : "Click to Upload New Image"}
              </div>
              <span style={{ fontSize: "0.85rem", color: "#64748B" }}>Supports PNG, JPG, WEBP, SVG</span>
            </label>
          </div>

          <h3 style={{ color: "#071A3D", marginBottom: "15px" }}>Uploaded Image Library</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            {images.map((img, idx) => (
              <div key={idx} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                <img src={img.url} alt={img.name} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
                <div style={{ padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "8px" }}>
                    {img.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(img.url); showToast("Image URL copied to clipboard!"); }}
                    style={{ background: "#071A3D", color: "#D9A62E", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer", width: "100%" }}
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PAGE EDITOR */}
      {activeTab === "editor" && (
        <form onSubmit={handleSaveSettings}>
          <h2 style={{ color: "#071A3D", marginBottom: "5px" }}>Page Content Editor</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "25px" }}>Edit key website headings, contact details, and text blocks.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
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

          <div style={{ marginBottom: "25px", background: "#F8FAFC", padding: "20px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ color: "#071A3D", marginBottom: "15px" }}>Social Media Links</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
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

      {/* 6. BACKUP & RESTORE */}
      {activeTab === "backup" && (
        <div>
          <h2 style={{ color: "#071A3D", marginBottom: "5px" }}>Database Backup & Restore</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "25px" }}>Export a backup copy of all leads, blogs, and settings or restore from a JSON file.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
            {/* Export */}
            <div style={{ background: "#F8FAFC", padding: "30px", borderRadius: "8px", border: "1px solid #E2E8F0", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📥</div>
              <h3 style={{ color: "#071A3D", marginBottom: "10px" }}>Export Backup</h3>
              <p style={{ color: "#64748B", fontSize: "0.85rem", marginBottom: "20px" }}>Download complete JSON backup file containing all leads, blog articles, and settings.</p>
              <a
                href="/api/backup"
                download
                style={{
                  display: "inline-block",
                  background: "#071A3D",
                  color: "#D9A62E",
                  fontWeight: "700",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  textDecoration: "none"
                }}
              >
                Download Backup (.json)
              </a>
            </div>

            {/* Import */}
            <div style={{ background: "#F8FAFC", padding: "30px", borderRadius: "8px", border: "1px solid #E2E8F0", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📤</div>
              <h3 style={{ color: "#071A3D", marginBottom: "10px" }}>Restore Backup</h3>
              <p style={{ color: "#64748B", fontSize: "0.85rem", marginBottom: "20px" }}>Upload a previously exported `.json` backup file to restore database entries.</p>
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreBackup}
                id="restoreFileInput"
                style={{ display: "none" }}
              />
              <label
                htmlFor="restoreFileInput"
                style={{
                  display: "inline-block",
                  background: "#D9A62E",
                  color: "#071A3D",
                  fontWeight: "700",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Select Backup File to Restore
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
