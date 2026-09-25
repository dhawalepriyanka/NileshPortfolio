import path from "path";
import fs from "fs";
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@libsql/client";

// --- TURSO CLOUD CONFIGURATION ---
let tursoClient = null;
let tursoInitPromise = null;

function getTursoConfig() {
  const url =
    process.env.TURSO_DATABASE_URL ||
    process.env.TURSO_URL ||
    (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("libsql:")
      ? process.env.DATABASE_URL
      : null);
  const authToken =
    process.env.TURSO_AUTH_TOKEN ||
    process.env.TURSO_TOKEN ||
    process.env.TURSO_AUTH;

  return { url, authToken };
}

export function isTursoEnabled() {
  const { url } = getTursoConfig();
  return Boolean(url);
}

function getTursoClient() {
  const { url, authToken } = getTursoConfig();
  if (!url) return null;

  if (!tursoClient) {
    try {
      tursoClient = createClient({
        url,
        authToken: authToken || undefined,
      });
    } catch (err) {
      console.error("Failed to initialize Turso client:", err);
      return null;
    }
  }
  return tursoClient;
}

function cleanArgs(args) {
  return args.map((arg) => (arg === undefined ? null : arg));
}

// --- DEFAULT DATA SEEDS ---
const defaultArticles = [
  {
    id: "art-1",
    slug: "improve-cibil-score",
    title: "How to Improve Your CIBIL Score Before Applying for a Home Loan",
    category: "CIBIL Score",
    excerpt: "Your CIBIL score plays a critical role in home loan approval. Learn actionable tips to boost your credit score before you apply.",
    date: "2026-08-01",
    imageUrl: null,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
    imageUrl: null,
    youtubeUrl: null,
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
    imageUrl: null,
    youtubeUrl: null,
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
    imageUrl: null,
    youtubeUrl: null,
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
    imageUrl: null,
    youtubeUrl: null,
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
    imageUrl: null,
    youtubeUrl: null,
    content: `Pradhan Mantri Awas Yojana (PMAY) is a flagship initiative by the Government of India aiming to provide affordable housing to urban and rural poor, economically weaker sections (EWS), low income groups (LIG), and middle income groups (MIG).

### Key Highlights:
- **Credit Linked Subsidy Scheme (CLSS)**: Interest subsidy on home loans for eligible first-time homebuyers.
- **Eligibility**: The applicant or family members must not own a pucca house anywhere in India.
- **Beneficiary Categories**: EWS, LIG, MIG-I, and MIG-II based on annual household income.`
  }
];

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

