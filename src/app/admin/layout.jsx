import styles from "./Admin.module.css";

export const metadata = {
  title: "Admin Panel | Nilesh Kute",
  description: "Admin dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F8FA" }}>
      {/* Admin Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLogo}>
          <span className={styles.topBarTitle}>
            NILESH KUTE
          </span>
          <span className={styles.topBarBadge}>
            Admin Panel
          </span>
        </div>
        <a href="/" className={styles.backBtn}>
          ← Back to Website
        </a>
      </div>

      {/* Admin Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.cardContainer}>
          {children}
        </div>
      </div>
    </div>
  );
}
