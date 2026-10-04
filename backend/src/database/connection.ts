import { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';
import * as fs from 'node:fs';

const DB_PATH = process.env.DB_PATH || path.resolve(process.cwd(), 'loan_engine.sqlite');

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    dbInstance = new DatabaseSync(DB_PATH);
    // Initialize schema if needed
    initializeDatabase(dbInstance);
  }
  return dbInstance;
}

function initializeDatabase(db: DatabaseSync): void {
  // Execute schema definitions
  db.exec(`
    CREATE TABLE IF NOT EXISTS loan_products (
      id TEXT PRIMARY KEY,
      product_name TEXT NOT NULL,
      lender_name TEXT NOT NULL,
      loan_type TEXT NOT NULL,
      description TEXT NOT NULL,
      min_age INTEGER NOT NULL DEFAULT 21,
      max_age INTEGER NOT NULL DEFAULT 60,
      min_monthly_income REAL NOT NULL DEFAULT 25000,
      min_credit_score INTEGER NOT NULL DEFAULT 650,
      max_dti REAL NOT NULL DEFAULT 50.0,
      min_loan_amount REAL NOT NULL DEFAULT 50000,
      max_loan_amount REAL NOT NULL DEFAULT 2500000,
      min_tenure_months INTEGER NOT NULL DEFAULT 12,
      max_tenure_months INTEGER NOT NULL DEFAULT 60,
      base_interest_rate REAL NOT NULL DEFAULT 12.5,
      min_interest_rate REAL NOT NULL DEFAULT 10.5,
      max_interest_rate REAL NOT NULL DEFAULT 18.0,
      processing_fee REAL NOT NULL DEFAULT 1.5,
      processing_fee_type TEXT NOT NULL DEFAULT 'percentage',
      allowed_employment_types TEXT NOT NULL,
      allowed_purposes TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS business_rules (
      id TEXT PRIMARY KEY,
      rule_name TEXT NOT NULL,
      rule_category TEXT NOT NULL,
      parameter TEXT NOT NULL,
      value TEXT NOT NULL,
      description TEXT NOT NULL,
      priority INTEGER NOT NULL DEFAULT 100,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      timestamp TEXT NOT NULL,
      risk_category TEXT NOT NULL,
      risk_score REAL NOT NULL,
      affordability_score REAL NOT NULL,
      affordability_category TEXT NOT NULL,
      recommended_product_id TEXT,
      recommended_product_name TEXT,
      recommended_amount REAL,
      recommended_rate REAL,
      recommended_tenure INTEGER,
      recommended_emi REAL,
      total_interest REAL,
      input_summary TEXT,
      reasons TEXT
    );
  `);
}

/**
 * Clean wrapper helpers for parameter queries
 */
function sanitizeParams(params: (string | number | null | undefined)[]): (string | number | null)[] {
  return params.map((p) => (p === undefined ? null : p));
}

export function queryAll<T = Record<string, unknown>>(sql: string, params: (string | number | null | undefined)[] = []): T[] {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  const clean = sanitizeParams(params);
  return stmt.all(...clean) as T[];
}

export function queryOne<T = Record<string, unknown>>(sql: string, params: (string | number | null | undefined)[] = []): T | undefined {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  const clean = sanitizeParams(params);
  return stmt.get(...clean) as T | undefined;
}

export function execute(sql: string, params: (string | number | null | undefined)[] = []): void {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  const clean = sanitizeParams(params);
  stmt.run(...clean);
}
