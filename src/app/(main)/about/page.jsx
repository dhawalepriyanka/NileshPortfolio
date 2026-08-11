import Link from "next/link";
import Image from "next/image";
import styles from "./About.module.css";

export const metadata = {
  title: "About Nilesh Kute | Home Loan Consultant",
  description: "Nilesh Kute is a Home Loan Consultant with 11 years of experience, helping customers understand their loan options and navigate the home loan process.",
};

export default function AboutPage() {
  return (
    <div className={styles.main}>
      <section className={styles.aboutHero}>
        <div className="container">
          <div className={styles.splitLayout}>
            <div className={styles.imageCol}>
              <div className={styles.imageDecor}></div>
              <div className={styles.imageWrapper}>
                <Image 
                  src="/nilesh-kute.png" 
                  alt="Nilesh Kute" 
                  width={400} 
                  height={500} 
                  className={styles.profileImg}
                  priority
                />
              </div>
            </div>
            
            <div className={styles.contentCol}>
              <span className={styles.badge}>About Me</span>
              <h1 className={styles.heading}>Experienced Home Loan Consultant You Can Trust</h1>
              
              <p className={styles.paragraph}>
                Nilesh Kute is a dedicated Home Loan Consultant with over 11 years of experience in the financial sector. 
                My mission is to help customers thoroughly understand their loan options and seamlessly navigate the often complex home loan process.
              </p>
              
              <div className={styles.focusArea}>
                <h3>What I Focus On:</h3>
                <ul className={styles.focusList}>
                  <li>
                    <span className={styles.icon}>🎯</span>
                    <div>
                      <strong>Personalized Guidance</strong>
                      <p>Every financial journey is unique. I tailor advice to your specific needs.</p>
                    </div>
                  </li>
                  <li>
                    <span className={styles.icon}>📊</span>
                    <div>
                      <strong>Eligibility Understanding</strong>
                      <p>Helping you gauge your borrowing capacity before you apply.</p>
                    </div>
                  </li>
                  <li>
                    <span className={styles.icon}>📋</span>
                    <div>
                      <strong>Documentation Support</strong>
                      <p>Assistance with gathering and organizing the required paperwork.</p>
                    </div>
                  </li>
                  <li>
                    <span className={styles.icon}>🚀</span>
                    <div>
                      <strong>Application Assistance</strong>
                      <p>Smoothing out the application process to avoid common pitfalls.</p>
                    </div>
                  </li>
                  <li>
                    <span className={styles.icon}>🤝</span>
                    <div>
                      <strong>End-to-End Guidance</strong>
                      <p>From initial consultation to final disbursement, I am with you every step of the way.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className={styles.ctaBox}>
                <div className={styles.experienceBox}>
                  <strong>11+</strong>
                  <span>Years Experience</span>
                </div>
                <a href="/apply" className="btn">Talk to Nilesh</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
