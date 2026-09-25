"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Admin.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

function getYouTubeThumbnail(url) {
  if (!url) return "";
  const match = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match && match[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("leads");

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nilesh_admin_logged_in") === "true";
    }
    return false;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // State
  const [leads, setLeads] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nilesh_admin_leads_vault");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn("Could not read leads vault:", e);
      }
    }
    return [];
  });
  const [leadFilter, setLeadFilter] = useState("All");
  const [blogs, setBlogs] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nilesh_admin_blogs_vault");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn("Could not read blogs vault:", e);
      }
    }
    return [];
  });
  const [blogFilter, setBlogFilter] = useState("all"); // "all" | "video" | "standard"
  const [articleFormat, setArticleFormat] = useState("standard"); // "standard" | "video"
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
    imageUrl: "",
    youtubeUrl: ""
  });

  // Generate / Add Enquiry Modal
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    mobile: "",
    loanType: "Home Loan",
    city: "",
    source: "Phone Call",
    status: "New",
    notes: ""
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // Notifications
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const syncLeadsToServer = async (vaultList) => {
    try {
      for (const lead of vaultList) {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: lead.name,
            phone: lead.phone || lead.mobile,
            mobile: lead.phone || lead.mobile,
            loanType: lead.loanType,
            loanAmount: lead.loanAmount,
            city: lead.city,
            source: lead.source,
            status: lead.status,
            message: lead.notes
          })
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("syncLeadsToServer warning:", err);
    }
  };

  const syncBlogsToServer = async (vaultList) => {
    try {
      for (const blog of vaultList) {
        await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blog)
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("syncBlogsToServer warning:", err);
    }
  };

  const fetchLeads = async () => {
    let localVault = [];
    try {
      const saved = localStorage.getItem("nilesh_admin_leads_vault");
      if (saved) localVault = JSON.parse(saved);
    } catch (e) {
      console.warn("fetchLeads vault read error:", e);
    }

    try {
      const res = await fetch(`/api/leads?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const serverLeads = await res.json();
        if (Array.isArray(serverLeads)) {
          const map = new Map();
          localVault.forEach(l => { if (l && l.id) map.set(l.id, l); });
          serverLeads.forEach(l => { if (l && l.id) map.set(l.id, l); });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
          );
          setLeads(merged);
          try {
            localStorage.setItem("nilesh_admin_leads_vault", JSON.stringify(merged));
          } catch (e) {
            console.warn("localStorage error:", e);
          }

          if (serverLeads.length === 0 && localVault.length > 0) {
            syncLeadsToServer(localVault);
          }
        }
      }
    } catch (e) {
      console.error("fetchLeads error:", e);
    }
  };

  const fetchBlogs = async () => {
    let localVault = [];
    try {
      const saved = localStorage.getItem("nilesh_admin_blogs_vault");
      if (saved) localVault = JSON.parse(saved);
    } catch (e) {
      console.warn("fetchBlogs vault read error:", e);
    }

    try {
      const res = await fetch(`/api/blogs?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const serverBlogs = await res.json();
        if (Array.isArray(serverBlogs)) {
          const map = new Map();
          serverBlogs.forEach(b => { if (b && b.id) map.set(b.id, b); });
          localVault.forEach(b => { if (b && b.id) map.set(b.id, b); });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)
          );
          setBlogs(merged);
          try {
            localStorage.setItem("nilesh_admin_blogs_vault", JSON.stringify(merged));
          } catch (e) {
            console.warn("localStorage error:", e);
          }

          if (serverBlogs.length < merged.length) {
            const missing = merged.filter(b => !serverBlogs.some(sb => sb.id === b.id));
            if (missing.length > 0) syncBlogsToServer(missing);
          }
        }
      }
    } catch (e) {
      console.error("fetchBlogs error:", e);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/upload?t=${Date.now()}`, { cache: "no-store" });
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

  useEffect(() => {
    if (!isLoggedIn) return;
    const timer = setTimeout(() => {
      fetchLeads();
      fetchBlogs();
      fetchImages();
      fetchSettings();
      fetchTestimonials();
    }, 0);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

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

  const handleDeleteTestimonial = async (id) => {
    if (!confirm("Are you sure you want to delete this customer review?")) return;
    setTestimonials(prev => prev.filter(r => r.id !== id));
    try {
      const res = await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Review deleted successfully!");
        fetchTestimonials();
      } else {
        showToast("Failed to delete review.");
        fetchTestimonials();
      }
    } catch (e) {
      console.error(e);
      showToast("Error deleting review.");
      fetchTestimonials();
    }
  };

  // Lead actions
  const handleUpdateLeadStatus = async (id, status, notes) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, status, notes: notes !== undefined ? notes : l.notes } : l);
      try {
        localStorage.setItem("nilesh_admin_leads_vault", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes })
      });
      if (res.ok) {
        showToast("Enquiry status updated!");
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    setLeads(prev => {
      const updated = prev.filter(l => l.id !== id);
      try {
        localStorage.setItem("nilesh_admin_leads_vault", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Enquiry deleted successfully!");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to delete enquiry.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error deleting enquiry.");
    }
  };

  const handleOpenEditLeadModal = (lead) => {
    setEditingLead(lead);
    setNewLeadForm({
      name: lead.name || "",
      mobile: lead.phone || lead.mobile || "",
      loanType: lead.loanType || "Home Loan",
      city: lead.city || "",
      source: lead.source || "Phone Call",
      status: lead.status || "New",
      notes: lead.notes || lead.message || ""
    });
    setShowAddLeadModal(true);
  };

  const handleCreateLeadSubmit = async (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.mobile || !newLeadForm.loanType) {
      showToast("Please fill all required fields.");
      return;
    }
    if (!/^\d{10}$/.test(newLeadForm.mobile.trim())) {
      showToast("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSubmittingLead(true);

    if (editingLead) {
      try {
        const payload = {
          id: editingLead.id,
          name: newLeadForm.name.trim(),
          phone: newLeadForm.mobile.trim(),
          mobile: newLeadForm.mobile.trim(),
          loanType: newLeadForm.loanType,
          city: newLeadForm.city.trim() || undefined,
          source: newLeadForm.source,
          status: newLeadForm.status,
          notes: newLeadForm.notes.trim() || undefined
        };
        const res = await fetch("/api/leads", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast("Enquiry updated successfully!");
          const updatedObj = {
            ...editingLead,
            ...payload
          };
          setLeads(prev => {
            const updated = prev.map(l => l.id === editingLead.id ? updatedObj : l);
            try {
              localStorage.setItem("nilesh_admin_leads_vault", JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
          setEditingLead(null);
          setNewLeadForm({
            name: "",
            mobile: "",
            loanType: "Home Loan",
            source: "Phone Call",
            status: "New",
            notes: ""
          });
          setShowAddLeadModal(false);
        } else {
          const data = await res.json().catch(() => ({}));
          showToast(data.error || "Failed to update enquiry.");
        }
      } catch (err) {
        console.error(err);
        showToast("Error updating enquiry.");
      }
      setIsSubmittingLead(false);
      return;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLeadForm.name.trim(),
          phone: newLeadForm.mobile.trim(),
          mobile: newLeadForm.mobile.trim(),
          loanType: newLeadForm.loanType,
          city: newLeadForm.city.trim() || undefined,
          source: newLeadForm.source,
          status: newLeadForm.status,
          message: newLeadForm.notes.trim() || undefined
        })
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast("Enquiry generated successfully!");
        
        const createdObj = {
          id: data.data?.id || ("lead-" + Date.now()),
          name: newLeadForm.name.trim(),
          phone: newLeadForm.mobile.trim(),
          mobile: newLeadForm.mobile.trim(),
          loanType: newLeadForm.loanType,
          city: newLeadForm.city.trim() || undefined,
          source: newLeadForm.source,
          status: newLeadForm.status,
          notes: newLeadForm.notes.trim() || undefined,
          createdAt: new Date().toISOString()
        };

        setLeads(prev => {
          const updated = [createdObj, ...prev.filter(l => l.id !== createdObj.id)];
          try {
            localStorage.setItem("nilesh_admin_leads_vault", JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });

        setEditingLead(null);
        setNewLeadForm({
          name: "",
          mobile: "",
          loanType: "Home Loan",
          loanAmount: "",
          city: "",
          source: "Phone Call",
          status: "New",
          notes: ""
        });
        setShowAddLeadModal(false);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to generate enquiry.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error generating enquiry.");
    }
    setIsSubmittingLead(false);
  };

  // Blog actions
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.excerpt.trim() || !blogForm.content.trim()) {
      showToast("Please fill in Title, Excerpt, and Content.");
      return;
    }

    try {
      const method = editingBlog ? "PUT" : "POST";
      const payload = editingBlog ? { ...blogForm, id: editingBlog.id } : blogForm;

      // Optimistically apply immediately to UI & local vault so UI is never delayed or wiped!
      if (editingBlog) {
        const updatedArticle = {
          ...editingBlog,
          ...payload,
          id: editingBlog.id,
          slug: payload.slug || editingBlog.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          imageUrl: payload.imageUrl || "",
          youtubeUrl: payload.youtubeUrl || "",
          updatedAt: new Date().toISOString()
        };
        setBlogs(prev => {
          const updated = prev.map(b => b.id === editingBlog.id ? updatedArticle : b);
          try { localStorage.setItem("nilesh_admin_blogs_vault", JSON.stringify(updated)); } catch (err) {}
          return updated;
        });
        showToast("Blog updated successfully!");
        setBlogForm({ title: "", category: "Home Loan", excerpt: "", content: "", slug: "", imageUrl: "", youtubeUrl: "" });
        setEditingBlog(null);
        setArticleFormat("standard");
      } else {
        const newSlug = payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const newArticle = {
          id: "blog-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          slug: newSlug,
          title: payload.title.trim(),
          category: payload.category,
          excerpt: payload.excerpt.trim(),
          content: payload.content.trim(),
          date: new Date().toISOString().split("T")[0],
          imageUrl: payload.imageUrl || "",
          youtubeUrl: payload.youtubeUrl || "",
          createdAt: new Date().toISOString()
        };
        setBlogs(prev => {
          const updated = [newArticle, ...prev];
          try { localStorage.setItem("nilesh_admin_blogs_vault", JSON.stringify(updated)); } catch (err) {}
          return updated;
        });
        showToast("Blog created successfully!");
        setBlogForm({ title: "", category: "Home Loan", excerpt: "", content: "", slug: "", imageUrl: "", youtubeUrl: "" });
        setArticleFormat("standard");
      }

      // Sync to API in background
      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.data) {
        // If server provided canonical id or slug, reconcile with state
        if (data.data.id || data.data.slug) {
          setBlogs(prev => {
            const updated = prev.map(b => {
              if (editingBlog && b.id === editingBlog.id) {
                return { ...b, ...data.data };
              }
              if (!editingBlog && (b.title === payload.title)) {
                return { ...b, ...data.data };
              }
              return b;
            });
            try { localStorage.setItem("nilesh_admin_blogs_vault", JSON.stringify(updated)); } catch (err) {}
            return updated;
          });
        }
      }
    } catch (e) {
      console.error(e);
      showToast("Blog saved locally.");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setBlogs(prev => {
      const updated = prev.filter(b => b.id !== id);
      try { localStorage.setItem("nilesh_admin_blogs_vault", JSON.stringify(updated)); } catch (err) {}
      return updated;
    });
    showToast("Blog post deleted!");
    try {
      await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
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
            { id: "leads", label: "📩 Enquiry Management", count: leads.length },
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
            <option value="leads">📩 Enquiry Management ({leads.length})</option>
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

      {/* 1. ENQUIRY MANAGEMENT */}
      {activeTab === "leads" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2 style={{ color: "#071A3D", margin: 0 }}>Enquiry Management</h2>
              <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Manage customer loan enquiries and update follow-up statuses.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  setEditingLead(null);
                  setNewLeadForm({
                    name: "",
                    mobile: "",
                    loanType: "Home Loan",
                    city: "",
                    source: "Phone Call",
                    status: "New",
                    notes: ""
                  });
                  setShowAddLeadModal(true);
                }}
                style={{
                  background: "#071A3D",
                  color: "#D9A62E",
                  border: "1.5px solid #D9A62E",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(7, 26, 61, 0.15)"
                }}
              >
                ➕ Generate Lead / New Enquiry
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                  <option value="All" style={{ background: "#fff", color: "#071A3D" }}>All Enquiries ({leads.length})</option>
                  <option value="New" style={{ background: "#fff", color: "#0284c7" }}>New ({leads.filter(l => l.status === "New").length})</option>
                  <option value="Contacted" style={{ background: "#fff", color: "#b45309" }}>Contacted ({leads.filter(l => l.status === "Contacted").length})</option>
                  <option value="Follow-up" style={{ background: "#fff", color: "#c2410c" }}>Follow-up ({leads.filter(l => l.status === "Follow-up").length})</option>
                  <option value="Approved" style={{ background: "#fff", color: "#16a34a" }}>Approved ({leads.filter(l => l.status === "Approved").length})</option>
                  <option value="Rejected" style={{ background: "#fff", color: "#dc2626" }}>Rejected ({leads.filter(l => l.status === "Rejected").length})</option>
                </select>
              </div>
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
                      No enquiries found in this filter category.
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
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditLeadModal(lead)}
                            style={{
                              background: "#e0f2fe",
                              color: "#0284c7",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "0.8rem",
                              transform: "none"
                            }}
                          >
                            ✏️ Edit
                          </button>
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
                        </div>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2 style={{ color: "#071A3D", margin: 0 }}>Blog Management</h2>
              <p style={{ color: "#64748B", fontSize: "0.9rem", margin: "4px 0 0 0" }}>Publish, edit, and manage loan guidance articles and YouTube video guides.</p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  setEditingBlog(null);
                  setBlogForm({ title: "", category: "Home Loan", excerpt: "", content: "", slug: "", imageUrl: "", youtubeUrl: "" });
                  setArticleFormat("standard");
                }}
                style={{
                  background: "#071A3D",
                  color: "#D9A62E",
                  border: "1.5px solid #D9A62E",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                📝 Add Standard Article
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingBlog(null);
                  const sampleUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                  const thumb = getYouTubeThumbnail(sampleUrl);
                  setBlogForm({
                    title: "",
                    category: "Home Loan",
                    excerpt: "",
                    content: "",
                    slug: "",
                    imageUrl: thumb,
                    youtubeUrl: sampleUrl
                  });
                  setArticleFormat("video");
                }}
                style={{
                  background: "#DC2626",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(220, 38, 38, 0.25)"
                }}
              >
                ▶️ Add YouTube Video Article
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveBlog} style={{ background: "#F8FAFC", padding: "25px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
              <h3 style={{ color: "#071A3D", margin: 0 }}>
                {editingBlog ? "Edit Article" : "Add New Blog Article"}
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748B" }}>Format:</span>
                <button
                  type="button"
                  onClick={() => setArticleFormat("standard")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "4px",
                    border: articleFormat === "standard" ? "1.5px solid #071A3D" : "1px solid #CBD5E1",
                    background: articleFormat === "standard" ? "#071A3D" : "white",
                    color: articleFormat === "standard" ? "#D9A62E" : "#475569",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  📝 Standard
                </button>
                <button
                  type="button"
                  onClick={() => setArticleFormat("video")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "4px",
                    border: articleFormat === "video" ? "1.5px solid #DC2626" : "1px solid #CBD5E1",
                    background: articleFormat === "video" ? "#DC2626" : "#FEF2F2",
                    color: articleFormat === "video" ? "#FFFFFF" : "#DC2626",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  ▶️ YouTube Video
                </button>
              </div>
            </div>
            
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

            {/* YouTube Video Section - Prominently Displayed */}
            <div style={{
              marginBottom: "20px",
              padding: "16px",
              background: articleFormat === "video" || blogForm.youtubeUrl ? "#FEF2F2" : "#F8FAFC",
              borderRadius: "8px",
              border: articleFormat === "video" || blogForm.youtubeUrl ? "2px solid #FCA5A5" : "1px dashed #CBD5E1"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <label style={{ fontWeight: "700", fontSize: "0.92rem", color: "#DC2626", display: "flex", alignItems: "center", gap: "6px" }}>
                  ▶️ YouTube Video Link {articleFormat === "video" ? "(Video Article)" : "(Optional)"}
                </label>
                {!blogForm.youtubeUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      const sample = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                      const thumb = getYouTubeThumbnail(sample);
                      setBlogForm(prev => ({
                        ...prev,
                        youtubeUrl: sample,
                        imageUrl: thumb || prev.imageUrl
                      }));
                      setArticleFormat("video");
                      showToast("Sample video added and cover photo auto-updated!");
                    }}
                    style={{ background: "#FFFFFF", color: "#DC2626", border: "1px solid #FCA5A5", padding: "3px 10px", borderRadius: "4px", fontSize: "0.76rem", fontWeight: "600", cursor: "pointer" }}
                  >
                    ⚡ Paste Sample Video
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="url"
                  value={blogForm.youtubeUrl || ""}
                  onChange={e => {
                    const val = e.target.value;
                    const thumb = getYouTubeThumbnail(val);
                    setBlogForm(prev => ({
                      ...prev,
                      youtubeUrl: val,
                      // Automatically update cover photo with YouTube HD thumbnail!
                      imageUrl: thumb || prev.imageUrl
                    }));
                    if (val) setArticleFormat("video");
                  }}
                  placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)"
                  style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1.5px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}
                />
                {blogForm.youtubeUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      const isYtThumb = blogForm.imageUrl && blogForm.imageUrl.includes("youtube.com");
                      setBlogForm(prev => ({
                        ...prev,
                        youtubeUrl: "",
                        imageUrl: isYtThumb ? "" : prev.imageUrl
                      }));
                    }}
                    style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "10px 14px", borderRadius: "4px", fontSize: "0.82rem", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    ✕ Clear Video
                  </button>
                )}
              </div>
              <span style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "6px", display: "block" }}>
                📸 When you paste a YouTube video, the cover photo below is <strong>automatically updated</strong> to the video&apos;s thumbnail!
              </span>

              {/* Instant Live Player Preview */}
              {getYouTubeEmbedUrl(blogForm.youtubeUrl) && (
                <div style={{ marginTop: "14px", padding: "12px", background: "white", borderRadius: "6px", border: "1px solid #FECACA" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#059669", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>✅</span> Video Preview (will appear inside the published article):
                  </div>
                  <div style={{ position: "relative", width: "100%", maxWidth: "460px", paddingBottom: "258px", height: 0, borderRadius: "6px", overflow: "hidden", background: "#000" }}>
                    <iframe
                      src={getYouTubeEmbedUrl(blogForm.youtubeUrl)}
                      title="YouTube Preview"
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px", flexWrap: "wrap", gap: "6px" }}>
                <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                  Featured Cover Image {blogForm.youtubeUrl ? "(Auto-updated from video)" : "(Optional)"}
                </label>
                {blogForm.youtubeUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      const thumb = getYouTubeThumbnail(blogForm.youtubeUrl);
                      if (thumb) {
                        setBlogForm({ ...blogForm, imageUrl: thumb });
                        showToast("Cover photo refreshed from YouTube thumbnail!");
                      }
                    }}
                    style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", padding: "3px 10px", borderRadius: "4px", fontSize: "0.76rem", fontWeight: "600", cursor: "pointer" }}
                  >
                    🔄 Sync Video Thumbnail
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={blogForm.imageUrl || ""}
                  onChange={e => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                  placeholder="Auto-filled from YouTube or enter image URL"
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
                  📷 Upload Custom Image
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
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", padding: "10px", background: "white", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                  <img
                    src={blogForm.imageUrl}
                    alt="Cover Preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    onLoad={(e) => {
                      e.target.style.display = "block";
                    }}
                    style={{ height: "75px", width: "120px", borderRadius: "6px", objectFit: "cover", border: "1.5px solid #CBD5E1", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                  />
                  <div>
                    {blogForm.imageUrl.includes("youtube.com") ? (
                      <span style={{ fontSize: "0.78rem", color: "#059669", fontWeight: "700", display: "block", marginBottom: "4px" }}>
                        ✨ Cover photo auto-updated from YouTube video!
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                        Cover Photo Preview
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setBlogForm({ ...blogForm, imageUrl: "" })}
                      style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "3px 8px", borderRadius: "4px", fontSize: "0.76rem", cursor: "pointer", fontWeight: "600" }}
                    >
                      Remove Cover Photo
                    </button>
                  </div>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Full Content *</label>
                <button
                  type="button"
                  onClick={() => {
                    const sample = "\n\n### 📺 Watch Video Guide:\n" + (blogForm.youtubeUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ") + "\n\n";
                    setBlogForm({ ...blogForm, content: (blogForm.content || "") + sample });
                  }}
                  style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", padding: "3px 10px", borderRadius: "4px", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}
                >
                  ➕ Insert Video Reference in Text
                </button>
              </div>
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
                  onClick={() => {
                    setEditingBlog(null);
                    setBlogForm({ title: "", category: "Home Loan", excerpt: "", content: "", slug: "", imageUrl: "", youtubeUrl: "" });
                    setArticleFormat("standard");
                  }}
                  style={{ background: "#E2E8F0", color: "#475569", padding: "10px 20px", borderRadius: "4px", border: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List Blogs Filter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "25px 0 15px", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ color: "#071A3D", margin: 0, fontSize: "1.1rem" }}>
              Published Articles ({blogs.length})
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { id: "all", label: `All (${blogs.length})` },
                { id: "video", label: `▶️ Videos (${blogs.filter(b => b.youtubeUrl).length})` },
                { id: "standard", label: `📝 Standard (${blogs.filter(b => !b.youtubeUrl).length})` }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setBlogFilter(f.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "4px",
                    border: blogFilter === f.id ? "1.5px solid #071A3D" : "1px solid #CBD5E1",
                    background: blogFilter === f.id ? "#071A3D" : "white",
                    color: blogFilter === f.id ? "#D9A62E" : "#475569",
                    fontWeight: "600",
                    fontSize: "0.82rem",
                    cursor: "pointer"
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List Blogs */}
          <div style={{ display: "grid", gap: "15px" }}>
            {blogs
              .filter(b => {
                if (blogFilter === "video") return !!b.youtubeUrl;
                if (blogFilter === "standard") return !b.youtubeUrl;
                return true;
              })
              .map(b => (
                <div key={b.id} style={{ background: "white", border: "1px solid #E2E8F0", padding: "20px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Crect width='70' height='70' fill='%23F1F5F9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24'%3E📝%3C/text%3E%3C/svg%3E";
                        }}
                        style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px", border: "1px solid #E2E8F0" }}
                      />
                    ) : b.youtubeUrl ? (
                      <div style={{ width: "70px", height: "70px", borderRadius: "6px", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>
                        ▶️
                      </div>
                    ) : (
                      <div style={{ width: "70px", height: "70px", borderRadius: "6px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                        📝
                      </div>
                    )}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8rem", color: "#D9A62E", fontWeight: "700" }}>{b.category}</span>
                        {b.youtubeUrl && (
                          <>
                            <span style={{ fontSize: "0.72rem", background: "#fee2e2", color: "#dc2626", padding: "2px 8px", borderRadius: "4px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                              ▶️ YouTube Video
                            </span>
                            <a href={b.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "#DC2626", textDecoration: "underline", fontWeight: "600" }}>
                              Watch ↗
                            </a>
                          </>
                        )}
                      </div>
                      <h4 style={{ margin: "5px 0", color: "#071A3D" }}>{b.title}</h4>
                      <p style={{ color: "#64748B", fontSize: "0.85rem", margin: 0 }}>{b.excerpt}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBlog(b);
                        setArticleFormat(b.youtubeUrl ? "video" : "standard");
                        setBlogForm({
                          title: b.title,
                          category: b.category,
                          excerpt: b.excerpt,
                          content: b.content,
                          slug: b.slug,
                          imageUrl: b.imageUrl || "",
                          youtubeUrl: b.youtubeUrl || ""
                        });
                      }}
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
          <h2 style={{ color: "#071A3D", marginBottom: "5px" }}>Customer Enquiries PDF Export</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "25px" }}>Download a clean PDF report of customer enquiries & loan applications directly to your computer.</p>

          <div style={{ maxWidth: "520px" }}>
            <div style={{ background: "#F8FAFC", padding: "30px", borderRadius: "8px", border: "2px solid #D9A62E", textAlign: "center", boxShadow: "0 4px 15px rgba(7, 26, 61, 0.08)" }}>
              <div style={{ fontSize: "3.2rem", marginBottom: "12px" }}>📄</div>
              <h3 style={{ color: "#071A3D", marginBottom: "8px", fontSize: "1.25rem" }}>Export Customer Enquiries PDF Report</h3>
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

      {/* ADD / GENERATE LEAD MODAL */}
      {showAddLeadModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(7, 26, 61, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000,
          padding: "20px"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            overflow: "hidden",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Modal Header */}
            <div style={{
              background: "#071A3D",
              color: "#ffffff",
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ margin: 0, color: "#D9A62E", fontSize: "1.2rem" }}>
                  {editingLead ? "✏️ Edit Enquiry Details" : "➕ Generate New Lead / Enquiry"}
                </h3>
                <p style={{ margin: "4px 0 0", color: "#CBD5E1", fontSize: "0.85rem" }}>
                  {editingLead ? `Update details for ${editingLead.name || "customer"}` : "Manually add a direct inquiry or phone lead"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingLead(null);
                  setShowAddLeadModal(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "0 5px"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateLeadSubmit} style={{ padding: "24px", overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "5px", color: "#071A3D" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "0.9rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "5px", color: "#071A3D" }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={newLeadForm.mobile}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, mobile: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "5px", color: "#071A3D" }}>
                    Loan Type *
                  </label>
                  <select
                    value={newLeadForm.loanType}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, loanType: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "0.9rem", backgroundColor: "#fff" }}
                  >
                    <option value="Home Loan">Home Loan</option>
                    <option value="Balance Transfer">Balance Transfer</option>
                    <option value="Top-Up Loan">Top-Up Loan</option>
                    <option value="Loan Against Property">Loan Against Property</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Medical Insurance">Medical Insurance</option>
                    <option value="Mutual Funds">Mutual Funds</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "5px", color: "#071A3D" }}>
                    City / Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "5px", color: "#071A3D" }}>
                    Lead Source
                  </label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "0.9rem", backgroundColor: "#fff" }}
                  >
                    <option value="Phone Call">📞 Phone Call</option>
                    <option value="WhatsApp">💬 WhatsApp</option>
                    <option value="Direct Walk-in">🏢 Direct Walk-in</option>
                    <option value="Referral">🤝 Referral</option>
                    <option value="Website">🌐 Website</option>
                    <option value="Other">📌 Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "5px", color: "#071A3D" }}>
                    Status
                  </label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "0.9rem", backgroundColor: "#fff" }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "5px", color: "#071A3D" }}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "0.9rem", resize: "vertical" }}
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #E2E8F0", paddingTop: "15px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLead(null);
                    setShowAddLeadModal(false);
                  }}
                  style={{
                    background: "#F1F5F9",
                    color: "#475569",
                    border: "1px solid #CBD5E1",
                    padding: "9px 18px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  style={{
                    background: "#071A3D",
                    color: "#D9A62E",
                    border: "none",
                    padding: "9px 22px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(7, 26, 61, 0.2)"
                  }}
                >
                  {isSubmittingLead ? "Saving..." : (editingLead ? "💾 Update Enquiry" : "💾 Save Enquiry")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
