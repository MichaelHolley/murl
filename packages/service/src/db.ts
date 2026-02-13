import { Database } from "bun:sqlite";

const DATABASE_PATH = process.env.DATABASE_PATH;

if (!DATABASE_PATH) {
  throw new Error("DATABASE_PATH environment variable is not set");
}

const db = new Database(DATABASE_PATH, { create: true });

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
  return query.get(code) as {
    id: number;
    code: string;
    url: string;
    created_at: string;
  } | null;
}

export default db;
