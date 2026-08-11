import Link from "next/link";
import styles from "./Services.module.css";

export const metadata = {
  title: "Loan Services | Nilesh Kute",
  description: "Explore our range of loan services including Home Loans, Balance Transfers, Top-Up Loans, LAP, Personal Loans, and Business Loans.",
};

const servicesList = [
  {
    title: "Home Loan",
    desc: "Achieve your dream of owning a home with customized home loan solutions tailored to your financial profile.",
    link: "/home-loan",
    icon: "🏠"
  },
  {
    title: "Balance Transfer",
    desc: "Transfer your existing high-interest home loan to a lower interest rate to reduce your EMI burden.",
    link: "/home-loan-balance-transfer",
    icon: "🔄"
  },
  {
    title: "Top-Up Loan",
    desc: "Get additional funds over your existing home loan for personal or professional needs at lower rates.",
    link: "/top-up-loan",
    icon: "📈"
  },
  {
    title: "Loan Against Property",
    desc: "Unlock the value of your property to secure funds for business expansion or major personal expenses.",
    link: "/loan-against-property",
    icon: "🏢"
  },
  {
    title: "Home Construction Loan",
    desc: "Build your dream home on your plot with phase-wise disbursement based on construction progress.",
    link: "/home-construction-loan",
    icon: "🏗️"
  },
  {
    title: "Business Loan",
    desc: "Fuel your business growth with collateral-free or secured business loans.",
    link: "/business-loan",
    icon: "💼"
  },
  {
    title: "Personal Loan",
    desc: "Quick, hassle-free personal loans for medical emergencies, weddings, or travel.",
    link: "/personal-loan",
    icon: "💰"
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
              <div key={index} className={styles.serviceCard}>
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
