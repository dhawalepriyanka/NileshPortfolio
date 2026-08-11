import styles from "./Contact.module.css";

export const metadata = {
  title: "Contact Nilesh Kute | Home Loan Consultant",
  description: "Get in touch with Nilesh Kute for expert home loan guidance. Call, WhatsApp, or email for a free consultation.",
};

export default function ContactPage() {
  return (
    <div className={styles.main}>
      <section className={styles.contactHero}>
        <div className="container text-center">
          <h1 className={styles.title}>Contact Me</h1>
          <p className={styles.subtitle}>Ready to start your home loan journey? Get in touch today.</p>
        </div>
      </section>

      <section className={styles.contactInfoSection}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.infoCard}>
              <div className={styles.icon}>📞</div>
              <h3>Call Me</h3>
              <p>Available Mon-Sat, 10 AM to 7 PM</p>
              <a href="tel:8356008675" className={styles.link}>+91 8356008675</a>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.icon}>💬</div>
              <h3>WhatsApp</h3>
              <p>Send a message anytime for quick queries.</p>
              <a href="https://wa.me/918356008675" target="_blank" rel="noreferrer" className={styles.link}>Message on WhatsApp</a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.icon}>✉️</div>
              <h3>Email</h3>
              <p>Send your documents or detailed queries.</p>
              <a href="mailto:nileshkute43@gmail.com" className={styles.link}>nileshkute43@gmail.com</a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.icon}>📍</div>
              <h3>Location</h3>
              <p>Belapur, Navi Mumbai</p>
              <span className={styles.linkStatic}>Available for Doorstep Service</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
