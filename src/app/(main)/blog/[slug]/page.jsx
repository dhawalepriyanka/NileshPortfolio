import styles from "../Blog.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Nilesh Kute Blog`,
    description: article.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);

  if (!article) {
    notFound();
  }

  const embedUrl = getYouTubeEmbedUrl(article.youtubeUrl);

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
          {article.imageUrl && (
            <div style={{ width: "100%", maxHeight: "420px", overflow: "hidden", borderRadius: "10px", marginBottom: "35px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <img src={article.imageUrl} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {embedUrl && (
            <div style={{ marginBottom: "35px" }}>
              <div style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                borderRadius: "12px",
                boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                backgroundColor: "#000"
              }}>
                <iframe
                  src={embedUrl}
                  title={article.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    borderRadius: "12px"
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

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
