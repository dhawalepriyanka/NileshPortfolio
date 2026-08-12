"use client";
import { useState } from "react";
import styles from "./FreeConsultation.module.css";

export default function FreeConsultation() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    loanType: "",
    message: ""
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const resData = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", mobile: "", loanType: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(resData.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <section className={styles.consultationSection}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>Need Help Choosing the Right Loan?</h2>
            <p>Get personalized guidance for your loan requirement.</p>
          </div>
          
          {status === "success" ? (
            <div className={styles.successMessage}>
              <h3>Thank you for your enquiry!</h3>
              <p>Nilesh Kute will contact you shortly.</p>
              <button className="btn mt-4" onClick={() => setStatus("idle")}>Submit another enquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {status === "error" && (
                <div style={{
                  background: "#FEF2F2",
                  color: "#DC2626",
                  border: "1px solid #FCA5A5",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "0.88rem",
                  marginBottom: "15px",
                  fontWeight: "600",
                  textAlign: "center"
                }}>
                  ⚠️ {errorMessage || "Something went wrong. Please try again."}
                </div>
              )}
              <div className={styles.inputGroup}>
                <label>Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Mobile Number *</label>
                <input 
                  type="tel" 
                  required 
                  pattern="[0-9]{10}"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Loan Type *</label>
                <select 
                  required
                  value={formData.loanType}
                  onChange={(e) => setFormData({...formData, loanType: e.target.value})}
                  className={styles.input}
                >
                  <option value="">Select Loan Type</option>
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
              <div className={styles.inputGroup}>
                <label>Message (Optional)</label>
                <textarea 
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className={styles.input}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className={`btn ${styles.submitBtn}`}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <>
                    <span className="spinner"></span> Submitting...
                  </>
                ) : (
                  "Get Free Consultation"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

