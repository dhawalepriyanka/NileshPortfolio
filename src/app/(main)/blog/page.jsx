import Link from "next/link";
import styles from "./Blog.module.css";
import { getAllBlogs } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Loan Knowledge Center | Nilesh Kute",
  description: "Read expert articles on home loans, CIBIL scores, EMI tips, government schemes and more from Nilesh Kute.",
};

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
            {articles.map((article, i) => (
              <article key={article.id || i} className={styles.blogCard}>
                <div className={styles.category}>{article.category}</div>
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
