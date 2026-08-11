"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./EligibilityCalculator.module.css";

export default function EligibilityCalculator() {
  const [income, setIncome] = useState(50000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [employmentType, setEmploymentType] = useState("Salaried");
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [eligibility, setEligibility] = useState(null);

  const calculate = () => {
    const multiplier = employmentType === "Salaried" ? 0.55 : 0.5;
    const availableEMI = income * multiplier - existingEMI;
    if (availableEMI <= 0) { setEligibility(0); return; }
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const loanAmount = availableEMI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    setEligibility(Math.round(loanAmount));
  };

  const fmt = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

  return (
    <section className="section">
      <div className="container">
        <h2 className="text-center mb-4">Loan Eligibility Calculator</h2>
        <div className={styles.wrapper}>
          <div className={styles.inputs}>
            <div className={styles.group}>
              <label>Monthly Income (₹)</label>
              <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className={styles.input} />
              <input type="range" min="10000" max="500000" step="5000" value={income} onChange={e => setIncome(Number(e.target.value))} className={styles.range} />
            </div>
            <div className={styles.group}>
              <label>Existing Monthly EMI (₹)</label>
              <input type="number" value={existingEMI} onChange={e => setExistingEMI(Number(e.target.value))} className={styles.input} />
              <input type="range" min="0" max="100000" step="1000" value={existingEMI} onChange={e => setExistingEMI(Number(e.target.value))} className={styles.range} />
            </div>
            <div className={styles.group}>
              <label>Employment Type</label>
              <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} className={styles.input}>
                <option value="Salaried">Salaried</option>
                <option value="Self Employed">Self Employed</option>
                <option value="NRI">NRI</option>
              </select>
            </div>
            <div className={styles.group}>
              <label>Loan Tenure (Years)</label>
              <input type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} className={styles.input} />
              <input type="range" min="1" max="30" step="1" value={tenure} onChange={e => setTenure(Number(e.target.value))} className={styles.range} />
            </div>
            <div className={styles.group}>
              <label>Expected Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className={styles.input} step="0.1" />
              <input type="range" min="5" max="20" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className={styles.range} />
            </div>
            <button onClick={calculate} className={styles.calcBtn}>Check Eligibility</button>
          </div>

          <div className={styles.result}>
            {eligibility === null ? (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>🏠</div>
                <p>Fill in your details and click<br /><strong>Check Eligibility</strong></p>
              </div>
            ) : (
              <div className={styles.resultCard}>
                <h4>Estimated Loan Eligibility</h4>
                <div className={styles.amount}>{fmt(eligibility)}</div>
                <p className={styles.disclaimer}>
                  This is an indicative estimate only. Actual eligibility depends on lender policies, income, credit profile, documentation and other factors.
                </p>
                <div className={styles.ctaButtons}>
                  <a href="/apply" className="btn">Apply Now</a>
                  <a href="https://wa.me/918356008675" target="_blank" rel="noreferrer" className="btn-secondary">WhatsApp</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
