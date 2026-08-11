import styles from "./FAQ.module.css";

export const metadata = {
  title: "Frequently Asked Questions | Nilesh Kute",
  description: "Find answers to common questions about home loans, eligibility, CIBIL scores, and the loan application process.",
};

const faqs = [
  { q: "How much home loan can I get?", a: "Your home loan eligibility depends on your income, age, existing liabilities, credit score, and the lender's policies. Typically, lenders offer up to 80-90% of the property value." },
  { q: "What CIBIL score is required?", a: "A CIBIL score of 750 or above is generally considered excellent for home loans, often getting you lower interest rates. However, loans can sometimes be secured with a score of 650+, though terms may vary." },
  { q: "What documents are required?", a: "Basic documents include KYC (PAN, Aadhaar), income proof (Salary slips/ITR), bank statements (last 6 months), and property-related documents." },
  { q: "Can self-employed people get a home loan?", a: "Yes, self-employed individuals can get home loans by providing their business proof, ITR for the last 2-3 years, and audited financials." },
  { q: "What is a balance transfer?", a: "Balance transfer allows you to move your existing outstanding home loan to a new lender offering a lower interest rate, helping you save on interest costs." },
  { q: "What is a top-up loan?", a: "A top-up loan is an additional loan amount you can get on top of your existing home loan for any personal or professional needs, usually at rates similar to home loans." },
  { q: "How is EMI calculated?", a: "EMI is calculated based on the principal loan amount, the interest rate, and the tenure of the loan. You can use our EMI calculator to check yours." },
  { q: "Why can a home loan application be rejected?", a: "Common reasons include a low CIBIL score, high existing debt obligations, insufficient income, unapproved property, or unstable employment history." },
];

export default function FAQPage() {
  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>Answers to help you navigate your home loan journey.</p>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.question}>{faq.q}</h3>
                <p className={styles.answer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
