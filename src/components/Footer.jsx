import Link from "next/link";
import styles from "./Footer.module.css";
import { getAllSettings } from "@/lib/db";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = getAllSettings();

  const phone = settings.phone || "8356008675";
  const whatsapp = settings.whatsapp || "918356008675";
  const email = settings.email || "nileshkute43@gmail.com";
  const address = settings.address || "Belapur, Navi Mumbai, MH";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* 1. Brand Column */}
          <div className={styles.col}>
            <div className={styles.logoText}>NILESH KUTE</div>
            <div className={styles.logoSubText}>Home Loan Consultant</div>
            <p className={styles.tagline}>
              Professional home loan guidance with 11+ years of experience. Providing doorstep loan assistance across Navi Mumbai & Mumbai.
            </p>
            <div className={styles.socials}>
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className={styles.socialPill} aria-label="Facebook">
                  🌐 Facebook
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className={styles.socialPill} aria-label="Instagram">
                  📸 Instagram
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className={styles.socialPill} aria-label="YouTube">
                  ▶️ YouTube
                </a>
              )}
            </div>
          </div>

          {/* 2. Quick Links Column */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Nilesh</Link></li>
              <li><Link href="/services">Loan Services</Link></li>
              <li><Link href="/calculators">Calculators</Link></li>
              <li><Link href="/reviews">Customer Reviews</Link></li>
              <li><Link href="/documents-required">Documents Checklist</Link></li>
              <li><Link href="/cibil-guide">CIBIL Score Guide</Link></li>
              <li><Link href="/blog">Blogs & Guides</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* 3. Services Column */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Our Services</h4>
            <ul className={styles.linkList}>
              <li><Link href="/services#home-loan">Home Loans</Link></li>
              <li><Link href="/services#balance-transfer">Balance Transfer</Link></li>
              <li><Link href="/services#topup-loan">Top-Up Loans</Link></li>
              <li><Link href="/services#lap">Loan Against Property</Link></li>
              <li><Link href="/services#commercial">Commercial Property</Link></li>
              <li><Link href="/services#personal">Business & Personal</Link></li>
              <li><Link href="/services">Medical Insurance</Link></li>
              <li><Link href="/services">Mutual Funds</Link></li>
            </ul>
          </div>

          {/* 4. Contact Column */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Direct Contact</h4>
            <ul className={styles.contactList}>
              <li>📍 {address}</li>
              <li>📞 <a href={`tel:${phone}`}>+91 {phone}</a></li>
              <li>✉️ <a href={`mailto:${email}`}>{email}</a></li>
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className={styles.waBox}>
                  💬 Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p>© {currentYear} Nilesh Kute (Home Loan Consultant). All rights reserved.</p>
          <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/privacy-policy" style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.85rem", textDecoration: "none" }}>Privacy Policy</Link>
            <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>|</span>
            <Link href="/disclaimer" style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.85rem", textDecoration: "none" }}>Disclaimer</Link>
            <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>|</span>
            <Link href="/terms-and-conditions" style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.85rem", textDecoration: "none" }}>Terms & Conditions</Link>
            <a href="/apply" className={styles.applyFooterBtn} style={{ marginLeft: "5px" }}>Apply for Loan →</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
