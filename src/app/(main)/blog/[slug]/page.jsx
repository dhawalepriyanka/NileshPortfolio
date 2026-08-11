import { articles } from "../page";
import styles from "../Blog.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Nilesh Kute Blog`,
    description: article.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className={styles.main}>
      <section className={styles.hero} style={{ padding: "50px 0" }}>
        <div className="container">
          <Link href="/blog" style={{ color: "#D9A62E", fontWeight: "600", marginBottom: "15px", display: "inline-block" }}>
            ← Back to Knowledge Center
          </Link>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginBottom: "10px" }}>
            {article.category} • {new Date(article.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          <h1 className={styles.title} style={{ fontSize: "2.2rem", maxWidth: "900px" }}>
            {article.title}
          </h1>
          <div style={{ color: "rgba(255,255,255,0.9)", marginTop: "10px" }}>
            By Nilesh Kute — Home Loan Consultant
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", backgroundColor: "#fff" }}>
        <div className="container" style={{ maxWidth: "850px" }}>
          <div style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333", whiteSpace: "pre-line" }}>
            {article.content}
          </div>

          <div style={{
            marginTop: "50px",
            padding: "30px",
            background: "#F7F8FA",
            borderRadius: "8px",
            borderLeft: "4px solid #D9A62E"
          }}>
            <h3 style={{ color: "#071A3D", marginBottom: "10px" }}>Have Questions About Your Home Loan?</h3>
            <p style={{ color: "#555", marginBottom: "20px" }}>
              Get personalized guidance and free consultation from Nilesh Kute (11+ years of experience).
            </p>
            <a href="/apply" className="btn">Get Free Consultation</a>
          </div>
        </div>
      </section>
    </div>
  );
}
