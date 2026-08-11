
import EMICalculator from "@/components/EMICalculator";
import EligibilityCalculator from "@/components/EligibilityCalculator";
import styles from "./Calculators.module.css";

export const metadata = {
  title: "Loan Calculators | Nilesh Kute",
  description: "Use our free EMI Calculator and Eligibility Calculator to plan your home loan. Get accurate estimates for monthly EMI and loan eligibility.",
};

export default function CalculatorsPage() {
  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.title}>Loan Calculators</h1>
          <p className={styles.subtitle}>Plan your finances with our easy-to-use tools. Results are indicative estimates.</p>
        </div>
      </section>

      <div className={styles.calcSection}>
        <EMICalculator />
        <EligibilityCalculator />
      </div>
    </div>
  );
}


