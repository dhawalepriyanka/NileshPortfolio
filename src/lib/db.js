const Database = require("better-sqlite3");
import path from "path";
import fs from "fs";

let db;

function getDb() {
  if (!db) {
    try {
      let dbPath;
      const isVercel = process.env.VERCEL || process.env.NODE_ENV === "production";
      
      if (isVercel) {
        dbPath = "/tmp/dev.db";
        const origDbPath = path.join(process.cwd(), "prisma", "dev.db");
        if (!fs.existsSync(/*turbopackIgnore: true*/ dbPath) && fs.existsSync(/*turbopackIgnore: true*/ origDbPath)) {
          try {
            fs.copyFileSync(origDbPath, dbPath);
          } catch (err) {
            console.warn("Could not copy dev.db to /tmp:", err.message);
          }
        }
      } else {
        const dbDir = path.join(process.cwd(), "prisma");
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        dbPath = path.join(dbDir, "dev.db");
      }

      db = new Database(dbPath);
    } catch (e) {
      console.warn("Falling back to /tmp or in-memory database for Vercel deployment:", e.message);
      try {
        db = new Database("/tmp/dev.db");
      } catch (err) {
        console.warn("Falling back to in-memory database:", err.message);
        db = new Database(":memory:");
      }
    }

    db.exec(`
      CREATE TABLE IF NOT EXISTS Lead (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        loanType TEXT NOT NULL,
        employmentType TEXT,
        loanAmount TEXT,
        city TEXT,
        source TEXT DEFAULT 'Website',
        status TEXT DEFAULT 'New',
        notes TEXT,
        followUpDate TEXT,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS Blog (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        imageUrl TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS Setting (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updatedAt TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS Testimonial (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        testimonial TEXT NOT NULL,
        loanType TEXT,
        location TEXT,
        date TEXT NOT NULL,
        createdAt TEXT DEFAULT (datetime('now'))
      );
    `);

    try {
      db.exec("ALTER TABLE Blog ADD COLUMN imageUrl TEXT");
    } catch (e) {
      // Column already exists
    }

    const defaultArticles = [
      {
        id: "art-1",
        slug: "improve-cibil-score",
        title: "How to Improve Your CIBIL Score Before Applying for a Home Loan",
        category: "CIBIL Score",
        excerpt: "Your CIBIL score plays a critical role in home loan approval. Learn actionable tips to boost your credit score before you apply.",
        date: "2026-08-01",
        content: `Your CIBIL score (credit score) is one of the most important metrics that banks and financial institutions evaluate when considering your home loan application. A high credit score (typically 750 or above) not only increases your approval chances but also helps you secure lower interest rates and better loan terms.

### Key Steps to Boost Your Credit Score:
1. **Pay All Dues on Time**: Timely repayment of credit card bills and existing EMIs accounts for a major portion of your credit score. Never miss or delay a payment.
2. **Keep Credit Utilization Low**: Try to keep your credit card utilization ratio below 30% of your total limit. High utilization indicates credit dependence.
3. **Avoid Too Many Loan Applications**: Multiple hard inquiries in a short timeframe make you appear credit-hungry, which can temporarily reduce your score.
4. **Check Your Report for Errors**: Regularly pull your CIBIL report and dispute any errors or incorrect delinquency reporting.
5. **Maintain a Mix of Credit**: A healthy balance of secured (e.g., car loan, home loan) and unsecured credit (e.g., credit card) demonstrates responsible credit management.`
      },
      {
        id: "art-2",
        slug: "home-loan-balance-transfer-guide",
        title: "Home Loan Balance Transfer: When Does It Make Sense?",
        category: "Balance Transfer",
        excerpt: "Thinking of transferring your home loan to another lender? Here is everything you need to know about balance transfers.",
        date: "2026-07-25",
        content: `A Home Loan Balance Transfer allows you to move your outstanding home loan from your current bank to a new lender offering a lower interest rate or better terms.

### When Should You Consider a Balance Transfer?
- **Significant Interest Rate Difference**: If another lender offers a rate that is at least 0.50% to 1.00% lower than your current rate.
- **Early Stage of Loan Tenure**: Balance transfers yield maximum savings during the first 5 to 10 years of a long-term loan when interest component is highest.
- **Better Customer Service / Top-Up Facility**: When you need an additional top-up loan at home loan interest rates or desire better digital service.`
      },
      {
        id: "art-3",
        slug: "home-loan-rejection-reasons",
        title: "Top 5 Reasons Home Loan Applications Get Rejected",
        category: "Home Loan",
        excerpt: "Understanding why loan applications fail can help you prepare better. Here are the most common reasons for rejection.",
        date: "2026-07-18",
        content: `Home loan rejections can be frustrating, but understanding the root causes allows you to fix deficiencies before re-applying.

### 5 Common Reasons:
1. **Low CIBIL Score or Delinquent History**: Scores below 650 or past defaults flag high risk.
2. **High Existing Debt Obligations**: If your total monthly EMIs exceed 50% of your net monthly income (FOIR), lenders may hesitate to extend further credit.
3. **Property Legal or Valuation Issues**: Title disputes, unapproved building plans, or valuation shortfalls by bank panel valuers.
4. **Unstable Employment / Income Proof**: Frequent job switches or insufficient ITR documentation for self-employed individuals.
5. **Incomplete or Inconsistent Paperwork**: Mismatches between application details and submitted documents.`
      },
      {
        id: "art-4",
        slug: "how-emi-calculated",
        title: "Understanding EMI: How Is Your Home Loan EMI Calculated?",
        category: "EMI Tips",
        excerpt: "Learn the formula behind EMI calculation and how factors like loan amount, tenure, and interest rate affect your monthly payment.",
        date: "2026-07-10",
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
        id: "art-5",
        slug: "documents-required-home-loan",
        title: "Documents Required for Home Loan: A Complete Checklist",
        category: "Loan Documents",
        excerpt: "A comprehensive guide to all the documents you will need when applying for a home loan as a salaried or self-employed applicant.",
        date: "2026-07-01",
        content: `Having your documents organized speeds up the loan sanction and disbursement process significantly.

### Mandatory Documents Checklist:
- **KYC Documents**: PAN Card, Aadhaar Card, Passport/Voter ID.
- **Salaried Applicants**: 3 months salary slips, 6 months bank statement, Form 16 / ITR for 2 years, Offer letter.
- **Self-Employed Applicants**: 3 years ITR with computation, audited Balance Sheet & P&L, 12 months bank statement, Business Registration / GST certificate.
- **Property Documents**: Sales agreement, Allotment letter, Chain of title deeds, Approved building plan.`
      },
      {
        id: "art-6",
        slug: "pmay-explained",
        title: "What Is PMAY? Pradhan Mantri Awas Yojana Explained",
        category: "Government Schemes",
        excerpt: "Learn about the government housing scheme PMAY, who is eligible, and how much subsidy you can get on your home loan.",
        date: "2026-06-20",
        content: `Pradhan Mantri Awas Yojana (PMAY) is a flagship initiative by the Government of India aiming to provide affordable housing to urban and rural poor, economically weaker sections (EWS), low income groups (LIG), and middle income groups (MIG).

### Key Highlights:
- **Credit Linked Subsidy Scheme (CLSS)**: Interest subsidy on home loans for eligible first-time homebuyers.
- **Eligibility**: The applicant or family members must not own a pucca house anywhere in India.
- **Beneficiary Categories**: EWS, LIG, MIG-I, and MIG-II based on annual household income.`
      }
    ];

    const insert = db.prepare(`
      INSERT OR IGNORE INTO Blog (id, slug, title, category, excerpt, content, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const a of defaultArticles) {
      insert.run(a.id, a.slug, a.title, a.category, a.excerpt, a.content, a.date);
    }

    const defaultReviews = [
      {
        id: "rev-1",
        name: "Rahul Sharma",
        rating: 5,
        testimonial: "Nilesh Kute made our home loan process completely stress-free! As an IT professional with multiple variable income components, banks were making calculations complicated. Nilesh sir compared PSU and private banks, got us 8.40% ROI, and managed the entire paperwork at our doorstep in Kharghar. Highly recommended!",
        loanType: "Home Loan (₹65 Lakhs)",
        location: "Kharghar, Navi Mumbai",
        date: "2026-08-14"
      },
      {
        id: "rev-2",
        name: "Priya & Sandeep Patil",
        rating: 5,
        testimonial: "We were paying 9.65% interest on our existing home loan. Nilesh helped us do a Balance Transfer to another bank at 8.35% with an additional ₹15 Lakhs top-up loan for home renovation. Our monthly EMI dropped significantly, saving us lakhs in long-term interest.",
        loanType: "Balance Transfer + Top-Up",
        location: "CBD Belapur",
        date: "2026-07-28"
      },
      {
        id: "rev-3",
        name: "Dr. Amit Deshmukh",
        rating: 5,
        testimonial: "As a practicing doctor, I needed a Loan Against Property (LAP) for setting up diagnostic equipment at my clinic. Nilesh's deep banking connections and transparent guidance helped get the loan sanctioned within just 7 working days with zero hidden charges.",
        loanType: "Loan Against Property (LAP)",
        location: "Vashi, Navi Mumbai",
        date: "2026-07-15"
      },
      {
        id: "rev-4",
        name: "Sneha Verma (NRI)",
        rating: 5,
        testimonial: "Being an NRI living in Dubai, coordinating property papers in Mumbai seemed daunting. Nilesh coordinated power of attorney requirements, builder legal verification, and bank disbursement seamlessly without me having to travel to India multiple times. Truly 5-star service!",
        loanType: "NRI Home Loan",
        location: "Seawoods, Navi Mumbai",
        date: "2026-06-30"
      },
      {
        id: "rev-5",
        name: "Rajesh Gupta",
        rating: 5,
        testimonial: "Got quick business loan funding for expanding my retail store inventory before festival season. Transparent terms, minimal paperwork, and quick turnaround. Nilesh is genuine and always puts the client's financial interest first.",
        loanType: "Business Loan",
        location: "Panvel",
        date: "2026-06-12"
      },
      {
        id: "rev-6",
        name: "Vikram & Neha Nair",
        rating: 5,
        testimonial: "We bought our first 2BHK flat in Ulwe and had no prior experience with bank loans or PMAY subsidy rules. Nilesh guided us through each step from CIBIL check to final disbursement. His 11+ years of experience really shows in his professionalism!",
        loanType: "First-Time Home Buyer Loan",
        location: "Ulwe, Navi Mumbai",
        date: "2026-05-22"
      }
    ];

    const insertReview = db.prepare(`
      INSERT OR IGNORE INTO Testimonial (id, name, rating, testimonial, loanType, location, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of defaultReviews) {
      insertReview.run(r.id, r.name, r.rating, r.testimonial, r.loanType, r.location, r.date);
    }
  }
  return db;
}

// --- LEADS ---
export function createLead(data) {
  let database = getDb();
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);

  const insertAction = (targetDb) => {
    const stmt = targetDb.prepare(`
      INSERT INTO Lead (id, name, phone, email, loanType, employmentType, loanAmount, city, source, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.name,
      data.phone,
      data.email ?? null,
      data.loanType,
      data.employmentType ?? null,
      data.loanAmount ?? null,
      data.city ?? null,
      data.source ?? "Website",
      data.notes ?? null
    );
  };

  try {
    insertAction(database);
  } catch (err) {
    console.warn("Retrying createLead on writable /tmp database:", err.message);
    try {
      db = new Database("/tmp/dev.db");
      db.exec(`
        CREATE TABLE IF NOT EXISTS Lead (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          loanType TEXT NOT NULL,
          employmentType TEXT,
          loanAmount TEXT,
          city TEXT,
          source TEXT DEFAULT 'Website',
          status TEXT DEFAULT 'New',
          notes TEXT,
          followUpDate TEXT,
          createdAt TEXT DEFAULT (datetime('now')),
          updatedAt TEXT DEFAULT (datetime('now'))
        );
      `);
      insertAction(db);
    } catch (fallbackErr) {
      console.error("Critical createLead fallback error:", fallbackErr.message);
    }
  }
  return { id };
}

export function getAllLeads() {
  const db = getDb();
  return db.prepare("SELECT * FROM Lead ORDER BY createdAt DESC").all();
}

export function updateLead(id, status, notes) {
  const db = getDb();
  db.prepare("UPDATE Lead SET status = ?, notes = ?, updatedAt = datetime('now') WHERE id = ?").run(status, notes, id);
}

export function deleteLead(id) {
  const db = getDb();
  db.prepare("DELETE FROM Lead WHERE id = ?").run(id);
}

export function getLeadStats() {
  const db = getDb();
  const total = db.prepare("SELECT COUNT(*) as count FROM Lead").get().count;
  const newLeads = db.prepare("SELECT COUNT(*) as count FROM Lead WHERE status = 'New'").get().count;
  return { total, newLeads };
}

// --- BLOGS ---
export function getAllBlogs() {
  const db = getDb();
  return db.prepare("SELECT * FROM Blog ORDER BY createdAt DESC").all();
}

export function getBlogBySlug(slug) {
  const db = getDb();
  return db.prepare("SELECT * FROM Blog WHERE slug = ?").get(slug);
}

export function createBlog(data) {
  const db = getDb();
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const stmt = db.prepare(`
    INSERT INTO Blog (id, slug, title, category, excerpt, content, date, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, slug, data.title, data.category, data.excerpt, data.content, data.date || new Date().toISOString().split("T")[0], data.imageUrl || null);
  return { id, slug };
}

export function updateBlog(id, data) {
  const db = getDb();
  const slug = (data.slug && data.slug.trim() !== "")
    ? data.slug
    : data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    db.prepare(`
      UPDATE Blog SET title = ?, category = ?, excerpt = ?, content = ?, slug = ?, imageUrl = ? WHERE id = ?
    `).run(data.title, data.category, data.excerpt, data.content, slug, data.imageUrl || null, id);
  } catch (err) {
    if (err.message && err.message.includes("no such column")) {
      try {
        db.exec("ALTER TABLE Blog ADD COLUMN imageUrl TEXT");
        db.prepare(`
          UPDATE Blog SET title = ?, category = ?, excerpt = ?, content = ?, slug = ?, imageUrl = ? WHERE id = ?
        `).run(data.title, data.category, data.excerpt, data.content, slug, data.imageUrl || null, id);
      } catch (retryErr) {
        console.error("Failed to update blog:", retryErr);
        throw retryErr;
      }
    } else {
      throw err;
    }
  }
}

export function deleteBlog(id) {
  const db = getDb();
  db.prepare("DELETE FROM Blog WHERE id = ?").run(id);
}

// --- TESTIMONIALS / CUSTOMER REVIEWS ---
export function getAllTestimonials() {
  const db = getDb();
  return db.prepare("SELECT * FROM Testimonial ORDER BY date DESC, createdAt DESC").all();
}

export function createTestimonial(data) {
  const db = getDb();
  const id = "rev-" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  const stmt = db.prepare(`
    INSERT INTO Testimonial (id, name, rating, testimonial, loanType, location, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    data.name,
    Number(data.rating) || 5,
    data.testimonial,
    data.loanType || "Home Loan",
    data.location || "Navi Mumbai",
    data.date || new Date().toISOString().split("T")[0]
  );
  return { id };
}

export function deleteTestimonial(id) {
  const db = getDb();
  db.prepare("DELETE FROM Testimonial WHERE id = ?").run(id);
}

// --- SETTINGS & SEO ---
export function getSetting(key, defaultValue = "") {
  const db = getDb();
  const row = db.prepare("SELECT value FROM Setting WHERE key = ?").get(key);
  return row ? row.value : defaultValue;
}

export function setSetting(key, value) {
  const db = getDb();
  db.prepare(`
    INSERT INTO Setting (key, value, updatedAt) VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = datetime('now')
  `).run(key, typeof value === "object" ? JSON.stringify(value) : String(value));
}

export function getAllSettings() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM Setting").all();
  const result = {
    siteTitle: "Nilesh Kute - Home Loan Consultant",
    phone: "8356008675",
    whatsapp: "918356008675",
    email: "nileshkute43@gmail.com",
    address: "Belapur, Navi Mumbai",
    heroHeadline: "Your Home Loan, Guided by an Expert.",
    aboutHeading: "Experienced Home Loan Consultant You Can Trust",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com/@nileshkute",
    metaHomeTitle: "Nilesh Kute | Expert Home Loan Consultant in Belapur",
    metaHomeDesc: "Get personalized guidance for Home Loans, Balance Transfer, Top-Up Loans, and more with Nilesh Kute.",
    metaHomeKeywords: "Home loan consultant Belapur, Home loan expert, Balance transfer, LAP",
    metaServicesTitle: "Loan Services | Nilesh Kute",
    metaServicesDesc: "Explore our range of loan services including Home Loans, Balance Transfers, Top-Up Loans, LAP, Personal Loans, and Business Loans.",
    metaContactTitle: "Contact Nilesh Kute | Home Loan Consultant",
    metaContactDesc: "Get in touch with Nilesh Kute for expert home loan guidance. Call, WhatsApp, or email for a free consultation."
  };
  rows.forEach(r => {
    try {
      result[r.key] = JSON.parse(r.value);
    } catch {
      result[r.key] = r.value;
    }
  });
  return result;
}

// --- BACKUP & RESTORE ---
export function getDatabaseExport() {
  const db = getDb();
  return {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    leads: db.prepare("SELECT * FROM Lead").all(),
    blogs: db.prepare("SELECT * FROM Blog").all(),
    settings: db.prepare("SELECT * FROM Setting").all(),
  };
}

export function restoreDatabaseImport(data) {
  const db = getDb();
  db.transaction(() => {
    if (data.leads && Array.isArray(data.leads)) {
      db.prepare("DELETE FROM Lead").run();
      const insertLead = db.prepare(`
        INSERT INTO Lead (id, name, phone, email, loanType, employmentType, loanAmount, city, source, status, notes, followUpDate, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const l of data.leads) {
        insertLead.run(l.id, l.name, l.phone, l.email, l.loanType, l.employmentType, l.loanAmount, l.city, l.source, l.status, l.notes, l.followUpDate, l.createdAt, l.updatedAt);
      }
    }
    if (data.blogs && Array.isArray(data.blogs)) {
      db.prepare("DELETE FROM Blog").run();
      const insertBlog = db.prepare(`
        INSERT INTO Blog (id, slug, title, category, excerpt, content, date, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const b of data.blogs) {
        insertBlog.run(b.id, b.slug, b.title, b.category, b.excerpt, b.content, b.date, b.createdAt);
      }
    }
    if (data.settings && Array.isArray(data.settings)) {
      db.prepare("DELETE FROM Setting").run();
      const insertSetting = db.prepare("INSERT INTO Setting (key, value, updatedAt) VALUES (?, ?, ?)");
      for (const s of data.settings) {
        insertSetting.run(s.key, typeof s.value === 'object' ? JSON.stringify(s.value) : s.value, s.updatedAt);
      }
    }
  })();
}
