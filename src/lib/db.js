const Database = require("better-sqlite3");
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");

let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath);
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
        createdAt TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS Setting (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updatedAt TEXT DEFAULT (datetime('now'))
      );
    `);
  }
  return db;
}

// --- LEADS ---
export function createLead(data) {
  const db = getDb();
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const stmt = db.prepare(`
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
    INSERT INTO Blog (id, slug, title, category, excerpt, content, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, slug, data.title, data.category, data.excerpt, data.content, data.date || new Date().toISOString().split("T")[0]);
  return { id, slug };
}

export function updateBlog(id, data) {
  const db = getDb();
  db.prepare(`
    UPDATE Blog SET title = ?, category = ?, excerpt = ?, content = ?, slug = ? WHERE id = ?
  `).run(data.title, data.category, data.excerpt, data.content, data.slug, id);
}

export function deleteBlog(id) {
  const db = getDb();
  db.prepare("DELETE FROM Blog WHERE id = ?").run(id);
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
  const result = {};
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
