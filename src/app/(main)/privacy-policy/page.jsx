import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Nilesh Kute - Home Loan Consultant",
  description: "Privacy Policy for Nilesh Kute Home Loan Consultancy services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", color: "#334155", lineHeight: "1.7" }}>
      <h1 style={{ color: "#071A3D", fontSize: "2.2rem", fontWeight: "800", marginBottom: "15px" }}>Privacy Policy</h1>
      <p style={{ fontSize: "0.9rem", color: "#64748B", marginBottom: "30px" }}>Last updated: August 2026</p>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>1. Introduction</h2>
        <p>
          Welcome to Nilesh Kute Home Loan Consultancy. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website or services.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>2. Information We Collect</h2>
        <p>
          When you fill out consultation or loan application forms on our website, we may collect:
        </p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li>Full Name and contact details (Mobile Number, Email Address)</li>
          <li>Employment Type, Income Details, and Loan Requirement</li>
          <li>City and Location details</li>
        </ul>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>3. How We Use Your Information</h2>
        <p>
          We use your information strictly for:
        </p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li>Evaluating your loan eligibility across partner banks and financial institutions</li>
          <li>Contacting you regarding your home loan or financial service enquiry</li>
          <li>Providing personalized guidance and doorstep loan assistance</li>
        </ul>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>4. Data Protection & Sharing</h2>
        <p>
          We do not sell, rent, or trade your personal data to unauthorized third parties. Information is shared only with partner banks and financial institutions relevant to processing your loan application, with your consent.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:nileshkute43@gmail.com" style={{ color: "#071A3D", fontWeight: "600" }}>nileshkute43@gmail.com</a> or call <a href="tel:8356008675" style={{ color: "#071A3D", fontWeight: "600" }}>+91 8356008675</a>.
        </p>
      </section>

      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #E2E8F0" }}>
        <Link href="/" style={{ color: "#071A3D", fontWeight: "700", textDecoration: "none" }}>← Back to Home</Link>
      </div>
    </div>
  );
}
