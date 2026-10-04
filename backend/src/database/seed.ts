import { execute, queryOne } from './connection.js';

export function seedDatabase(): void {
  // Check if already seeded
  const existingProduct = queryOne('SELECT COUNT(*) as count FROM loan_products');
  const count = (existingProduct as { count: number })?.count || 0;

  if (count > 0) {
    console.log(`Database already seeded with ${count} loan products.`);
    return;
  }

  console.log('Seeding initial loan products and configurable business rules...');

  const loanProducts = [
    {
      id: 'prod_standard',
      product_name: 'Demo Finance Standard Personal Loan',
      lender_name: 'Demo FinServe Ltd',
      loan_type: 'Standard Personal Loan',
      description: 'Balanced personal loan suitable for general purposes with competitive market rates and steady repayment terms.',
      min_age: 21,
      max_age: 60,
      min_monthly_income: 25000,
      min_credit_score: 650,
      max_dti: 50.0,
      min_loan_amount: 50000,
      max_loan_amount: 1500000,
      min_tenure_months: 12,
      max_tenure_months: 60,
      base_interest_rate: 12.5,
      min_interest_rate: 11.5,
      max_interest_rate: 16.5,
      processing_fee: 1.5,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Government Employee', 'Self-Employed', 'Business Owner']),
      allowed_purposes: JSON.stringify(['Medical', 'Education', 'Home Renovation', 'Wedding', 'Travel', 'Vehicle', 'Personal', 'Emergency']),
      active: 1
    },
    {
      id: 'prod_low_interest',
      product_name: 'Demo Prime Low-Interest Personal Loan',
      lender_name: 'Demo Prime Capital',
      loan_type: 'Low Interest Personal Loan',
      description: 'Lowest interest rates crafted for salaried professionals and government personnel with excellent credit track records.',
      min_age: 23,
      max_age: 58,
      min_monthly_income: 45000,
      min_credit_score: 740,
      max_dti: 42.0,
      min_loan_amount: 100000,
      max_loan_amount: 2500000,
      min_tenure_months: 12,
      max_tenure_months: 60,
      base_interest_rate: 10.25,
      min_interest_rate: 9.75,
      max_interest_rate: 12.0,
      processing_fee: 1.0,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Government Employee']),
      allowed_purposes: JSON.stringify(['Medical', 'Education', 'Home Renovation', 'Wedding', 'Travel', 'Vehicle', 'Personal', 'Business', 'Emergency']),
      active: 1
    },
    {
      id: 'prod_premium',
      product_name: 'Demo Elite Premium Personal Loan',
      lender_name: 'Demo Apex Trust',
      loan_type: 'Premium Personal Loan',
      description: 'High-limit loan offering extended tenures up to 84 months and dedicated relationship manager terms for high earners.',
      min_age: 25,
      max_age: 62,
      min_monthly_income: 70000,
      min_credit_score: 720,
      max_dti: 45.0,
      min_loan_amount: 300000,
      max_loan_amount: 4000000,
      min_tenure_months: 12,
      max_tenure_months: 84,
      base_interest_rate: 10.75,
      min_interest_rate: 10.25,
      max_interest_rate: 13.5,
      processing_fee: 1.0,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Government Employee', 'Business Owner', 'Self-Employed']),
      allowed_purposes: JSON.stringify(['Medical', 'Education', 'Home Renovation', 'Wedding', 'Travel', 'Vehicle', 'Personal', 'Business', 'Emergency']),
      active: 1
    },
    {
      id: 'prod_flexi',
      product_name: 'Demo Flexi-Choice Personal Loan',
      lender_name: 'Demo Vantage Credit',
      loan_type: 'Flexible Personal Loan',
      description: 'Flexible eligibility criteria accommodating self-employed professionals, freelancers, and moderate credit scores.',
      min_age: 21,
      max_age: 65,
      min_monthly_income: 20000,
      min_credit_score: 600,
      max_dti: 55.0,
      min_loan_amount: 30000,
      max_loan_amount: 800000,
      min_tenure_months: 12,
      max_tenure_months: 48,
      base_interest_rate: 14.5,
      min_interest_rate: 13.0,
      max_interest_rate: 19.5,
      processing_fee: 2.0,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Government Employee']),
      allowed_purposes: JSON.stringify(['Medical', 'Education', 'Home Renovation', 'Wedding', 'Travel', 'Vehicle', 'Personal', 'Emergency']),
      active: 1
    },
    {
      id: 'prod_debt_consolidation',
      product_name: 'Demo Relief Debt Consolidation Loan',
      lender_name: 'Demo Resolution Finance',
      loan_type: 'Debt Consolidation Loan',
      description: 'Specifically designed to consolidate multiple high-cost obligations into one structured monthly EMI with relaxed DTI criteria.',
      min_age: 22,
      max_age: 60,
      min_monthly_income: 30000,
      min_credit_score: 620,
      max_dti: 65.0,
      min_loan_amount: 100000,
      max_loan_amount: 2000000,
      min_tenure_months: 18,
      max_tenure_months: 72,
      base_interest_rate: 11.99,
      min_interest_rate: 11.25,
      max_interest_rate: 15.0,
      processing_fee: 1.25,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Government Employee', 'Self-Employed', 'Business Owner']),
      allowed_purposes: JSON.stringify(['Debt Consolidation', 'Personal']),
      active: 1
    },
    {
      id: 'prod_emergency',
      product_name: 'Demo Swift Emergency Personal Loan',
      lender_name: 'Demo QuickCredit FinTech',
      loan_type: 'Emergency Personal Loan',
      description: 'Rapid approval loan for unexpected medical bills, health contingencies, and immediate personal liquidity needs.',
      min_age: 20,
      max_age: 65,
      min_monthly_income: 18000,
      min_credit_score: 580,
      max_dti: 55.0,
      min_loan_amount: 25000,
      max_loan_amount: 500000,
      min_tenure_months: 12,
      max_tenure_months: 36,
      base_interest_rate: 13.5,
      min_interest_rate: 12.5,
      max_interest_rate: 18.0,
      processing_fee: 1.5,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Government Employee', 'Self-Employed', 'Business Owner', 'Freelancer']),
      allowed_purposes: JSON.stringify(['Emergency', 'Medical', 'Personal']),
      active: 1
    },
    {
      id: 'prod_short_term',
      product_name: 'Demo Express Short-Term Personal Loan',
      lender_name: 'Demo MicroPaisa',
      loan_type: 'Short-Term Personal Loan',
      description: 'Convenient short-tenure loan for rapid repayment (12–24 months) to minimize long-term total interest burden.',
      min_age: 21,
      max_age: 62,
      min_monthly_income: 18000,
      min_credit_score: 600,
      max_dti: 50.0,
      min_loan_amount: 20000,
      max_loan_amount: 300000,
      min_tenure_months: 12,
      max_tenure_months: 24,
      base_interest_rate: 13.0,
      min_interest_rate: 12.0,
      max_interest_rate: 17.5,
      processing_fee: 2.0,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Government Employee', 'Self-Employed', 'Business Owner', 'Freelancer']),
      allowed_purposes: JSON.stringify(['Medical', 'Education', 'Home Renovation', 'Wedding', 'Travel', 'Vehicle', 'Personal', 'Emergency']),
      active: 1
    },
    {
      id: 'prod_education',
      product_name: 'Demo Vidya Education Support Loan',
      lender_name: 'Demo Scholar Finance',
      loan_type: 'Education Support Loan',
      description: 'Concessional interest rate personal financing for vocational training, university fees, and higher learning expenses.',
      min_age: 18,
      max_age: 55,
      min_monthly_income: 22000,
      min_credit_score: 640,
      max_dti: 48.0,
      min_loan_amount: 50000,
      max_loan_amount: 2000000,
      min_tenure_months: 12,
      max_tenure_months: 72,
      base_interest_rate: 10.99,
      min_interest_rate: 10.5,
      max_interest_rate: 13.5,
      processing_fee: 1.0,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Government Employee', 'Self-Employed', 'Business Owner']),
      allowed_purposes: JSON.stringify(['Education']),
      active: 1
    },
    {
      id: 'prod_home_renovation',
      product_name: 'Demo Griha Home Improvement Loan',
      lender_name: 'Demo Habitat Finance',
      loan_type: 'Home Improvement Loan',
      description: 'Optimized for apartment upgrades, structural renovations, interior woodwork, and fixture installations.',
      min_age: 23,
      max_age: 65,
      min_monthly_income: 35000,
      min_credit_score: 680,
      max_dti: 50.0,
      min_loan_amount: 100000,
      max_loan_amount: 3000000,
      min_tenure_months: 18,
      max_tenure_months: 84,
      base_interest_rate: 11.25,
      min_interest_rate: 10.75,
      max_interest_rate: 14.0,
      processing_fee: 1.0,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Salaried', 'Government Employee', 'Self-Employed', 'Business Owner']),
      allowed_purposes: JSON.stringify(['Home Renovation']),
      active: 1
    },
    {
      id: 'prod_business',
      product_name: 'Demo Udyam Business Growth Personal Loan',
      lender_name: 'Demo Enterprise Credit',
      loan_type: 'Business Personal Loan',
      description: 'Structured personal credit facility catering to proprietors and business owners seeking working capital.',
      min_age: 24,
      max_age: 65,
      min_monthly_income: 40000,
      min_credit_score: 660,
      max_dti: 52.0,
      min_loan_amount: 150000,
      max_loan_amount: 3500000,
      min_tenure_months: 12,
      max_tenure_months: 60,
      base_interest_rate: 13.25,
      min_interest_rate: 12.0,
      max_interest_rate: 17.0,
      processing_fee: 1.75,
      processing_fee_type: 'percentage',
      allowed_employment_types: JSON.stringify(['Business Owner', 'Self-Employed']),
      allowed_purposes: JSON.stringify(['Business', 'Personal']),
      active: 1
    }
  ];

  for (const p of loanProducts) {
    execute(
      `INSERT INTO loan_products (
        id, product_name, lender_name, loan_type, description,
        min_age, max_age, min_monthly_income, min_credit_score, max_dti,
        min_loan_amount, max_loan_amount, min_tenure_months, max_tenure_months,
        base_interest_rate, min_interest_rate, max_interest_rate,
        processing_fee, processing_fee_type, allowed_employment_types, allowed_purposes, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id, p.product_name, p.lender_name, p.loan_type, p.description,
        p.min_age, p.max_age, p.min_monthly_income, p.min_credit_score, p.max_dti,
        p.min_loan_amount, p.max_loan_amount, p.min_tenure_months, p.max_tenure_months,
        p.base_interest_rate, p.min_interest_rate, p.max_interest_rate,
        p.processing_fee, p.processing_fee_type, p.allowed_employment_types, p.allowed_purposes, p.active
      ]
    );
  }

  // Seed business rules
  const businessRules = [
    {
      id: 'rule_risk_credit_score_weight',
      rule_name: 'Credit Score Risk Weight',
      rule_category: 'risk_scoring',
      parameter: 'credit_score_weight',
      value: '40',
      description: 'Maximum points contributed by applicant credit score to risk score (out of 100).',
      priority: 10
    },
    {
      id: 'rule_risk_dti_weight',
      rule_name: 'Debt-to-Income Risk Weight',
      rule_category: 'risk_scoring',
      parameter: 'dti_weight',
      value: '20',
      description: 'Maximum points contributed by existing DTI ratio to risk score (out of 100).',
      priority: 20
    },
    {
      id: 'rule_risk_emp_weight',
      rule_name: 'Employment Stability Risk Weight',
      rule_category: 'risk_scoring',
      parameter: 'employment_stability_weight',
      value: '15',
      description: 'Maximum points contributed by employment tenure and stability to risk score (out of 100).',
      priority: 30
    },
    {
      id: 'rule_risk_payment_history_weight',
      rule_name: 'Payment History Risk Weight',
      rule_category: 'risk_scoring',
      parameter: 'payment_history_weight',
      value: '15',
      description: 'Maximum points contributed by clean payment track and absence of defaults (out of 100).',
      priority: 40
    },
    {
      id: 'rule_risk_affordability_weight',
      rule_name: 'Affordability Capacity Risk Weight',
      rule_category: 'risk_scoring',
      parameter: 'affordability_weight',
      value: '10',
      description: 'Maximum points contributed by disposable cash cushion and savings ratio (out of 100).',
      priority: 50
    },
    {
      id: 'rule_rank_affordability_weight',
      rule_name: 'Recommendation Ranking Affordability Weight',
      rule_category: 'ranking',
      parameter: 'weight_affordability',
      value: '0.30',
      description: 'Weight assigned to affordability fit in recommendation score.',
      priority: 60
    },
    {
      id: 'rule_rank_interest_rate_weight',
      rule_name: 'Recommendation Ranking Interest Rate Advantage Weight',
      rule_category: 'ranking',
      parameter: 'weight_interest_rate',
      value: '0.25',
      description: 'Weight assigned to low interest rate competitive advantage in recommendation score.',
      priority: 70
    },
    {
      id: 'rule_rank_product_fit_weight',
      rule_name: 'Recommendation Ranking Purpose & Profile Fit Weight',
      rule_category: 'ranking',
      parameter: 'weight_product_fit',
      value: '0.20',
      description: 'Weight assigned to purpose alignment and borrower profile fit in recommendation score.',
      priority: 80
    },
    {
      id: 'rule_rank_amount_fit_weight',
      rule_name: 'Recommendation Ranking Loan Amount Fit Weight',
      rule_category: 'ranking',
      parameter: 'weight_amount_fit',
      value: '0.15',
      description: 'Weight assigned to how closely the loan amount meets the requested amount.',
      priority: 90
    },
    {
      id: 'rule_rank_tenure_fit_weight',
      rule_name: 'Recommendation Ranking Tenure Fit Weight',
      rule_category: 'ranking',
      parameter: 'weight_tenure_fit',
      value: '0.10',
      description: 'Weight assigned to applicant preferred tenure match.',
      priority: 100
    },
    {
      id: 'rule_affordability_max_dti',
      rule_name: 'Maximum Prudent Debt Service Ratio',
      rule_category: 'affordability',
      parameter: 'max_dti_ratio',
      value: '45.0',
      description: 'Upper threshold percentage of gross monthly income allowed for all EMIs combined.',
      priority: 110
    }
  ];

  for (const r of businessRules) {
    execute(
      `INSERT INTO business_rules (
        id, rule_name, rule_category, parameter, value, description, priority, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [r.id, r.rule_name, r.rule_category, r.parameter, r.value, r.description, r.priority]
    );
  }

  console.log('Seeding completed successfully!');
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
