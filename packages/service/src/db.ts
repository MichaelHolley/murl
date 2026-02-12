import { Database } from "bun:sqlite";

const db = new Database("murl.sqlite", { create: true });

db.run(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export function insertUrl(code: string, url: string) {
  const query = db.prepare("INSERT INTO urls (code, url) VALUES (?, ?)");
  return query.run(code, url);
}

export function getUrlByCode(code: string) {
  const query = db.prepare("SELECT * FROM urls WHERE code = ?");
  return query.get(code) as { id: number; code: string; url: string; created_at: string } | null;
}

export default db;
