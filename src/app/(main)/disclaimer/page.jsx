import Link from "next/link";

export const metadata = {
  title: "Disclaimer | Nilesh Kute - Home Loan Consultant",
  description: "Disclaimer for Nilesh Kute Home Loan Consultancy website and loan guidance services.",
};

export default function DisclaimerPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", color: "#334155", lineHeight: "1.7" }}>
      <h1 style={{ color: "#071A3D", fontSize: "2.2rem", fontWeight: "800", marginBottom: "15px" }}>Disclaimer</h1>
      <p style={{ fontSize: "0.9rem", color: "#64748B", marginBottom: "30px" }}>Last updated: August 2026</p>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>1. Direct Selling Agent (DSA) Role</h2>
        <p>
          Nilesh Kute operates as an independent Home Loan & Financial Consultant / Direct Selling Agent. We facilitate loan processing and offer guidance to assist clients in securing loans from registered banks and Non-Banking Financial Companies (NBFCs).
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>2. Bank Sanction Discretion</h2>
        <p>
          All loan approvals, interest rates, processing fees, loan-to-value ratios, tenure, and final disbursements are entirely at the sole discretion of the respective lending bank or financial institution. Nilesh Kute does not guarantee loan approval or specific interest rates.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>3. Calculators & Indicative Estimates</h2>
        <p>
          EMI, eligibility, and interest calculations provided on this website are for illustrative and informational purposes only. Actual EMI and loan amounts may vary based on bank underwriting policies, documentation, credit scores, and property valuations.
        </p>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#071A3D", fontSize: "1.3rem", fontWeight: "700", marginBottom: "10px" }}>4. No Financial Liability</h2>
        <p>
          We are not liable for any losses, delays, or rejections resulting from bank credit decisions, policy changes, or incomplete applicant documentation.
        </p>
      </section>

      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #E2E8F0" }}>
        <Link href="/" style={{ color: "#071A3D", fontWeight: "700", textDecoration: "none" }}>← Back to Home</Link>
      </div>
    </div>
  );
}
