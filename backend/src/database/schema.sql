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
  allowed_employment_types TEXT NOT NULL, -- JSON array string
  allowed_purposes TEXT NOT NULL,         -- JSON array string
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
  input_summary TEXT, -- JSON string
  reasons TEXT        -- JSON array string
);
