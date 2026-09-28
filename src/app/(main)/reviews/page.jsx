"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Reviews.module.css";

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsapp, setWhatsapp] = useState("918356008675");
  const [toast, setToast] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    loanType: "Home Loan",
    location: "Navi Mumbai",
    testimonial: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const mergeWithVault = (serverReviews) => {
    let localVault = [];
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("nilesh_customer_reviews_vault") : null;
      if (saved) localVault = JSON.parse(saved);
    } catch (e) {
      console.warn("Vault read warning:", e);
    }

    const map = new Map();
    if (Array.isArray(serverReviews)) {
      serverReviews.forEach((r) => { if (r && (r.id || r.testimonial)) map.set(r.id || r.testimonial, r); });
    }
    if (Array.isArray(localVault)) {
      localVault.forEach((r) => { if (r && (r.id || r.testimonial)) map.set(r.id || r.testimonial, r); });
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)
    );
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/testimonials?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const merged = mergeWithVault(data);
        setReviews(merged);
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("nilesh_customer_reviews_vault", JSON.stringify(merged));
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error("fetchReviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      // 1. Initial load from local vault to prevent delay
      try {
        const saved = typeof window !== "undefined" ? localStorage.getItem("nilesh_customer_reviews_vault") : null;
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReviews(parsed);
            setLoading(false);
          }
        }
      } catch {
        // Ignore JSON errors
      }

      // 2. Fetch fresh reviews from server
      fetch(`/api/testimonials?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (active && Array.isArray(data)) {
            const merged = mergeWithVault(data);
            setReviews(merged);
            try {
              if (typeof window !== "undefined") {
                localStorage.setItem("nilesh_customer_reviews_vault", JSON.stringify(merged));
              }
            } catch {
              // Ignore localStorage write error
            }
          }
        })
        .catch((err) => console.error("Initial fetch error:", err))
        .finally(() => {
          if (active) setLoading(false);
        });

      // 3. Fetch whatsapp settings
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (active && data && data.whatsapp) setWhatsapp(data.whatsapp);
        })
        .catch(() => {});
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.testimonial.trim()) {
      showToast("Please fill in your name and review message.");
      return;
    }

    setIsSubmitting(true);

    const tempId = "rev-" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
    const currentDate = new Date().toISOString().split("T")[0];

    const optimisticReview = {
      id: tempId,
      name: formData.name.trim(),
      rating: Number(formData.rating) || 5,
      loanType: formData.loanType || "Home Loan",
      location: formData.location ? formData.location.trim() : "Navi Mumbai",
      testimonial: formData.testimonial.trim(),
      date: currentDate,
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistic instant UI update (immediately visible at the top)
    setReviews((prev) => [optimisticReview, ...prev.filter((r) => r.id !== tempId)]);

    // 2. Save immediately to local vault
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("nilesh_customer_reviews_vault") : null;
      const vault = saved ? JSON.parse(saved) : [];
      const updatedVault = [optimisticReview, ...vault.filter((v) => v.id !== tempId)];
      if (typeof window !== "undefined") {
        localStorage.setItem("nilesh_customer_reviews_vault", JSON.stringify(updatedVault));
      }
    } catch (e) {}

    // Close modal and reset form
    setIsModalOpen(false);
    setFormData({
      name: "",
      rating: 5,
      loanType: "Home Loan",
      location: "Navi Mumbai",
      testimonial: "",
    });

    showToast("🎉 Thank you! Your review has been added.");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: optimisticReview.name,
          rating: optimisticReview.rating,
          testimonial: optimisticReview.testimonial,
          loanType: optimisticReview.loanType,
          location: optimisticReview.location,
          date: optimisticReview.date,
        }),
      });

      if (res.ok) {
        const resData = await res.json().catch(() => null);
        if (resData?.data?.id && resData.data.id !== tempId) {
          // Replace tempId with server ID
          setReviews((prev) =>
            prev.map((r) => (r.id === tempId ? { ...r, id: resData.data.id } : r))
          );
        }
        fetchReviews();
      } else {
        console.warn("Server review submission failed, kept in local vault");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews =
    filter === "All"
      ? reviews
      : reviews.filter((r) =>
          r.loanType?.toLowerCase().includes(filter.toLowerCase())
        );

  const categories = [
    "All",
    "Home Loan",
    "Balance Transfer",
    "Property",
    "NRI",
    "Business",
  ];

  return (
    <div className={styles.main}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            backgroundColor: "#071A3D",
            color: "#D9A62E",
            padding: "14px 24px",
            borderRadius: "8px",
            fontWeight: "700",
            zIndex: 10000,
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            border: "1px solid rgba(217, 166, 46, 0.4)",
          }}
        >
          {toast}
        </div>
      )}

      {/* 1. Hero Header */}
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.title}>Customer Reviews &amp; Stories</h1>
          <p className={styles.subtitle}>
            Read genuine experiences and loan approval success stories from
            over 1,000+ satisfied families &amp; business clients across Navi
            Mumbai &amp; Mumbai.
          </p>
        </div>
      </section>

      {/* 2. Key Trust Highlights Bar */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                <span className={styles.starIcon}>★</span> 4.9 / 5.0
              </div>
              <div className={styles.statLabel}>Average Customer Rating</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>1,000+</div>
              <div className={styles.statLabel}>Happy Families Assisted</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>11+ Years</div>
              <div className={styles.statLabel}>Banking &amp; Loan Experience</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>98%</div>
              <div className={styles.statLabel}>Application Approval Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Reviews Content */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.topBar}>
            <div className={styles.filterList}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`${styles.filterBtn} ${
                    filter === cat ? styles.filterBtnActive : ""
                  }`}
                >
                  {cat === "All" ? `All Reviews (${reviews.length})` : cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={styles.writeReviewBtn}
              onClick={() => setIsModalOpen(true)}
            >
              ✍️ Write a Review
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#64748B", fontWeight: "600" }}>
              Loading reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#64748B" }}>
              No reviews found in this category.
            </div>
          ) : (
            <div className={styles.reviewsGrid}>
              {filteredReviews.map((item) => (
                <div key={item.id} className={styles.reviewCard}>
                  <div>
                    <div className={styles.cardHeader}>
                      <div className={styles.stars}>
                        {"★".repeat(Math.max(1, Math.min(5, item.rating || 5)))}
                        {"☆".repeat(Math.max(0, 5 - Math.max(1, Math.min(5, item.rating || 5))))}
                      </div>
                      <span className={styles.verifiedBadge}>
                        ✓ Verified Loan Client
                      </span>
                    </div>
                    <p className={styles.reviewText}>
                      &ldquo;{item.testimonial}&rdquo;
                    </p>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.reviewerInfo}>
                      <h4>{item.name}</h4>
                      <span className={styles.loanTag}>
                        {item.loanType || "Home Loan"}
                      </span>
                    </div>
                    <div className={styles.locationMeta}>
                      <div>📍 {item.location || "Navi Mumbai"}</div>
                      <div style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                        {item.date && !isNaN(new Date(item.date).getTime())
                          ? new Date(item.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                          : item.date || "Recent"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Banner */}
          <div className={styles.ctaBanner}>
            <h3>Looking for Trusted Home Loan Guidance?</h3>
            <p>
              Experience hassle-free sanctions, personalized bank comparisons, and doorstep service from Nilesh Kute.
            </p>
            <div className={styles.ctaBtns}>
              <Link href="/apply" className="btn">
                Apply for Loan Now
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                💬 WhatsApp Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Write Review Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Share Your Experience</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Your Rating *</label>
                <div className={styles.starPicker}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= formData.rating ? styles.starSelected : ""}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Loan Type / Service Taken</label>
                <select
                  className={styles.formSelect}
                  value={formData.loanType}
                  onChange={(e) =>
                    setFormData({ ...formData, loanType: e.target.value })
                  }
                >
                  <option value="Home Loan">Home Loan</option>
                  <option value="Balance Transfer">Balance Transfer</option>
                  <option value="Top-Up Loan">Top-Up Loan</option>
                  <option value="Loan Against Property (LAP)">Loan Against Property (LAP)</option>
                  <option value="Commercial Property Loan">Commercial Property Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="NRI Home Loan">NRI Home Loan</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Your City / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Belapur, Kharghar, Vashi, Mumbai"
                  className={styles.formInput}
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Your Review &amp; Feedback *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your experience with Nilesh Kute's consultation, loan sanction process, ROI, and service..."
                  className={styles.formTextarea}
                  value={formData.testimonial}
                  onChange={(e) =>
                    setFormData({ ...formData, testimonial: e.target.value })
                  }
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
