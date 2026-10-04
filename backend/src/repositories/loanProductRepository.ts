import { queryAll, queryOne } from '../database/connection.js';
import { LoanProduct } from '../types/index.js';

interface RawProductRow {
  id: string;
  product_name: string;
  lender_name: string;
  loan_type: string;
  description: string;
  min_age: number;
  max_age: number;
  min_monthly_income: number;
  min_credit_score: number;
  max_dti: number;
  min_loan_amount: number;
  max_loan_amount: number;
  min_tenure_months: number;
  max_tenure_months: number;
  base_interest_rate: number;
  min_interest_rate: number;
  max_interest_rate: number;
  processing_fee: number;
  processing_fee_type: 'percentage' | 'fixed';
  allowed_employment_types: string;
  allowed_purposes: string;
  active: number;
}

function mapRowToProduct(row: RawProductRow): LoanProduct {
  let employmentTypes: string[] = [];
  let purposes: string[] = [];

  try {
    employmentTypes = JSON.parse(row.allowed_employment_types);
  } catch {
    employmentTypes = ['Salaried'];
  }

  try {
    purposes = JSON.parse(row.allowed_purposes);
  } catch {
    purposes = ['Personal'];
  }

  return {
    id: row.id,
    product_name: row.product_name,
    lender_name: row.lender_name,
    loan_type: row.loan_type,
    description: row.description,
    min_age: row.min_age,
    max_age: row.max_age,
    min_monthly_income: row.min_monthly_income,
    min_credit_score: row.min_credit_score,
    max_dti: row.max_dti,
    min_loan_amount: row.min_loan_amount,
    max_loan_amount: row.max_loan_amount,
    min_tenure_months: row.min_tenure_months,
    max_tenure_months: row.max_tenure_months,
    base_interest_rate: row.base_interest_rate,
    min_interest_rate: row.min_interest_rate,
    max_interest_rate: row.max_interest_rate,
    processing_fee: row.processing_fee,
    processing_fee_type: row.processing_fee_type,
    allowed_employment_types: employmentTypes,
    allowed_purposes: purposes,
    active: row.active === 1
  };
}

export class LoanProductRepository {
  public static getAllActive(): LoanProduct[] {
    const rows = queryAll<RawProductRow>(
      'SELECT * FROM loan_products WHERE active = 1 ORDER BY base_interest_rate ASC'
    );
    return rows.map(mapRowToProduct);
  }

  public static getById(id: string): LoanProduct | null {
    const row = queryOne<RawProductRow>(
      'SELECT * FROM loan_products WHERE id = ?',
      [id]
    );
    return row ? mapRowToProduct(row) : null;
  }
}
