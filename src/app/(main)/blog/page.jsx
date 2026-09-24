import Link from "next/link";
import styles from "./Blog.module.css";
import { getAllBlogs } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Loan Knowledge Center | Nilesh Kute",
  description: "Read expert articles on home loans, CIBIL scores, EMI tips, government schemes and more from Nilesh Kute.",
};

function getYouTubeThumbnail(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match && match[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function BlogPage() {
  const articles = getAllBlogs();

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.title}>Loan Knowledge Center</h1>
          <p className={styles.subtitle}>Expert insights to help you make informed financial decisions.</p>
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className="container">
          <div className={styles.grid}>
            {articles.map((article, i) => {
              const displayImage = article.imageUrl || getYouTubeThumbnail(article.youtubeUrl);
              return (
                <article key={article.id || i} className={styles.blogCard}>
                  {displayImage && (
                    <div style={{ position: "relative", width: "100%", height: "190px", overflow: "hidden", borderRadius: "6px 6px 0 0", marginBottom: "15px", backgroundColor: "#071A3D" }}>
                      <img src={displayImage} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {article.youtubeUrl && (
                        <span style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          backgroundColor: "rgba(220, 38, 38, 0.95)",
                          color: "#fff",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                        }}>
                          ▶️ Video
                        </span>
                      )}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className={styles.category}>{article.category}</div>
                    {!displayImage && article.youtubeUrl && (
                      <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: "700" }}>▶️ Video Article</span>
                    )}
                  </div>
                  <h2 className={styles.blogTitle}>
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className={styles.excerpt}>{article.excerpt}</p>
                  <div className={styles.meta}>
                    <span className={styles.date}>
                      {new Date(article.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className={styles.author}>By Nilesh Kute</span>
                  </div>
                  <Link href={`/blog/${article.slug}`} className={styles.readMore}>
                    Read More →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
