"use client";
import styles from "./TrustStats.module.css";

export default function TrustStats() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.statBox}>
          <h3 className={styles.statNumber}>11+</h3>
          <p className={styles.statLabel}>Years Experience</p>
        </div>
        <div className={styles.statBox}>
          <h3 className={styles.statIcon}>🤝</h3>
          <p className={styles.statLabel}>Personalized Guidance</p>
        </div>
        <div className={styles.statBox}>
          <h3 className={styles.statIcon}>⚡</h3>
          <p className={styles.statLabel}>Fast Processing</p>
        </div>
        <div className={styles.statBox}>
          <h3 className={styles.statIcon}>📝</h3>
          <p className={styles.statLabel}>End-to-End Support</p>
        </div>
      </div>
    </section>
  );
}