let cachedSettings = {
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

// --- INITIALIZE TURSO TABLES & SEEDS ---
async function ensureTursoInit(client) {
  if (tursoInitPromise) return tursoInitPromise;

  tursoInitPromise = (async () => {
    try {
      await client.batch([
        `CREATE TABLE IF NOT EXISTS Lead (
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
        );`,
        `CREATE TABLE IF NOT EXISTS Blog (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          date TEXT NOT NULL,
          imageUrl TEXT,
          youtubeUrl TEXT,
          createdAt TEXT DEFAULT (datetime('now'))
        );`,
        `CREATE TABLE IF NOT EXISTS Setting (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updatedAt TEXT DEFAULT (datetime('now'))
        );`,
        `CREATE TABLE IF NOT EXISTS Testimonial (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          rating INTEGER DEFAULT 5,
          testimonial TEXT NOT NULL,
          loanType TEXT,
          location TEXT,
          date TEXT NOT NULL,
          createdAt TEXT DEFAULT (datetime('now'))
        );`
      ]);

      // Seed default blogs if table is empty
      const blogCountRes = await client.execute("SELECT count(*) as count FROM Blog");
      const blogCount = Number(blogCountRes.rows[0]?.count || 0);
      if (blogCount === 0) {
        for (const a of defaultArticles) {
          await client.execute({
            sql: `INSERT OR IGNORE INTO Blog (id, slug, title, category, excerpt, content, date, imageUrl, youtubeUrl, createdAt)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
            args: cleanArgs([a.id, a.slug, a.title, a.category, a.excerpt, a.content, a.date, a.imageUrl || null, a.youtubeUrl || null])
          });
        }
      }

      // Seed default reviews if table is empty
      const revCountRes = await client.execute("SELECT count(*) as count FROM Testimonial");
      const revCount = Number(revCountRes.rows[0]?.count || 0);
      if (revCount === 0) {
        for (const r of defaultReviews) {
          await client.execute({
            sql: `INSERT OR IGNORE INTO Testimonial (id, name, rating, testimonial, loanType, location, date, createdAt)
                  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
            args: cleanArgs([r.id, r.name, r.rating, r.testimonial, r.loanType, r.location, r.date])
          });
        }
      }

      // Load remote settings into cachedSettings
      const settingsRes = await client.execute("SELECT * FROM Setting");
      settingsRes.rows.forEach(r => {
        try {
          cachedSettings[r.key] = JSON.parse(r.value);
        } catch {
          cachedSettings[r.key] = r.value;
        }
      });
    } catch (err) {
      console.error("Error initializing Turso cloud tables:", err.message);
      tursoInitPromise = null;
    }
  })();

  return tursoInitPromise;
}

// --- LOCAL SQLITE FALLBACK ---
const Database = function (dbPath) {
  const instance = new DatabaseSync(dbPath);
  if (!instance.transaction) {
    instance.transaction = function (fn) {
      return function (...args) {
        instance.exec("BEGIN");
        try {
          const res = fn(...args);
          instance.exec("COMMIT");
          return res;
        } catch (err) {
          instance.exec("ROLLBACK");
          throw err;
        }
      };
    };
  }
  return instance;
};

let db;

function getDb() {
  if (!db) {
    try {
      let dbPath;
      const isVercel = Boolean(process.env.VERCEL);

      if (isVercel) {
        dbPath = "/tmp/dev.db";
        const origDbPath = path.join(process.cwd(), "prisma", "dev.db");
        if (!fs.existsSync(/*turbopackIgnore: true*/ dbPath) && fs.existsSync(/*turbopackIgnore: true*/ origDbPath)) {
          try {
            const dir = path.dirname(dbPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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
      console.warn("Falling back to /tmp or in-memory database for local SQLite:", e.message);
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
        youtubeUrl TEXT,
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

    try { db.exec("ALTER TABLE Blog ADD COLUMN imageUrl TEXT"); } catch (e) {}
    try { db.exec("ALTER TABLE Blog ADD COLUMN youtubeUrl TEXT"); } catch (e) {}

    const insert = db.prepare(`
      INSERT OR IGNORE INTO Blog (id, slug, title, category, excerpt, content, date, imageUrl, youtubeUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const a of defaultArticles) {
      insert.run(a.id, a.slug, a.title, a.category, a.excerpt, a.content, a.date, a.imageUrl || null, a.youtubeUrl || null);
    }

    const insertReview = db.prepare(`
      INSERT OR IGNORE INTO Testimonial (id, name, rating, testimonial, loanType, location, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of defaultReviews) {
      insertReview.run(r.id, r.name, r.rating, r.testimonial, r.loanType, r.location, r.date);
    }

    // Populate cachedSettings from local db
    try {
      const rows = db.prepare("SELECT * FROM Setting").all();
      rows.forEach(r => {
        try {
          cachedSettings[r.key] = JSON.parse(r.value);
        } catch {
          cachedSettings[r.key] = r.value;
        }
      });
    } catch (e) {}
  }
  return db;
}

// Ensure local db or cache is initialized synchronously on startup
try {
  getDb();
} catch (e) {
  console.warn("Initial getDb() load notice:", e.message);
}

// --- SLUG GENERATOR ---
async function generateUniqueSlug(text, currentId = null) {
  let base = (text || "article")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!base) base = "article-" + Date.now().toString(36);

  let slug = base;
  let counter = 1;
  const turso = getTursoClient();

  while (true) {
    let row = null;
    if (turso) {
      try {
        await ensureTursoInit(turso);
        const res = currentId
          ? await turso.execute({
              sql: "SELECT id FROM Blog WHERE slug = ? AND id != ?",
              args: cleanArgs([slug, currentId]),
            })
          : await turso.execute({
              sql: "SELECT id FROM Blog WHERE slug = ?",
              args: cleanArgs([slug]),
            });
        row = res.rows[0];
      } catch (err) {
        console.warn("Turso slug check error:", err.message);
      }
    }
    if (!turso || !row) {
      try {
        const localDb = getDb();
        if (currentId) {
          row = localDb.prepare("SELECT id FROM Blog WHERE slug = ? AND id != ?").get(slug, currentId);
        } else {
          row = localDb.prepare("SELECT id FROM Blog WHERE slug = ?").get(slug);
        }
      } catch (e) {}
    }
    if (!row) break;
    slug = `${base}-${counter++}`;
  }
  return slug;
}

// --- LEADS ---
export async function createLead(data) {
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const turso = getTursoClient();

  if (turso) {
    try {
      await ensureTursoInit(turso);
      await turso.execute({
        sql: `INSERT INTO Lead (id, name, phone, email, loanType, employmentType, loanAmount, city, source, status, notes, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        args: cleanArgs([
          id,
          data.name,
          data.phone,
          data.email ?? null,
          data.loanType,
          data.employmentType ?? null,
          data.loanAmount ?? null,
          data.city ?? null,
          data.source ?? "Website",
          data.status ?? "New",
          data.notes ?? null,
        ]),
      });
      return { id };
    } catch (err) {
      console.warn("Turso createLead failed, attempting local fallback:", err.message);
    }
  }

  // Fallback to local SQLite
  try {
    const database = getDb();
    const stmt = database.prepare(`
      INSERT INTO Lead (id, name, phone, email, loanType, employmentType, loanAmount, city, source, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      data.status ?? "New",
      data.notes ?? null
    );
  } catch (err) {
    console.error("Local createLead error:", err.message);
  }

  return { id };
}

export async function getAllLeads() {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      const res = await turso.execute("SELECT * FROM Lead ORDER BY createdAt DESC");
      return res.rows;
    } catch (err) {
      console.warn("Turso getAllLeads error, falling back to local SQLite:", err.message);
    }
  }
  const database = getDb();
  return database.prepare("SELECT * FROM Lead ORDER BY createdAt DESC").all();
}

export async function updateLead(id, dataOrStatus, maybeNotes) {
  let name, phone, loanType, loanAmount, city, source, status, notes;

  if (typeof dataOrStatus === "object" && dataOrStatus !== null) {
    status = dataOrStatus.status || "New";
    notes = dataOrStatus.notes !== undefined ? dataOrStatus.notes : (dataOrStatus.message ?? null);
    name = dataOrStatus.name;
    phone = dataOrStatus.phone || dataOrStatus.mobile;
    loanType = dataOrStatus.loanType;
    loanAmount = dataOrStatus.loanAmount;
    city = dataOrStatus.city;
    source = dataOrStatus.source;
  } else {
    status = dataOrStatus;
    notes = maybeNotes;
  }

  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      if (name || phone || loanType) {
        await turso.execute({
          sql: `UPDATE Lead SET 
                  name = COALESCE(?, name),
                  phone = COALESCE(?, phone),
                  loanType = COALESCE(?, loanType),
                  loanAmount = COALESCE(?, loanAmount),
                  city = COALESCE(?, city),
                  source = COALESCE(?, source),
                  status = COALESCE(?, status),
                  notes = ?,
                  updatedAt = datetime('now')
                WHERE id = ?`,
          args: cleanArgs([name || null, phone || null, loanType || null, loanAmount || null, city || null, source || null, status || null, notes !== undefined ? notes : null, id]),
        });
      } else {
        await turso.execute({
          sql: "UPDATE Lead SET status = ?, notes = ?, updatedAt = datetime('now') WHERE id = ?",
          args: cleanArgs([status, notes, id]),
        });
      }
    } catch (err) {
      console.warn("Turso updateLead error:", err.message);
    }
  }

  try {
    const database = getDb();
    if (name || phone || loanType) {
      database.prepare(`
        UPDATE Lead SET 
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          loanType = COALESCE(?, loanType),
          loanAmount = COALESCE(?, loanAmount),
          city = COALESCE(?, city),
          source = COALESCE(?, source),
          status = COALESCE(?, status),
          notes = ?,
          updatedAt = datetime('now')
        WHERE id = ?
      `).run(
        name || null,
        phone || null,
        loanType || null,
        loanAmount || null,
        city || null,
        source || null,
        status || null,
        notes !== undefined ? notes : null,
        id
      );
    } else {
      database.prepare("UPDATE Lead SET status = ?, notes = ?, updatedAt = datetime('now') WHERE id = ?").run(status, notes, id);
    }
  } catch (err) {
    // Expected on serverless cold write if using Turso
  }
}

export async function deleteLead(id) {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      await turso.execute({ sql: "DELETE FROM Lead WHERE id = ?", args: cleanArgs([id]) });
    } catch (err) {
      console.warn("Turso deleteLead error:", err.message);
    }
  }

  try {
    const database = getDb();
    database.prepare("DELETE FROM Lead WHERE id = ?").run(id);
  } catch (err) {}
}

export async function getLeadStats() {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      const totalRes = await turso.execute("SELECT COUNT(*) as count FROM Lead");
      const newRes = await turso.execute("SELECT COUNT(*) as count FROM Lead WHERE status = 'New'");
      return {
        total: Number(totalRes.rows[0]?.count || 0),
        newLeads: Number(newRes.rows[0]?.count || 0),
      };
    } catch (err) {
      console.warn("Turso getLeadStats error:", err.message);
    }
  }
  const database = getDb();
  const total = database.prepare("SELECT COUNT(*) as count FROM Lead").get().count;
  const newLeads = database.prepare("SELECT COUNT(*) as count FROM Lead WHERE status = 'New'").get().count;
  return { total, newLeads };
}

// --- BLOGS ---
export async function getAllBlogs() {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      const res = await turso.execute("SELECT * FROM Blog ORDER BY createdAt DESC, date DESC");
      return res.rows;
    } catch (err) {
      console.warn("Turso getAllBlogs error, falling back to local SQLite:", err.message);
    }
  }
  const database = getDb();
  return database.prepare("SELECT * FROM Blog ORDER BY createdAt DESC, date DESC").all();
}

