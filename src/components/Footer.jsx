import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.col}>
            <div className={styles.logoText}>NILESH KUTE</div>
            <div className={styles.logoSubText}>Home Loan Consultant</div>
            <p className={styles.tagline}>Turning Dreams into Reality</p>
            <div className={styles.socials}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                YouTube
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/calculators">Calculators</Link></li>
              <li><Link href="/documents-required">Documents</Link></li>
              <li><Link href="/cibil-guide">CIBIL Guide</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services Column */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.linkList}>
              <li><Link href="/services#home-loan">Home Loans</Link></li>
              <li><Link href="/services#balance-transfer">Balance Transfer</Link></li>
              <li><Link href="/services#topup-loan">Top-Up Loan</Link></li>
              <li><Link href="/services#lap">Loan Against Property</Link></li>
              <li><Link href="/services#commercial">Commercial Loan</Link></li>
              <li><Link href="/services#personal">Personal & Business Loans</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.contactList}>
              <li>📍 Belapur, Navi Mumbai</li>
              <li>📞 <a href="tel:8356008675">+91 8356008675</a></li>
              <li>✉️ <a href="mailto:nileshkute43@gmail.com">nileshkute43@gmail.com</a></li>
              <li>💬 <a href="https://wa.me/918356008675" target="_blank" rel="noreferrer">WhatsApp Chat</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} Nilesh Kute. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <a href="/apply" className={styles.applyBtn}>Apply for Loan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
