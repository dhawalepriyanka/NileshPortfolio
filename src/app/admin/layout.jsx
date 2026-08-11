import Link from "next/link";

export const metadata = {
  title: "Admin Panel | Nilesh Kute",
  description: "Admin dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F8FA" }}>
      {/* Admin Top Bar */}
      <div style={{
        backgroundColor: "#071A3D",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontWeight: "800", fontSize: "1.2rem", letterSpacing: "1px" }}>
            NILESH KUTE
          </span>
          <span style={{ color: "#D9A62E", fontSize: "0.85rem", fontWeight: "600" }}>
            Admin Panel
          </span>
        </div>
        <a
          href="/"
          style={{
            color: "#D9A62E",
            fontWeight: "600",
            fontSize: "0.9rem",
            border: "1px solid #D9A62E",
            padding: "6px 16px",
            borderRadius: "4px",
            textDecoration: "none"
          }}
        >
          ← Back to Website
        </a>
      </div>

      {/* Admin Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "30px 20px" }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
