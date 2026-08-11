import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Nilesh Kute - Home Loan Consultant",
  description: "Terms and Conditions for using Nilesh Kute Home Loan Consultancy website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", color: "#334155", lineHeight: "1.7" }}>
      <h1 style={{ color: "#071A3D", fontSize: "2.2rem", fontWeight: "800", marginBottom: "15px" }}>Terms & Conditions</h1>
      <p style={{ fontSize: "0.9rem", color: "#64748B", marginBottom: "30px" }}>Last updated: August 2026</p>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website, submitting an enquiry, or availing consultation services from Nilesh Kute, you agree to comply with and be bound by these Terms and Conditions.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>2. Accuracy of Information Provided</h2>
        <p>
          Applicants agree to provide true, accurate, and complete financial and personal information during consultations and application submissions. Misrepresentation may lead to loan application rejection by partner banks.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>3. Services Offered</h2>
        <p>
          Our services include consultation, document organization, eligibility analysis, and application submission assistance for Home Loans, Balance Transfers, Top-Up Loans, LAP, Business/Personal Loans, Medical Insurance, and Mutual Funds.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>4. Intellectual Property</h2>
        <p>
          All branding, content, calculators, and design elements on this website are the property of Nilesh Kute Home Loan Consultancy and may not be reproduced without prior written permission.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>5. Contact & Support</h2>
        <p>
          For any clarifications regarding our terms, feel free to reach out via our <Link href="/contact" style={{ color: "#071A3D", fontWeight: "600" }}>Contact Us</Link> page.
        </p>
      </section>

      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #E2E8F0" }}>
        <Link href="/" style={{ color: "#071A3D", fontWeight: "700", textDecoration: "none" }}>← Back to Home</Link>
      </div>
    </div>
  );
}
