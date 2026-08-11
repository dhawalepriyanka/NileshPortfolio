import Link from "next/link";
import styles from "./Documents.module.css";

export const metadata = {
  title: "Documents Required for Home Loan | Nilesh Kute",
  description: "Check the list of documents required for Home Loan applications for Salaried, Self-Employed, and NRI applicants.",
};

const salariedDocs = [
  "PAN Card",
  "Aadhaar Card",
  "Last 3 months Salary Slips",
  "Last 6 months Bank Statements",
  "Form 16 / ITR",
  "Employment-related documents (Offer Letter / Experience Letter)",
  "Passport-size photographs",
  "Property documents (Agreement / Allotment Letter)",
];

const selfEmployedDocs = [
  "PAN Card",
  "Aadhaar Card",
  "ITR for last 2–3 years",
  "Business Proof (Registration / GST Certificate)",
  "Last 12 months Bank Statements",
  "Audited Financial Statements (Balance Sheet, P&L)",
  "Passport-size photographs",
  "Property documents",
];

const nriDocs = [
  "Valid Passport & Visa",
  "PAN Card",
  "Overseas Employment Contract / Appointment Letter",
  "Last 6–12 months NRE / NRO Bank Statements",
  "Salary Certificate from overseas employer",
  "Power of Attorney (if applicable)",
  "Property documents",
];

export default function DocumentsPage() {
  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.title}>Documents Required</h1>
          <p className={styles.subtitle}>A general guide to documents needed for home loan applications.</p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <p className={styles.notice}>
            ⚠️ Exact documentation can vary based on lender, applicant profile, and loan type. This is a general reference only.
          </p>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>💼</span>
                <h2>Salaried Applicants</h2>
              </div>
              <ul className={styles.docList}>
                {salariedDocs.map((d, i) => <li key={i}><span className={styles.check}>✓</span>{d}</li>)}
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>🏪</span>
                <h2>Self-Employed Applicants</h2>
              </div>
              <ul className={styles.docList}>
                {selfEmployedDocs.map((d, i) => <li key={i}><span className={styles.check}>✓</span>{d}</li>)}
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>✈️</span>
                <h2>NRI Applicants</h2>
              </div>
              <ul className={styles.docList}>
                {nriDocs.map((d, i) => <li key={i}><span className={styles.check}>✓</span>{d}</li>)}
              </ul>
            </div>
          </div>

          <div className={styles.ctaBanner}>
            <h3>Not sure which documents you need?</h3>
            <p>Get personalized guidance based on your profile.</p>
            <a href="/apply" className="btn">Get Free Consultation</a>
          </div>
        </div>
      </section>
    </div>
  );
}
