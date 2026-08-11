"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./StickyMobileCTA.module.css";

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only show on mobile
    const checkVisibility = () => {
      setIsVisible(window.innerWidth < 768);
    };
    
    checkVisibility();
    window.addEventListener("resize", checkVisibility);
    
    return () => window.removeEventListener("resize", checkVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.stickyBar}>
      <a href="tel:8356008675" className={`${styles.ctaItem} ${styles.callBtn}`}>
        Call Now
      </a>
      <a href="https://wa.me/918356008675" target="_blank" rel="noreferrer" className={`${styles.ctaItem} ${styles.waBtn}`}>
        WhatsApp
      </a>
      <a href="/apply" className={`${styles.ctaItem} ${styles.applyBtn}`}>
        Apply Now
      </a>
    </div>
  );
}


