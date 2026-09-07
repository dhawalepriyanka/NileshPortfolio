import Link from "next/link";
import styles from "./Home.module.css";
import Image from "next/image";
import EMICalculator from "@/components/EMICalculator";
import FreeConsultation from "@/components/FreeConsultation";
import TrustStats from "@/components/TrustStats";
import { getSetting, getAllSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const title = getSetting("metaHomeTitle", "Nilesh Kute | Expert Home Loan Consultant in Belapur");
  const description = getSetting("metaHomeDesc", "Get personalized guidance for Home Loans, Balance Transfer, Top-Up Loans, and more with Nilesh Kute.");
  const keywords = getSetting("metaHomeKeywords", "Home loan consultant Belapur, Home loan expert, Balance transfer, LAP");

  return { title, description, keywords };
}

export default function Home() {
  const settings = getAllSettings();
  const heroHeadline = settings.heroHeadline || "Your Home Loan, Guided by an Expert.";
  const heroSubtitle = settings.heroSubtitle || "Get personalized assistance for Home Loans, Balance Transfer, Top-Up Loans, Loan Against Property, Personal & Business Loans in Navi Mumbai.";
  const whatsapp = settings.whatsapp || "918356008675";

  return (
    <div className={styles.main}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.experienceBadge}>
              <span>🏆</span> 11+ Years of Trusted Expertise
            </div>
            <h1 className={styles.heroTitle}>
              {heroHeadline}
            </h1>
            <p className={styles.heroDesc}>
              {heroSubtitle}
            </p>
            <ul className={styles.trustPoints}>
              <li><span className={styles.checkIconInline}>✓</span> Fast Processing</li>
              <li><span className={styles.checkIconInline}>✓</span> Trusted Guidance</li>
              <li><span className={styles.checkIconInline}>✓</span> Document Support</li>
              <li><span className={styles.checkIconInline}>✓</span> Doorstep Service</li>
            </ul>
            <div className={styles.heroCta}>
              <a href="/apply" className={styles.primaryBtn}>Apply Now</a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className={styles.secondaryBtn}>WhatsApp Me</a>
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
            <Link href="/reviews" className={styles.floatingCard} title="View all customer reviews">
              <div className={styles.floatingCardIcon}>⭐</div>
              <div className={styles.floatingCardText}>
                <h4>4.9 / 5 Rating</h4>
                <p>1,000+ Happy Families Assisted</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS */}
      <TrustStats />

      {/* 3. WHO WE HELP */}
      <section className={styles.sectionLight}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Who We Assist</h2>
            <p>Tailored loan solutions designed for your specific employment and financial background.</p>
          </div>
          <div className={styles.grid3}>
            {[
              { title: "Salaried Professionals", icon: "💼", desc: "Corporate employees, government staff & IT professionals seeking high loan eligibility." },
              { title: "Self-Employed Professionals", icon: "⚕️", desc: "Doctors, CAs, Architects & Consultants needing customized income assessment." },
              { title: "Business Owners", icon: "🏢", desc: "Entrepreneurs & business proprietors looking for expansion or home loan funding." },
              { title: "NRI Customers", icon: "✈️", desc: "Non-Resident Indians purchasing residential property or investing in India." },
              { title: "First-Time Home Buyers", icon: "🏡", desc: "Complete step-by-step guidance on PMAY subsidy, documentation & bank selection." },
              { title: "Existing Loan Customers", icon: "🔄", desc: "Home loan borrowers wanting lower ROI balance transfer & top-up funding." }
            ].map(item => (
              <div key={item.title} className={styles.card}>
                <div className={styles.iconPlaceholder}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FIND YOUR LOAN SOLUTION */}
      <section className="section" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>What Are You Looking For?</h2>
            <p>Select your financial goal to find the right loan program for you.</p>
          </div>
          <div className={styles.solutionGrid}>
            <Link href="/services#home-loan" className={styles.solutionCard}>
              <div className={styles.solutionText}>
                <span className={styles.solutionQuestion}>I want to buy a new home</span>
                <span className={styles.solutionName}>Home Loan</span>
              </div>
              <span className={styles.solutionArrow}>→</span>
            </Link>
            <Link href="/services#construction" className={styles.solutionCard}>
              <div className={styles.solutionText}>
                <span className={styles.solutionQuestion}>I want to construct a home</span>
                <span className={styles.solutionName}>Home Construction Loan</span>
              </div>
              <span className={styles.solutionArrow}>→</span>
            </Link>
            <Link href="/services#renovation" className={styles.solutionCard}>
              <div className={styles.solutionText}>
                <span className={styles.solutionQuestion}>I want to renovate my home</span>
                <span className={styles.solutionName}>Home Renovation Loan</span>
              </div>
              <span className={styles.solutionArrow}>→</span>
            </Link>
            <Link href="/services#balance-transfer" className={styles.solutionCard}>
              <div className={styles.solutionText}>
                <span className={styles.solutionQuestion}>I want to lower my existing EMI</span>
                <span className={styles.solutionName}>Balance Transfer</span>
              </div>
              <span className={styles.solutionArrow}>→</span>
            </Link>
            <Link href="/services#topup-loan" className={styles.solutionCard}>
              <div className={styles.solutionText}>
                <span className={styles.solutionQuestion}>I need additional capital</span>
                <span className={styles.solutionName}>Top-Up Loan / LAP</span>
              </div>
              <span className={styles.solutionArrow}>→</span>
            </Link>
            <Link href="/services#business-loan" className={styles.solutionCard}>
              <div className={styles.solutionText}>
                <span className={styles.solutionQuestion}>I need funds for business expansion</span>
                <span className={styles.solutionName}>Business Loan</span>
              </div>
              <span className={styles.solutionArrow}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SERVICES */}
      <section className={styles.sectionDark}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 style={{ color: "white" }}>Loan Solutions for Every Requirement</h2>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>We partner with top PSU & private banks to secure the best loan terms for you.</p>
          </div>
          <div className={styles.grid4}>
            {[
              { title: "Home Loan", icon: "🏠", desc: "Purchase ready or under-construction flat with maximum funding.", link: "/services#home-loan" },
              { title: "Balance Transfer", icon: "🔁", desc: "Transfer existing home loan to lower interest rate & reduce EMI.", link: "/services#balance-transfer" },
              { title: "Top-Up Loan", icon: "📈", desc: "Additional funding on top of home loan for personal or business use.", link: "/services#topup-loan" },
              { title: "Loan Against Property", icon: "🏛️", desc: "Mortgage commercial or residential property for high-value capital.", link: "/services#lap" },
              { title: "Commercial Property Loan", icon: "🏢", desc: "Purchase shop, office space, or commercial unit hassle-free.", link: "/services#commercial" },
              { title: "Personal & Business Loans", icon: "💼", desc: "Quick collateral-free funds for business growth or urgent needs.", link: "/services#personal" },
              { title: "Medical Insurance", icon: "🏥", desc: "Comprehensive health insurance plans for family medical protection.", link: "/services" },
              { title: "Mutual Funds", icon: "📊", desc: "SIP & lump sum mutual fund investments to grow long-term wealth.", link: "/services" }
            ].map(service => (
              <div key={service.title} className={styles.serviceCard}>
                <div>
                  <div className={styles.serviceIcon}>{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.desc}</p>
                </div>
                <div className={styles.serviceCta}>
                  <Link href={service.link}>Learn More</Link>
                  <a href="/apply" className={styles.applyText}>Apply Now →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE NILESH KUTE */}
      <section className="section" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Why Customers Choose Nilesh Kute</h2>
            <p>11+ years of transparent service, expert banking network, and customer-first commitment.</p>
          </div>
          <div className={styles.grid4}>
            {[
              "11+ Years Banking Experience",
              "100% Free Initial Consultation",
              "Personalized Bank Comparison",
              "Full Documentation Support",
              "Fast & Hassle-Free Sanctions",
              "Doorstep Document Collection",
              "Lowest ROI Negotiation",
              "End-to-End Disbursement Guidance"
            ].map(reason => (
              <div key={reason} className={styles.reasonCard}>
                <div className={styles.checkIcon}>✓</div>
                <p>{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LOAN PROCESS */}
      <section className="section" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Simple 7-Step Loan Process</h2>
            <p>From initial discussion to final loan disbursement, we guide you through every milestone.</p>
          </div>
          <div className={styles.processSteps}>
            {[
              { step: "Step 01", title: "Free Consultation", desc: "Discuss your requirement, budget, and property details." },
              { step: "Step 02", title: "Eligibility Check", desc: "Calculate maximum loan eligibility across multiple banks." },
              { step: "Step 03", title: "Document Review", desc: "Compile and organize all required financial paperwork." },
              { step: "Step 04", title: "Bank Selection", desc: "Select the bank offering the best interest rate and terms." },
              { step: "Step 05", title: "Application Processing", desc: "Submit application and handle technical/legal verification." },
              { step: "Step 06", title: "Sanction Letter", desc: "Receive official bank sanction with approved loan terms." },
              { step: "Step 07", title: "Disbursement", desc: "Complete agreement signing and receive loan disbursement." }
            ].map((s) => (
              <div key={s.step} className={styles.stepCard}>
                <span className={styles.stepBadge}>{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <p className={styles.disclaimerSmall}>* Note: Final loan sanction and disbursement depend on bank underwriting guidelines.</p>
        </div>
      </section>

      {/* 8. EMI CALCULATOR */}
      <EMICalculator />

      {/* 9. BEFORE YOU APPLY & REJECTION */}
      <section className="section" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className={styles.splitSection}>
            <div className={styles.splitContent}>
              <h2>Before Applying for a Home Loan</h2>
              <p style={{ color: "#64748B", fontSize: "0.95rem" }}>Key steps to ensure maximum approval probability:</p>
              <ul className={styles.checkList}>
                <li>✓ Check your CIBIL credit score (750+ recommended)</li>
                <li>✓ Calculate affordable EMI within monthly income</li>
                <li>✓ Keep 6 months bank statements and ITR ready</li>
                <li>✓ Check property legal approval and title chain</li>
                <li>✓ Understand processing fee and hidden charges</li>
                <li>✓ Get expert guidance before bank application</li>
              </ul>
              <a href="/apply" className="btn mt-4">Get Free Consultation</a>
            </div>

            <div className={styles.splitContentAlt}>
              <h2>Home Loan Application Rejected?</h2>
              <p style={{ color: "#64748B", fontSize: "0.95rem" }}>Common rejection triggers we help resolve:</p>
              <ul className={styles.bulletList}>
                <li>Low CIBIL score or past payment delay</li>
                <li>High existing EMI obligations ratio (FOIR)</li>
                <li>Insufficient or unorganized income proof</li>
                <li>Property technical/legal approval issues</li>
                <li>Multiple simultaneous bank applications</li>
              </ul>
              <a href="/apply" className="btn-secondary mt-4">Get Case Reviewed</a>
              <p className={styles.disclaimerSmall} style={{ marginTop: "12px", textAlign: "left" }}>
                * Case review does not guarantee approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FREE CONSULTATION FORM */}
      <FreeConsultation />
    </div>
  );
}
