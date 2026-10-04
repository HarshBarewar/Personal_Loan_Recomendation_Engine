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
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
  dependents: number;
  education: Education;
  residenceType: ResidenceType;
  cityTier: CityTier;

  employmentType: EmploymentType;
  experienceYears: number;
  employerStability?: string;

  monthlyIncome: number;
  monthlyExpenses: number;
  existingLoanAmount: number;
  existingMonthlyEmi: number;
  existingLoanCount: number;
  savingsBalance: number;
  bankAccountAgeYears: number;

  creditScore: number;
  creditHistoryYears: number;
  latePaymentCount: number;
  creditUtilizationRatio: number;
  previousLoanCount: number;
  previousLoanDefaultCount: number;

  loanPurpose: LoanPurpose;
  requestedAmount: number;
  preferredTenureMonths: number;
}

export type RiskCategory = 'Low' | 'Medium' | 'High' | 'Very High';
export type AffordabilityCategory =
  | 'Highly Affordable'
  | 'Affordable'
  | 'Borderline'
  | 'Difficult'
  | 'Unaffordable';

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

export interface DemoProfileItem {
  id: string;
  name: string;
  tagline: string;
  scenarioType: string;
  data: CustomerProfileInput;
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
  processing_fee: number;
  processing_fee_type: 'percentage' | 'fixed';
  allowed_employment_types: string[];
  allowed_purposes: string[];
  active: boolean;
}
