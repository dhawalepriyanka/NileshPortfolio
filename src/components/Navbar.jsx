"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("918356008675");
  const pathname = usePathname();

  useEffect(() => {
    fetch(`/api/settings?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      })
      .catch(() => {});
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Calculators", path: "/calculators" },
    { name: "Documents", path: "/documents-required" },
    { name: "CIBIL Guide", path: "/cibil-guide" },
    { name: "Blogs", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <div className={styles.logoText}>NILESH KUTE</div>
            <div className={styles.logoSubText}>Home Loan Consultant</div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className={`${styles.navLink} ${pathname === link.path ? styles.active : ""}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right CTA */}
        <div className={styles.headerCta}>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className={styles.whatsappBtn}>
            WhatsApp
          </a>
          <a href="/apply" className={styles.applyBtn}>
            Apply Now
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`${styles.bar} ${isOpen ? styles.barOpen1 : ""}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen2 : ""}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen3 : ""}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`${styles.mobileNav} ${isOpen ? styles.mobileNavOpen : ""}`}>
        <ul className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`${styles.mobileNavLink} ${pathname === link.path ? styles.active : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className={styles.mobileCtaWrapper}>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className={styles.mobileWhatsappBtn}>
              WhatsApp
            </a>
            <a href="/apply" className={styles.mobileApplyBtn} onClick={() => setIsOpen(false)}>
              Apply Now
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
