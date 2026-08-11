import styles from "./Contact.module.css";
import { getSetting, getAllSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const title = getSetting("metaContactTitle", "Contact Nilesh Kute | Home Loan Consultant");
  const description = getSetting("metaContactDesc", "Get in touch with Nilesh Kute for expert home loan guidance. Call, WhatsApp, or email for a free consultation.");

  return { title, description };
}

export default function ContactPage() {
  const settings = getAllSettings();

  const phone = settings.phone || "8356008675";
  const whatsapp = settings.whatsapp || "918356008675";
  const email = settings.email || "nileshkute43@gmail.com";
  const address = settings.address || "Belapur, Navi Mumbai";

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
              <a href={`tel:${phone}`} className={styles.link}>+91 {phone}</a>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.icon}>💬</div>
              <h3>WhatsApp</h3>
              <p>Send a message anytime for quick queries.</p>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className={styles.link}>Message on WhatsApp</a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.icon}>✉️</div>
              <h3>Email</h3>
              <p>Send your documents or detailed queries.</p>
              <a href={`mailto:${email}`} className={styles.link}>{email}</a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.icon}>📍</div>
              <h3>Location</h3>
              <p>{address}</p>
              <span className={styles.linkStatic}>Available for Doorstep Service</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
