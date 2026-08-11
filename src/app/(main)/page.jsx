import Link from "next/link";
import styles from "./Home.module.css";
import Image from "next/image";
import EMICalculator from "@/components/EMICalculator";
import FreeConsultation from "@/components/FreeConsultation";
import TrustStats from "@/components/TrustStats";

export default function Home() {
  return (
    <div className={styles.main}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.experienceBadge}>11+ Years of Experience</span>
            <h1 className={styles.heroTitle}>Your Home Loan, <br/>Guided by an Expert.</h1>
            <p className={styles.heroDesc}>
              Get professional assistance for Home Loans, Balance Transfer, Top-Up Loans, Loan Against Property, Personal Loans and Business Loans.
            </p>
            <ul className={styles.trustPoints}>
              <li>✓ Fast Processing</li>
              <li>✓ Trusted Guidance</li>
              <li>✓ Document Support</li>
              <li>✓ End-to-End Assistance</li>
            </ul>
            <div className={styles.heroCta}>
              <a href="/apply" className={styles.primaryBtn}>Apply Now</a>
              <a href="https://wa.me/918356008675" target="_blank" rel="noreferrer" className={styles.secondaryBtn}>WhatsApp Me</a>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            <div className={styles.imageDecor}></div>
            <Image 
              src="/nilesh-kute.png" 
              alt="Nilesh Kute - Home Loan Consultant" 
              width={500} 
              height={600} 
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS */}
      <TrustStats />

      {/* 3. WHO WE HELP */}
      <section className={styles.sectionLight}>
        <div className="container">
          <h2 className="text-center mb-4">Who We Help</h2>
          <div className={styles.grid3}>
            {["Salaried Professionals", "Self-Employed Professionals", "Business Owners", "NRI Customers", "First-Time Home Buyers", "Existing Home Loan Customers"].map(audience => (
              <div key={audience} className={styles.card}>
                <div className={styles.iconPlaceholder}>👤</div>
                <h3>{audience}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FIND YOUR LOAN SOLUTION */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4">What are you looking for?</h2>
          <div className={styles.solutionList}>
            <Link href="/home-loan" className={styles.solutionItem}>
              <span>I want to buy a home</span>
              <span className={styles.arrow}>→ Home Loan</span>
            </Link>
            <Link href="/home-construction-loan" className={styles.solutionItem}>
              <span>I want to construct a home</span>
              <span className={styles.arrow}>→ Home Construction Loan</span>
            </Link>
            <Link href="/home-renovation-loan" className={styles.solutionItem}>
              <span>I want to renovate my home</span>
              <span className={styles.arrow}>→ Home Renovation Loan</span>
            </Link>
            <Link href="/home-loan-balance-transfer" className={styles.solutionItem}>
              <span>I want to manage my existing home loan</span>
              <span className={styles.arrow}>→ Balance Transfer</span>
            </Link>
            <Link href="/top-up-loan" className={styles.solutionItem}>
              <span>I need additional funds</span>
              <span className={styles.arrow}>→ Top-Up Loan / LAP</span>
            </Link>
            <Link href="/business-loan" className={styles.solutionItem}>
              <span>I need funds for my business</span>
              <span className={styles.arrow}>→ Business Loan</span>
            </Link>
            <Link href="/personal-loan" className={styles.solutionItem}>
              <span>I need personal funds</span>
              <span className={styles.arrow}>→ Personal Loan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SERVICES */}
      <section className={styles.sectionDark}>
        <div className="container">
          <h2 className="text-center mb-4" style={{color: 'white'}}>Loan Solutions for Every Need</h2>
          <div className={styles.grid4}>
            {[
              {title: "Home Loan", link: "/home-loan"},
              {title: "Home Construction Loan", link: "/home-construction-loan"},
              {title: "Home Renovation Loan", link: "/home-renovation-loan"},
              {title: "Balance Transfer", link: "/home-loan-balance-transfer"},
              {title: "Top-Up Loan", link: "/top-up-loan"},
              {title: "Loan Against Property", link: "/loan-against-property"},
              {title: "Plot Purchase Loan", link: "/plot-purchase-loan"},
              {title: "Business Loan", link: "/business-loan"},
              {title: "Personal Loan", link: "/personal-loan"}
            ].map(service => (
              <div key={service.title} className={styles.serviceCard}>
                <h3>{service.title}</h3>
                <div className={styles.serviceCta}>
                  <Link href={service.link}>Learn More</Link>
                  <a href="/apply" className={styles.applyText}>Apply Now</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE NILESH KUTE */}
      <section className="section">
        <div className="container text-center">
          <h2 className="mb-4">Why Customers Choose Nilesh Kute</h2>
          <div className={styles.grid4}>
            {["11 Years of Industry Experience", "Free Initial Consultation", "Personalized Loan Guidance", "Documentation Assistance", "Fast Processing", "Competitive Interest Guidance", "Doorstep Service", "End-to-End Assistance"].map(reason => (
              <div key={reason} className={styles.reasonCard}>
                <div className={styles.checkIcon}>✓</div>
                <p>{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LOAN PROCESS */}
      <section className={styles.sectionLight}>
        <div className="container">
          <h2 className="text-center mb-4">The Loan Process</h2>
          <div className={styles.processSteps}>
            {[
              {step: "01", title: "Consultation", desc: "Discuss the customer's requirements."},
              {step: "02", title: "Eligibility Check", desc: "Understand approximate eligibility."},
              {step: "03", title: "Document Review", desc: "Guide about required documentation."},
              {step: "04", title: "Application", desc: "Proceed with suitable loan option."},
              {step: "05", title: "Processing", desc: "Application is processed with the lender."},
              {step: "06", title: "Approval", desc: "Complete approval formalities."},
              {step: "07", title: "Disbursement", desc: "Complete the loan journey."}
            ].map((s) => (
              <div key={s.step} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.step}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <p className={styles.disclaimerSmall}>* Note: We do not promise guaranteed approval. Approval is subject to lender policies.</p>
        </div>
      </section>

      {/* 8. EMI CALCULATOR */}
      <EMICalculator />

      {/* 9. BEFORE YOU APPLY & REJECTION */}
      <section className="section">
        <div className="container">
          <div className={styles.splitSection}>
            <div className={styles.splitContent}>
              <h2>Before Applying for a Home Loan</h2>
              <ul className={styles.checkList}>
                <li>✓ Check your CIBIL score</li>
                <li>✓ Understand your eligibility</li>
                <li>✓ Keep documents ready</li>
                <li>✓ Calculate affordable EMI</li>
                <li>✓ Understand loan tenure</li>
                <li>✓ Review applicable charges</li>
                <li>✓ Understand your income obligations</li>
                <li>✓ Get professional guidance</li>
              </ul>
              <a href="/apply" className="btn mt-4">Get Free Consultation</a>
            </div>
            <div className={styles.splitContentAlt}>
              <h2>Home Loan Rejected?</h2>
              <p>Common reasons for rejection include:</p>
              <ul className={styles.bulletList}>
                <li>Low / weak credit profile</li>
                <li>High existing obligations</li>
                <li>Insufficient income</li>
                <li>Documentation issues</li>
                <li>Employment/business history</li>
                <li>Property-related concerns</li>
                <li>Lender-specific eligibility criteria</li>
              </ul>
              <a href="/apply" className="btn-secondary mt-4">Get Your Case Reviewed</a>
              <p className={styles.disclaimerSmall} style={{marginTop: '10px'}}>* Note: Getting your case reviewed does not guarantee approval.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FREE CONSULTATION FORM */}
      <FreeConsultation />
    </div>
  );
}
