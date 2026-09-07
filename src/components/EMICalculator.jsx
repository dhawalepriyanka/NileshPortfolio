"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import styles from "./EMICalculator.module.css";

function money(n) {
  return "₹ " + Math.round(n || 0).toLocaleString("en-IN");
}

function toDDMMYY(date) {
  return (
    String(date.getDate()).padStart(2, "0") +
    "/" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "/" +
    String(date.getFullYear()).slice(-2)
  );
}

function esc(s) {
  return String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export default function EMICalculator() {
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState(4500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [fees, setFees] = useState(0);
  const [startDate, setStartDate] = useState(() => toDDMMYY(new Date()));
  const [statusMsg, setStatusMsg] = useState("");
  const [settings, setSettings] = useState({
    phone: "8356008675",
    whatsapp: "918356008675",
  });

  const nativeDateRef = useRef(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings((prev) => ({
            ...prev,
            phone: data.phone || prev.phone,
            whatsapp: data.whatsapp || prev.whatsapp,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const data = useMemo(() => {
    const P = Math.max(0, Number(amount) || 0);
    const rRate = Math.max(0, Number(rate) || 0);
    const yrs = Math.max(1, Number(years) || 1);
    const feeVal = Math.max(0, Number(fees) || 0);

    const n = yrs * 12;
    const r = rRate / 1200;
    const emi = r
      ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : P / n;

    let bal = P;
    let it = 0;
    const rows = [];

    for (let m = 1; m <= n && bal > 0.005; m++) {
      const interest = bal * r;
      const principal = Math.min(Math.max(emi - interest, 0), bal);
      const close = Math.max(0, bal - principal);
      it += interest;
      rows.push({ m, pr: principal, it: interest, bal: close });
      bal = close;
    }

    return {
      P,
      rate: rRate,
      years: yrs,
      n,
      fees: feeVal,
      emi,
      it,
      total: P + it,
      rows,
    };
  }, [amount, rate, years, fees]);

  const handleDateInput = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 6);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5);
    setStartDate(v);
  };

  const handleNativeDateChange = (e) => {
    if (e.target.value) {
      const d = new Date(e.target.value + "T00:00:00");
      setStartDate(toDDMMYY(d));
    }
  };

  const openCalendar = () => {
    if (nativeDateRef.current) {
      try {
        if (nativeDateRef.current.showPicker) {
          nativeDateRef.current.showPicker();
        } else {
          nativeDateRef.current.click();
        }
      } catch {
        nativeDateRef.current?.click();
      }
    }
  };

  const handleReset = () => {
    setCustomer("");
    setAmount(4500000);
    setRate(8.5);
    setYears(20);
    setFees(0);
    setStartDate(toDDMMYY(new Date()));
    setStatusMsg("Calculator reset to default values.");
    setTimeout(() => setStatusMsg(""), 3500);
  };

  const handleCalculate = () => {
    setStatusMsg("EMI and repayment schedule updated.");
    setTimeout(() => setStatusMsg(""), 3500);
  };

  const downloadPDF = () => {
    try {
      setStatusMsg("Generating professional PDF report...");
      const c = customer.trim() || "Customer";
      const W = 595,
        H = 842,
        M = 32;
      const pages = [];
      let a = [];
      let y;

      function tx(x, yy, size, s, b, w) {
        a.push(
          (w ? "1 1 1" : "0.03 0.10 0.24") +
            " rg BT /" +
            (b ? "F2" : "F1") +
            " " +
            size +
            " Tf " +
            x +
            " " +
            yy +
            " Td (" +
            esc(s) +
            ") Tj ET"
        );
      }

      function fillRect(x, yy, w, h, r, g, b) {
        a.push(
          r + " " + g + " " + b + " rg " + x + " " + yy + " " + w + " " + h + " re f"
        );
      }

      function newPage(sub) {
        a = [];
        pages.push(a);
        fillRect(0, 0, W, H, 0.97, 0.98, 0.99);
        fillRect(0, 770, W, 72, 0.03, 0.10, 0.24); // Navy Header
        tx(M, 812, 18, "HOME LOAN EMI CALCULATOR", true, true);
        tx(M, 794, 9, sub, false, true);
        tx(W - 190, 812, 10, "NILESH KUTE", true, true);
        tx(W - 190, 798, 8.5, settings.phone || "8356008675", false, true);
      }

      function footer() {
        tx(
          M,
          20,
          8,
          `Nilesh Kute | Home Loan Consultant | ${settings.phone || "8356008675"}`
        );
        tx(W - 190, 20, 8, "www.loanwithnilesh.co.in");
      }

      function header() {
        fillRect(M, y - 3, W - 2 * M, 20, 0.03, 0.10, 0.24);
        tx(M + 6, y + 3, 8, "MONTH", true, true);
        tx(120, y + 3, 8, "PRINCIPAL (Rs.)", true, true);
        tx(270, y + 3, 8, "INTEREST (Rs.)", true, true);
        tx(420, y + 3, 8, "BALANCE (Rs.)", true, true);
      }

      newPage("Professional EMI & Repayment Summary");
      fillRect(M, 728, W - 2 * M, 30, 0.95, 0.96, 0.98);
      tx(M + 10, 738, 10, "CUSTOMER & LOAN SUMMARY", true);
      tx(M + 10, 710, 7, "CUSTOMER NAME");
      tx(M + 10, 697, 10, c, true);
      tx(205, 710, 7, "LOAN AMOUNT");
      tx(
        205,
        697,
        10,
        "Rs. " + Math.round(data.P).toLocaleString("en-IN"),
        true
      );
      tx(375, 710, 7, "INTEREST RATE");
      tx(375, 697, 10, data.rate.toFixed(2) + "% p.a.", true);
      tx(M + 10, 668, 7, "TENURE");
      tx(M + 10, 655, 10, data.n + " Months (" + data.years + " Years)", true);
      tx(205, 668, 7, "PROCESSING FEES");
      tx(
        205,
        655,
        10,
        "Rs. " + Math.round(data.fees).toLocaleString("en-IN"),
        true
      );
      tx(375, 668, 7, "DATE");
      tx(375, 655, 10, startDate || toDDMMYY(new Date()), true);

      fillRect(M, 600, W - 2 * M, 38, 0.95, 0.96, 0.98);
      tx(M + 12, 623, 8, "YOUR MONTHLY EMI");
      tx(
        M + 12,
        607,
        17,
        "Rs. " + Math.round(data.emi).toLocaleString("en-IN"),
        true
      );

      fillRect(M, 475, W - 2 * M, 82, 0.95, 0.96, 0.98);
      tx(M + 12, 552, 10, "PAYMENT SUMMARY", true);
      tx(M + 12, 530, 8, "PRINCIPAL");
      tx(
        M + 12,
        515,
        11,
        "Rs. " + Math.round(data.P).toLocaleString("en-IN"),
        true
      );
      tx(215, 530, 8, "TOTAL INTEREST");
      tx(
        215,
        515,
        11,
        "Rs. " + Math.round(data.it).toLocaleString("en-IN"),
        true
      );
      tx(405, 530, 8, "TOTAL PAYMENT");
      tx(
        405,
        515,
        11,
        "Rs. " + Math.round(data.total).toLocaleString("en-IN"),
        true
      );

      tx(M, 375, 12, "MONTHLY REPAYMENT SCHEDULE", true);
      y = 353;
      header();
      y -= 25;

      data.rows.forEach(function (r, i) {
        if (y < 48) {
          footer();
          newPage("Monthly Repayment Schedule - Continued");
          tx(M, 748, 12, "MONTHLY REPAYMENT SCHEDULE", true);
          y = 720;
          header();
          y -= 25;
        }
        if (i % 2 === 0) fillRect(M, y - 5, W - 2 * M, 17, 0.96, 0.98, 1);
        tx(M + 6, y, 7, String(r.m));
        tx(120, y, 7, Math.round(r.pr).toLocaleString("en-IN"));
        tx(270, y, 7, Math.round(r.it).toLocaleString("en-IN"));
        tx(420, y, 7, Math.round(r.bal).toLocaleString("en-IN"));
        y -= 17;
      });
      footer();

      const objs = [];
      const add = (o) => {
        objs.push(o);
        return objs.length;
      };
      const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
      const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
      const pid = add("<< /Type /Pages /Kids [] /Count 0 >>");
      const kids = [];
      pages.forEach((pg) => {
        const stream = pg.join("\n");
        const cid = add(
          "<< /Length " +
            stream.length +
            " >>\nstream\n" +
            stream +
            "\nendstream"
        );
        kids.push(
          add(
            "<< /Type /Page /Parent " +
              pid +
              " 0 R /MediaBox [0 0 " +
              W +
              " " +
              H +
              "] /Resources << /Font << /F1 " +
              f1 +
              " 0 R /F2 " +
              f2 +
              " 0 R >> >> /Contents " +
              cid +
              " 0 R >>"
          )
        );
      });
      objs[pid - 1] =
        "<< /Type /Pages /Kids [" +
        kids.map((k) => k + " 0 R").join(" ") +
        "] /Count " +
        kids.length +
        " >>";
      const root = add("<< /Type /Catalog /Pages " + pid + " 0 R >>");
      let out = "%PDF-1.4\n";
      const offs = [0];
      objs.forEach((o, i) => {
        offs.push(out.length);
        out += i + 1 + " 0 obj\n" + o + "\nendobj\n";
      });
      const x = out.length;
      out += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
      offs.slice(1).forEach((o) => {
        out += String(o).padStart(10, "0") + " 00000 n \n";
      });
      out +=
        "trailer\n<< /Size " +
        (objs.length + 1) +
        " /Root " +
        root +
        " 0 R >>\nstartxref\n" +
        x +
        "\n%%EOF";

      const blob = new Blob([out], { type: "application/pdf" });
      const u = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = u;
      link.download = `EMI_${c.replace(/[^a-z0-9]+/gi, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(u), 5000);
      setStatusMsg("PDF downloaded successfully.");
      setTimeout(() => setStatusMsg(""), 3500);
    } catch (err) {
      console.error(err);
      setStatusMsg("PDF generation error. Please try again.");
    }
  };

  const handleWhatsApp = () => {
    const c = customer.trim() || "Customer";
    const msg =
      `Home Loan EMI Calculation\n\n` +
      `Customer: ${c}\n` +
      `Loan Amount: ${money(data.P)}\n` +
      `Interest Rate: ${data.rate.toFixed(2)}%\n` +
      `Tenure: ${data.n} Months (${data.years} Years)\n` +
      `EMI: ${money(data.emi)}\n` +
      `Total Interest: ${money(data.it)}\n` +
      `Total Payment: ${money(data.total)}\n\n` +
      `Nilesh Kute\n` +
      `Home Loan Consultant\n` +
      `${settings.phone || "8356008675"}\n` +
      `www.loanwithnilesh.co.in`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Build table rows with yearly breakdowns
  const renderScheduleRows = () => {
    const elements = [];
    let py = 0;
    let iy = 0;

    data.rows.forEach((r, i) => {
      elements.push(
        <tr key={`m-${r.m}`}>
          <td>{r.m}</td>
          <td>{Math.round(r.pr).toLocaleString("en-IN")}</td>
          <td>{Math.round(r.it).toLocaleString("en-IN")}</td>
          <td>{Math.round(r.bal).toLocaleString("en-IN")}</td>
        </tr>
      );

      py += r.pr;
      iy += r.it;

      if ((i + 1) % 12 === 0) {
        const yrNum = (i + 1) / 12;
        elements.push(
          <tr key={`yr-${yrNum}`} className={styles.yearRow}>
            <td>Year {yrNum}</td>
            <td>{Math.round(py).toLocaleString("en-IN")}</td>
            <td>{Math.round(iy).toLocaleString("en-IN")}</td>
            <td>{Math.round(r.bal).toLocaleString("en-IN")}</td>
          </tr>
        );
        py = 0;
        iy = 0;
      }
    });

    return elements;
  };

  return (
    <section className={styles.calculatorSection}>
      <div className={styles.container}>
        {/* Card 1: Customer & Loan Details Inputs */}
        <div className={styles.card}>
          <div className={styles.title}>
            <span>Customer &amp; Loan Details</span>
          </div>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Customer Name</label>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Enter customer name"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Loan Amount (₹)</label>
              <input
                type="number"
                inputMode="decimal"
                className={styles.inputField}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Interest Rate (% p.a.)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                className={styles.inputField}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Period (Years)</label>
              <input
                type="number"
                inputMode="numeric"
                className={styles.inputField}
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Processing Fees (₹)</label>
              <input
                type="number"
                inputMode="decimal"
                className={styles.inputField}
                value={fees}
                onChange={(e) => setFees(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Date (DD/MM/YY)</label>
              <div className={styles.datebox}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="DD/MM/YY"
                  className={styles.inputField}
                  value={startDate}
                  onChange={handleDateInput}
                />
                <button
                  className={styles.calbtn}
                  type="button"
                  title="Select date"
                  onClick={openCalendar}
                >
                  📅
                </button>
              </div>
              <input
                ref={nativeDateRef}
                type="date"
                onChange={handleNativeDateChange}
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: "1px",
                  height: "1px",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              type="button"
              onClick={handleCalculate}
            >
              Calculate EMI
            </button>
            <button
              className={styles.btnReset}
              type="button"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className={styles.btnPDF}
              type="button"
              onClick={downloadPDF}
            >
              📄 Download Professional PDF
            </button>
            <button
              className={styles.btnWhatsApp}
              type="button"
              onClick={handleWhatsApp}
            >
              💬 WhatsApp
            </button>
          </div>
          {statusMsg && <div className={styles.status}>{statusMsg}</div>}
        </div>

        {/* Card 2: EMI Details */}
        <div className={styles.card}>
          <div className={styles.title}>
            <span>EMI Details &amp; Summary</span>
            <span className={styles.liveBadge}>● LIVE CALCULATION</span>
          </div>
          <div className={styles.detailsGrid}>
            <div>
              <div className={styles.kvGrid}>
                <div className={styles.item}>
                  <span>Customer Name</span>
                  <b>{customer.trim() || "Customer"}</b>
                </div>
                <div className={styles.item}>
                  <span>Loan Amount</span>
                  <b>{money(data.P)}</b>
                </div>
                <div className={styles.item}>
                  <span>Interest Rate</span>
                  <b>{data.rate.toFixed(2)}% p.a.</b>
                </div>
                <div className={styles.item}>
                  <span>Tenure</span>
                  <b>
                    {data.n} Months ({data.years} yrs)
                  </b>
                </div>
                <div className={styles.item}>
                  <span>Processing Fees</span>
                  <b>{money(data.fees)}</b>
                </div>
                <div className={styles.item}>
                  <span>Prepared By</span>
                  <b>Nilesh Kute</b>
                </div>
              </div>
              <div className={styles.emiBanner}>
                <span>Monthly EMI</span>
                <b>{money(data.emi)}</b>
              </div>
            </div>

            <div className={styles.summaryCards}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardLabel}>
                  <span className={`${styles.dot} ${styles.dotPrincipal}`}></span>
                  <span>Principal Loan Amount</span>
                </div>
                <div className={styles.summaryCardValue}>{money(data.P)}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardLabel}>
                  <span className={`${styles.dot} ${styles.dotInterest}`}></span>
                  <span>Total Interest Payable</span>
                </div>
                <div className={styles.summaryCardValue}>{money(data.it)}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardLabel}>
                  <span className={`${styles.dot} ${styles.dotTotal}`}></span>
                  <span>Total Amount (Principal + Interest)</span>
                </div>
                <div className={styles.summaryCardValue}>{money(data.total)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Monthly Repayment Schedule */}
        <div className={styles.card}>
          <div className={styles.title}>
            <span>✦ Monthly Repayment Schedule</span>
          </div>
          <div className={styles.tablewrap}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Principal (₹)</th>
                  <th>Interest (₹)</th>
                  <th>Balance (₹)</th>
                </tr>
              </thead>
              <tbody>{renderScheduleRows()}</tbody>
            </table>
          </div>
          <div className={styles.note}>
            <b>Nilesh Kute</b> | Home Loan Consultant |{" "}
            {settings.phone || "8356008675"} &bull; www.loanwithnilesh.co.in
            <br />
            Indicative calculation only. Actual EMI, interest, fees, and schedule
            may vary based on lender policies and credit approval.
          </div>
        </div>
      </div>
    </section>
  );
}
