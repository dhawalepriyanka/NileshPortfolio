import Link from "next/link";
import styles from "./Blog.module.css";

export const metadata = {
  title: "Loan Knowledge Center | Nilesh Kute",
  description: "Read expert articles on home loans, CIBIL scores, EMI tips, government schemes and more from Nilesh Kute.",
};

export const articles = [
  {
    title: "How to Improve Your CIBIL Score Before Applying for a Home Loan",
    excerpt: "Your CIBIL score plays a critical role in home loan approval. Learn actionable tips to boost your credit score before you apply.",
    category: "CIBIL Score",
    date: "2026-08-01",
    slug: "improve-cibil-score",
    content: `Your CIBIL score (credit score) is one of the most important metrics that banks and financial institutions evaluate when considering your home loan application. A high credit score (typically 750 or above) not only increases your approval chances but also helps you secure lower interest rates and better loan terms.

### Key Steps to Boost Your Credit Score:
1. **Pay All Dues on Time**: Timely repayment of credit card bills and existing EMIs accounts for a major portion of your credit score. Never miss or delay a payment.
2. **Keep Credit Utilization Low**: Try to keep your credit card utilization ratio below 30% of your total limit. High utilization indicates credit dependence.
3. **Avoid Too Many Loan Applications**: Multiple hard inquiries in a short timeframe make you appear credit-hungry, which can temporarily reduce your score.
4. **Check Your Report for Errors**: Regularly pull your CIBIL report and dispute any errors or incorrect delinquency reporting.
5. **Maintain a Mix of Credit**: A healthy balance of secured (e.g., car loan, home loan) and unsecured credit (e.g., credit card) demonstrates responsible credit management.`
  },
  {
    title: "Home Loan Balance Transfer: When Does It Make Sense?",
    excerpt: "Thinking of transferring your home loan to another lender? Here is everything you need to know about balance transfers.",
    category: "Balance Transfer",
    date: "2026-07-25",
    slug: "home-loan-balance-transfer-guide",
    content: `A Home Loan Balance Transfer allows you to move your outstanding home loan from your current bank to a new lender offering a lower interest rate or better terms.

### When Should You Consider a Balance Transfer?
- **Significant Interest Rate Difference**: If another lender offers a rate that is at least 0.50% to 1.00% lower than your current rate.
- **Early Stage of Loan Tenure**: Balance transfers yield maximum savings during the first 5 to 10 years of a long-term loan when interest component is highest.
- **Better Customer Service / Top-Up Facility**: When you need an additional top-up loan at home loan interest rates or desire better digital service.`
  },
  {
    title: "Top 5 Reasons Home Loan Applications Get Rejected",
    excerpt: "Understanding why loan applications fail can help you prepare better. Here are the most common reasons for rejection.",
    category: "Home Loan",
    date: "2026-07-18",
    slug: "home-loan-rejection-reasons",
    content: `Home loan rejections can be frustrating, but understanding the root causes allows you to fix deficiencies before re-applying.

### 5 Common Reasons:
1. **Low CIBIL Score or Delinquent History**: Scores below 650 or past defaults flag high risk.
2. **High Existing Debt Obligations**: If your total monthly EMIs exceed 50% of your net monthly income (FOIR), lenders may hesitate to extend further credit.
3. **Property Legal or Valuation Issues**: Title disputes, unapproved building plans, or valuation shortfalls by bank panel valuers.
4. **Unstable Employment / Income Proof**: Frequent job switches or insufficient ITR documentation for self-employed individuals.
5. **Incomplete or Inconsistent Paperwork**: Mismatches between application details and submitted documents.`
  },
  {
    title: "Understanding EMI: How Is Your Home Loan EMI Calculated?",
    excerpt: "Learn the formula behind EMI calculation and how factors like loan amount, tenure, and interest rate affect your monthly payment.",
    category: "EMI Tips",
    date: "2026-07-10",
    slug: "how-emi-calculated",
    content: `Equated Monthly Installment (EMI) consists of two parts: Principal repayment and Interest payment.

### The EMI Formula:
**EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]**
- **P** = Principal Loan Amount
- **R** = Monthly Interest Rate (Annual Rate ÷ 12 ÷ 100)
- **N** = Loan Tenure in Months

### Key Takeaways:
- Longer tenure reduces your monthly EMI but increases total interest paid over time.
- Prepaying principal amounts early in your tenure drastically cuts your interest burden.`
  },
  {
    title: "Documents Required for Home Loan: A Complete Checklist",
    excerpt: "A comprehensive guide to all the documents you will need when applying for a home loan as a salaried or self-employed applicant.",
    category: "Loan Documents",
    date: "2026-07-01",
    slug: "documents-required-home-loan",
    content: `Having your documents organized speeds up the loan sanction and disbursement process significantly.

### Mandatory Documents Checklist:
- **KYC Documents**: PAN Card, Aadhaar Card, Passport/Voter ID.
- **Salaried Applicants**: 3 months salary slips, 6 months bank statement, Form 16 / ITR for 2 years, Offer letter.
- **Self-Employed Applicants**: 3 years ITR with computation, audited Balance Sheet & P&L, 12 months bank statement, Business Registration / GST certificate.
- **Property Documents**: Sales agreement, Allotment letter, Chain of title deeds, Approved building plan.`
  },
  {
    title: "What Is PMAY? Pradhan Mantri Awas Yojana Explained",
    excerpt: "Learn about the government housing scheme PMAY, who is eligible, and how much subsidy you can get on your home loan.",
    category: "Government Schemes",
    date: "2026-06-20",
    slug: "pmay-explained",
    content: `Pradhan Mantri Awas Yojana (PMAY) is a flagship initiative by the Government of India aiming to provide affordable housing to urban and rural poor, economically weaker sections (EWS), low income groups (LIG), and middle income groups (MIG).

### Key Highlights:
- **Credit Linked Subsidy Scheme (CLSS)**: Interest subsidy on home loans for eligible first-time homebuyers.
- **Eligibility**: The applicant or family members must not own a pucca house anywhere in India.
- **Beneficiary Categories**: EWS, LIG, MIG-I, and MIG-II based on annual household income.`
  }
];

export default function BlogPage() {
  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.title}>Loan Knowledge Center</h1>
          <p className={styles.subtitle}>Expert insights to help you make informed financial decisions.</p>
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className="container">
          <div className={styles.grid}>
            {articles.map((article, i) => (
              <article key={i} className={styles.blogCard}>
                <div className={styles.category}>{article.category}</div>
                <h2 className={styles.blogTitle}>
                  <a href={`/blog/${article.slug}`}>{article.title}</a>
                </h2>
                <p className={styles.excerpt}>{article.excerpt}</p>
                <div className={styles.meta}>
                  <span className={styles.date}>
                    {new Date(article.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className={styles.author}>By Nilesh Kute</span>
                </div>
                <a href={`/blog/${article.slug}`} className={styles.readMore}>
                  Read More →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
