export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';
export type Education = 'High School' | 'Diploma' | 'Graduate' | 'Post Graduate' | 'Professional';
export type ResidenceType = 'Owned' | 'Rented' | 'Family';
export type CityTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export type EmploymentType =
  | 'Salaried'
  | 'Self-Employed'
  | 'Business Owner'
  | 'Freelancer'
  | 'Government Employee';

export type LoanPurpose =
  | 'Medical'
  | 'Education'
  | 'Home Renovation'
  | 'Wedding'
  | 'Travel'
  | 'Debt Consolidation'
  | 'Vehicle'
  | 'Personal'
  | 'Business'
  | 'Emergency';

export interface CustomerProfileInput {
  // Step 1: Personal
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
  dependents: number;
  education: Education;
  residenceType: ResidenceType;
  cityTier: CityTier;

  // Step 2: Employment
  employmentType: EmploymentType;
  experienceYears: number;
  employerStability?: 'High' | 'Medium' | 'Low' | string;

  // Step 3: Financial Profile
  monthlyIncome: number;
  monthlyExpenses: number;
  existingLoanAmount: number;
  existingMonthlyEmi: number;
  existingLoanCount: number;
  savingsBalance: number;
  bankAccountAgeYears: number;

  // Step 4: Credit Profile
  creditScore: number;
  creditHistoryYears: number;
  latePaymentCount: number;
  creditUtilizationRatio: number; // 0 - 100
  previousLoanCount: number;
  previousLoanDefaultCount: number;

  // Step 5: Loan Requirement
  loanPurpose: LoanPurpose;
  requestedAmount: number;
  preferredTenureMonths: number;
}

export interface LoanProduct {
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
  processing_fee: number; // percentage or fixed
  processing_fee_type: 'percentage' | 'fixed';
  allowed_employment_types: string[]; // parsed from JSON string
  allowed_purposes: string[]; // parsed from JSON string
  active: boolean;
}

export interface BusinessRule {
  id: string;
  rule_name: string;
  rule_category: string;
  parameter: string;
  value: string; // JSON or primitive string
  description: string;
  priority: number;
  active: boolean;
}

export interface FinancialSummary {
  monthly_income: number;
  monthly_expenses: number;
  existing_emi: number;
  disposable_income: number;
  existing_dti: number;
  savings_to_income_ratio: number;
  is_financially_constrained: boolean;
  constraint_reason?: string;
}

export type RiskCategory = 'Low' | 'Medium' | 'High' | 'Very High';
export type AffordabilityCategory =
  | 'Highly Affordable'
  | 'Affordable'
  | 'Borderline'
  | 'Difficult'
  | 'Unaffordable';

export interface RiskEvaluation {
  score: number; // 0 - 100
  category: RiskCategory;
  factors: {
    credit_score_points: number;
    dti_points: number;
    employment_stability_points: number;
    payment_history_points: number;
    affordability_points: number;
  };
  details: string[];
}

export interface AffordabilityEvaluation {
  score: number; // 0 - 100
  category: AffordabilityCategory;
  max_allowable_total_emi: number;
  maximum_new_emi: number;
  max_affordable_loan_amount: number;
  factors: {
    disposable_income: number;
    dti_headroom: number;
    savings_cushion: number;
  };
  details: string[];
}

export interface EligibilityResult {
  productId: string;
  productName: string;
  isEligible: boolean;
  failedHardRules: string[];
  passedRules: string[];
}

export interface ProductRecommendationItem {
  product: LoanProduct;
  recommended_amount: number;
  interest_rate: number;
  tenure_months: number;
  emi: number;
  total_interest: number;
  total_payment: number;
  processing_fee_amount: number;
  proposed_dti: number;
  recommendation_score: number; // 0 - 100
  sub_scores: {
    affordability_score: number;
    interest_rate_score: number;
    product_fit_score: number;
    amount_fit_score: number;
    tenure_fit_score: number;
  };
  reasons: string[];
}

export interface RecommendationResponse {
  status: 'success' | 'no_match' | 'invalid_situation';
  financial_summary: FinancialSummary;
  risk: {
    score: number;
    category: RiskCategory;
    summary: string;
  };
  affordability: {
    score: number;
    category: AffordabilityCategory;
    maximum_new_emi: number;
    max_affordable_loan: number;
  };
  recommendation?: {
    product_id: string;
    product_name: string;
    lender_name: string;
    loan_type: string;
    description: string;
    amount: number;
    interest_rate: number;
    tenure_months: number;
    emi: number;
    total_interest: number;
    total_payment: number;
    processing_fee_amount: number;
    proposed_dti: number;
    recommendation_score: number;
  };
  reasons: string[];
  cautionary_notes?: string[];
  alternatives: Array<{
    product_id: string;
    product_name: string;
    lender_name: string;
    loan_type: string;
    description: string;
    amount: number;
    interest_rate: number;
    tenure_months: number;
    emi: number;
    total_interest: number;
    total_payment: number;
    proposed_dti: number;
    recommendation_score: number;
    key_reason: string;
  }>;
  ineligible_products_count: number;
  ineligible_reasons_summary?: Record<string, string[]>;
  timestamp: string;
}
