"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./EMICalculator.module.css";

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenureYears]);

  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmountValue = emiValue * n;
      const totalInterestValue = totalAmountValue - p;

      setEmi(Math.round(emiValue));
      setTotalInterest(Math.round(totalInterestValue));
      setTotalAmount(Math.round(totalAmountValue));
    } else {
      setEmi(0);
      setTotalInterest(0);
      setTotalAmount(0);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="text-center mb-4">EMI Calculator</h2>
        <div className={styles.calculatorWrapper}>
          
          {/* Inputs */}
          <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
              <label>Loan Amount (₹)</label>
              <div className={styles.rangeWrapper}>
                <input 
                  type="number" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className={styles.numInput}
                />
                <input 
                  type="range" 
                  min="100000" max="50000000" step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className={styles.rangeInput}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Interest Rate (p.a %)</label>
              <div className={styles.rangeWrapper}>
                <input 
                  type="number" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className={styles.numInput}
                  step="0.1"
                />
                <input 
                  type="range" 
                  min="5" max="20" step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className={styles.rangeInput}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Loan Tenure (Years)</label>
              <div className={styles.rangeWrapper}>
                <input 
                  type="number" 
                  value={tenureYears} 
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className={styles.numInput}
                />
                <input 
                  type="range" 
                  min="1" max="30" step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className={styles.rangeInput}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={styles.resultSection}>
            <div className={styles.resultCard}>
              <h4>Monthly EMI</h4>
              <div className={styles.resultMain}>{formatCurrency(emi)}</div>
              
              <div className={styles.resultSub}>
                <div className={styles.subItem}>
                  <span>Total Interest:</span>
                  <strong>{formatCurrency(totalInterest)}</strong>
                </div>
                <div className={styles.subItem}>
                  <span>Total Payable:</span>
                  <strong>{formatCurrency(totalAmount)}</strong>
                </div>
              </div>

              <div className={styles.ctaBox}>
                <p>Need help understanding your EMI?</p>
                <div className={styles.ctaButtons}>
                  <a href="/apply" className="btn">Apply Now</a>
                  <a href="https://wa.me/918356008675" target="_blank" rel="noreferrer" className="btn-secondary">WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