export async function getBlogBySlug(slug) {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      const res = await turso.execute({
        sql: "SELECT * FROM Blog WHERE slug = ?",
        args: cleanArgs([slug]),
      });
      if (res.rows.length > 0) return res.rows[0];
    } catch (err) {
      console.warn("Turso getBlogBySlug error, falling back to local SQLite:", err.message);
    }
  }
  const database = getDb();
  return database.prepare("SELECT * FROM Blog WHERE slug = ?").get(slug) || null;
}

export async function createBlog(data) {
  const turso = getTursoClient();
  const id = data.id || ("blog-" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36));
  const slug = await generateUniqueSlug(data.slug || data.title);
  const date = data.date || new Date().toISOString().split("T")[0];
  const imageUrl = data.imageUrl || null;
  const youtubeUrl = data.youtubeUrl || null;

  if (turso) {
    try {
      await ensureTursoInit(turso);
      await turso.execute({
        sql: `INSERT INTO Blog (id, slug, title, category, excerpt, content, date, imageUrl, youtubeUrl, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        args: cleanArgs([id, slug, data.title, data.category, data.excerpt, data.content, date, imageUrl, youtubeUrl]),
      });
    } catch (err) {
      console.error("Turso createBlog error:", err.message);
      throw err;
    }
  }

  // Also sync locally if possible
  try {
    const database = getDb();
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO Blog (id, slug, title, category, excerpt, content, date, imageUrl, youtubeUrl, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(id, slug, data.title, data.category, data.excerpt, data.content, date, imageUrl, youtubeUrl);
  } catch (err) {
    // If local write fails on read-only serverless, Turso write already succeeded
  }

  return { id, slug, title: data.title, category: data.category, excerpt: data.excerpt, content: data.content, date, imageUrl, youtubeUrl };
}

export async function updateBlog(id, data) {
  const turso = getTursoClient();
  const slug = await generateUniqueSlug(data.slug || data.title, id);
  const imageUrl = data.imageUrl || null;
  const youtubeUrl = data.youtubeUrl || null;

  if (turso) {
    try {
      await ensureTursoInit(turso);
      await turso.execute({
        sql: `UPDATE Blog SET title = ?, category = ?, excerpt = ?, content = ?, slug = ?, imageUrl = ?, youtubeUrl = ? WHERE id = ?`,
        args: cleanArgs([data.title, data.category, data.excerpt, data.content, slug, imageUrl, youtubeUrl, id]),
      });
    } catch (err) {
      console.error("Turso updateBlog error:", err.message);
      throw err;
    }
  }

  try {
    const database = getDb();
    database.prepare(`
      UPDATE Blog SET title = ?, category = ?, excerpt = ?, content = ?, slug = ?, imageUrl = ?, youtubeUrl = ? WHERE id = ?
    `).run(data.title, data.category, data.excerpt, data.content, slug, imageUrl, youtubeUrl, id);
  } catch (err) {}

  return { id, slug, title: data.title, category: data.category, excerpt: data.excerpt, content: data.content, imageUrl, youtubeUrl };
}

export async function deleteBlog(id) {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      await turso.execute({ sql: "DELETE FROM Blog WHERE id = ?", args: cleanArgs([id]) });
    } catch (err) {
      console.error("Turso deleteBlog error:", err.message);
    }
  }

  try {
    const database = getDb();
    database.prepare("DELETE FROM Blog WHERE id = ?").run(id);
  } catch (err) {}
}

// --- TESTIMONIALS / CUSTOMER REVIEWS ---
export async function getAllTestimonials() {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      const res = await turso.execute("SELECT * FROM Testimonial ORDER BY date DESC, createdAt DESC");
      return res.rows;
    } catch (err) {
      console.warn("Turso getAllTestimonials error:", err.message);
    }
  }
  const database = getDb();
  return database.prepare("SELECT * FROM Testimonial ORDER BY date DESC, createdAt DESC").all();
}

export async function createTestimonial(data) {
  const id = "rev-" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  const rating = Number(data.rating) || 5;
  const loanType = data.loanType || "Home Loan";
  const location = data.location || "Navi Mumbai";
  const date = data.date || new Date().toISOString().split("T")[0];

  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      await turso.execute({
        sql: `INSERT INTO Testimonial (id, name, rating, testimonial, loanType, location, date, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        args: cleanArgs([id, data.name, rating, data.testimonial, loanType, location, date]),
      });
      return { id };
    } catch (err) {
      console.warn("Turso createTestimonial error:", err.message);
    }
  }

  try {
    const database = getDb();
    const stmt = database.prepare(`
      INSERT INTO Testimonial (id, name, rating, testimonial, loanType, location, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.name, rating, data.testimonial, loanType, location, date);
  } catch (err) {}

  return { id };
}

export async function deleteTestimonial(id) {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      await turso.execute({ sql: "DELETE FROM Testimonial WHERE id = ?", args: cleanArgs([id]) });
    } catch (err) {
      console.warn("Turso deleteTestimonial error:", err.message);
    }
  }

  try {
    const database = getDb();
    database.prepare("DELETE FROM Testimonial WHERE id = ?").run(id);
  } catch (err) {}
}

// --- SETTINGS & SEO ---
export function getSetting(key, defaultValue = "") {
  return cachedSettings[key] !== undefined ? cachedSettings[key] : defaultValue;
}

export function getAllSettings() {
  return { ...cachedSettings };
}

export async function setSetting(key, value) {
  cachedSettings[key] = value;
  const strVal = typeof value === "object" ? JSON.stringify(value) : String(value);

  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      await turso.execute({
        sql: `INSERT INTO Setting (key, value, updatedAt) VALUES (?, ?, datetime('now'))
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = datetime('now')`,
        args: cleanArgs([key, strVal]),
      });
    } catch (err) {
      console.warn("Turso setSetting error:", err.message);
    }
  }

  try {
    const database = getDb();
    database.prepare(`
      INSERT INTO Setting (key, value, updatedAt) VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = datetime('now')
    `).run(key, strVal);
  } catch (err) {}
}

// --- BACKUP & RESTORE ---
export async function getDatabaseExport() {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      const [leads, blogs, settings, testimonials] = await Promise.all([
        turso.execute("SELECT * FROM Lead"),
        turso.execute("SELECT * FROM Blog"),
        turso.execute("SELECT * FROM Setting"),
        turso.execute("SELECT * FROM Testimonial"),
      ]);
      return {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        source: "Turso Cloud",
        leads: leads.rows,
        blogs: blogs.rows,
        settings: settings.rows,
        testimonials: testimonials.rows,
      };
    } catch (err) {
      console.warn("Turso export error, falling back to local:", err.message);
    }
  }

  const database = getDb();
  return {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    source: "Local SQLite",
    leads: database.prepare("SELECT * FROM Lead").all(),
    blogs: database.prepare("SELECT * FROM Blog").all(),
    settings: database.prepare("SELECT * FROM Setting").all(),
    testimonials: database.prepare("SELECT * FROM Testimonial").all(),
  };
}

export async function restoreDatabaseImport(data) {
  const turso = getTursoClient();
  if (turso) {
    try {
      await ensureTursoInit(turso);
      if (data.blogs && Array.isArray(data.blogs)) {
        await turso.execute("DELETE FROM Blog");
        for (const b of data.blogs) {
          await turso.execute({
            sql: `INSERT INTO Blog (id, slug, title, category, excerpt, content, date, createdAt, imageUrl, youtubeUrl)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: cleanArgs([b.id, b.slug, b.title, b.category, b.excerpt, b.content, b.date, b.createdAt || new Date().toISOString(), b.imageUrl || null, b.youtubeUrl || null]),
          });
        }
      }
      if (data.leads && Array.isArray(data.leads)) {
        await turso.execute("DELETE FROM Lead");
        for (const l of data.leads) {
          await turso.execute({
            sql: `INSERT INTO Lead (id, name, phone, email, loanType, employmentType, loanAmount, city, source, status, notes, followUpDate, createdAt, updatedAt)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: cleanArgs([l.id, l.name, l.phone, l.email, l.loanType, l.employmentType, l.loanAmount, l.city, l.source, l.status, l.notes, l.followUpDate, l.createdAt, l.updatedAt]),
          });
        }
      }
      if (data.settings && Array.isArray(data.settings)) {
        for (const s of data.settings) {
          const val = typeof s.value === "object" ? JSON.stringify(s.value) : s.value;
          await turso.execute({
            sql: `INSERT INTO Setting (key, value, updatedAt) VALUES (?, ?, ?)
                  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`,
            args: cleanArgs([s.key, val, s.updatedAt || new Date().toISOString()]),
          });
          try {
            cachedSettings[s.key] = JSON.parse(val);
          } catch {
            cachedSettings[s.key] = val;
          }
        }
      }
    } catch (err) {
      console.error("Turso restore error:", err.message);
    }
  }

  try {
    const database = getDb();
    database.transaction(() => {
      if (data.leads && Array.isArray(data.leads)) {
        database.prepare("DELETE FROM Lead").run();
        const insertLead = database.prepare(`
          INSERT INTO Lead (id, name, phone, email, loanType, employmentType, loanAmount, city, source, status, notes, followUpDate, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const l of data.leads) {
          insertLead.run(l.id, l.name, l.phone, l.email, l.loanType, l.employmentType, l.loanAmount, l.city, l.source, l.status, l.notes, l.followUpDate, l.createdAt, l.updatedAt);
        }
      }
      if (data.blogs && Array.isArray(data.blogs)) {
        database.prepare("DELETE FROM Blog").run();
        const insertBlog = database.prepare(`
          INSERT INTO Blog (id, slug, title, category, excerpt, content, date, createdAt, imageUrl, youtubeUrl)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const b of data.blogs) {
          insertBlog.run(b.id, b.slug, b.title, b.category, b.excerpt, b.content, b.date, b.createdAt || new Date().toISOString(), b.imageUrl || null, b.youtubeUrl || null);
        }
      }
      if (data.settings && Array.isArray(data.settings)) {
        database.prepare("DELETE FROM Setting").run();
        const insertSetting = database.prepare("INSERT INTO Setting (key, value, updatedAt) VALUES (?, ?, ?)");
        for (const s of data.settings) {
          insertSetting.run(s.key, typeof s.value === 'object' ? JSON.stringify(s.value) : s.value, s.updatedAt);
        }
      }
    })();
  } catch (err) {}
}
