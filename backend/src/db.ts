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

export default db;
