/* Dual-mode DB adapter:
   - DATABASE_URL set  → Postgres (pg)
   - DATABASE_URL unset → SQLite (better-sqlite3)

   Same async API regardless: query, queryRow, queryAll, execute
   All model code uses Postgres $1 syntax; the SQLite backend converts it to ?.
*/

const usePg = !!process.env.DATABASE_URL;

function convertPlaceholders(sql) {
  return sql.replace(/\$(\d+)/g, () => '?');
}

if (usePg) {
  // ─── POSTGRES ───
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : undefined,
  });

  async function query(text, params = []) { return pool.query(text, params); }
  async function queryRow(text, params = []) {
    const res = await pool.query(text, params);
    return res.rows[0] || null;
  }
  async function queryAll(text, params = []) {
    const res = await pool.query(text, params);
    return res.rows;
  }
  async function execute(text, params = []) {
    return pool.query(text, params);
  }

  module.exports = { pool, query, queryRow, queryAll, execute, dialect: 'postgres' };

} else {
  // ─── SQLITE (local dev) ───
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');

  const dbPath = path.resolve(process.env.DB_PATH || './data/phantom.db');
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  async function query(text, params = []) {
    const stmt = db.prepare(convertPlaceholders(text));
    if (/^\s*(INSERT|UPDATE|DELETE|REPLACE|TRUNCATE)/i.test(text)) {
      const info = stmt.run(...params);
      return { rowCount: info.changes, rows: [] };
    }
    return { rows: stmt.all(...params), rowCount: 0 };
  }

  async function queryRow(text, params = []) {
    return db.prepare(convertPlaceholders(text)).get(...params) || null;
  }

  async function queryAll(text, params = []) {
    return db.prepare(convertPlaceholders(text)).all(...params);
  }

  async function execute(text, params = []) {
    const stmt = db.prepare(convertPlaceholders(text));
    const info = stmt.run(...params);
    return { rowCount: info.changes, rows: [] };
  }

  function rawExec(sql) { db.exec(sql); }

  module.exports = { pool: null, query, queryRow, queryAll, execute, rawExec, dialect: 'sqlite' };
}