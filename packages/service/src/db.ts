import { SQL } from 'bun';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = new SQL(DATABASE_URL);

// Ensure the table exists on startup
await sql`
  CREATE TABLE IF NOT EXISTS urls (
    id         SERIAL PRIMARY KEY,
    code       TEXT UNIQUE NOT NULL,
    url        TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

export async function insertUrl(code: string, url: string): Promise<void> {
  await sql`INSERT INTO urls (code, url) VALUES (${code}, ${url})`;
}

export async function getUrlByCode(code: string): Promise<{
  id: number;
  code: string;
  url: string;
  created_at: string;
} | null> {
  const rows = await sql`SELECT * FROM urls WHERE code = ${code} LIMIT 1`;
  return (rows[0] as { id: number; code: string; url: string; created_at: string }) ?? null;
}
