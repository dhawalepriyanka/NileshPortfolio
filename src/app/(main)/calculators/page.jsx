
import EMICalculator from "@/components/EMICalculator";
import styles from "./Calculators.module.css";

export const metadata = {
  title: "EMI Calculator | Nilesh Kute",
  description: "Use our free Home Loan EMI Calculator to plan your finances and view your complete repayment schedule.",
};

export default function CalculatorsPage() {
  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.title}>Home Loan EMI Calculator</h1>
          <p className={styles.subtitle}>Plan your finances with accurate monthly EMI estimates and detailed repayment schedules.</p>
        </div>
      </section>

      <div className={styles.calcSection}>
        <EMICalculator />
      </div>
    </div>
  );
}


