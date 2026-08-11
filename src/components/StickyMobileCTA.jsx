"use client";
import { useEffect, useState } from "react";
import styles from "./StickyMobileCTA.module.css";

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(true);
  const [phone, setPhone] = useState("8356008675");
  const [whatsapp, setWhatsapp] = useState("918356008675");

  useEffect(() => {
    const checkVisibility = () => {
      setIsVisible(window.innerWidth < 768);
    };
    
    checkVisibility();
    window.addEventListener("resize", checkVisibility);

    fetch(`/api/settings?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.phone) setPhone(data.phone);
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      })
      .catch(() => {});

    return () => window.removeEventListener("resize", checkVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.stickyBar}>
      <a href={`tel:${phone}`} className={`${styles.ctaItem} ${styles.callBtn}`}>
        Call Now
      </a>
      <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className={`${styles.ctaItem} ${styles.waBtn}`}>
        WhatsApp
      </a>
      <a href="/apply" className={`${styles.ctaItem} ${styles.applyBtn}`}>
        Apply Now
      </a>
    </div>
  );
}


