import Link from "next/link";
import styles from "./Services.module.css";
import { getSetting } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const title = getSetting("metaServicesTitle", "Loan Services | Nilesh Kute");
  const description = getSetting("metaServicesDesc", "Explore our range of loan services including Home Loans, Balance Transfers, Top-Up Loans, LAP, Personal Loans, and Business Loans.");

  return { title, description };
}

const servicesList = [
  {
    id: "home-loan",
    title: "Home Loan",
    desc: "Achieve your dream of owning a home with customized home loan solutions tailored to your financial profile.",
    link: "/apply",
    icon: "🏠"
  },
  {
    id: "balance-transfer",
    title: "Balance Transfer",
    desc: "Transfer your existing high-interest home loan to a lower interest rate to reduce your EMI burden.",
    link: "/apply",
    icon: "🔄"
  },
  {
    id: "topup-loan",
    title: "Top-Up Loan",
    desc: "Get additional funds over your existing home loan for personal or professional needs at lower rates.",
    link: "/apply",
    icon: "📈"
  },
  {
    id: "lap",
    title: "Loan Against Property (LAP)",
    desc: "Unlock the value of your property to secure funds for business expansion or major personal expenses.",
    link: "/apply",
    icon: "🏛️"
  },
  {
    id: "construction",
    title: "Home Construction Loan",
    desc: "Build your dream home on your plot with phase-wise disbursement based on construction progress.",
    link: "/apply",
    icon: "🏗️"
  },
  {
    id: "renovation",
    title: "Home Renovation Loan",
    desc: "Renovate, repair, or extend your existing home with quick and affordable loan sanctions.",
    link: "/apply",
    icon: "🛠️"
  },
  {
    id: "business-loan",
    title: "Business Loan",
    desc: "Fuel your business growth with collateral-free or secured business loans.",
    link: "/apply",
    icon: "💼"
  },
  {
    id: "personal",
    title: "Personal Loan",
    desc: "Quick, hassle-free personal loans for medical emergencies, weddings, or travel.",
    link: "/apply",
    icon: "💰"
  },
  {
    id: "commercial",
    title: "Commercial Property Loan",
    desc: "Purchase shop, office space, or commercial property with competitive interest rates.",
    link: "/apply",
    icon: "🏢"
  },
  {
    id: "medical-insurance",
    title: "Medical Insurance",
    desc: "Comprehensive health & medical insurance plans to protect you and your family against medical emergencies.",
    link: "/apply",
    icon: "🏥"
  },
  {
    id: "mutual-funds",
    title: "Mutual Funds",
    desc: "Expert guidance for SIP & lump sum mutual fund investments to grow your wealth.",
    link: "/apply",
    icon: "📊"
  }
];

export default function ServicesPage() {
  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.title}>Loan Solutions for Every Need</h1>
          <p className={styles.subtitle}>Expert guidance to help you choose the right financial product.</p>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className="container">
          <div className={styles.grid}>
            {servicesList.map((service, index) => (
              <div key={index} id={service.id} className={styles.serviceCard} style={{ scrollMarginTop: "100px" }}>
                <div className={styles.icon}>{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <div className={styles.ctaBox}>
                  <a href="/apply" className={styles.applyBtn}>Apply Now</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
