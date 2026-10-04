import { Request, Response } from 'express';
import { CustomerProfileInput } from '../types/index.js';

export interface DemoProfileItem {
  id: string;
  name: string;
  tagline: string;
  scenarioType: string;
  data: CustomerProfileInput;
}

export const DEMO_PROFILES: DemoProfileItem[] = [
  {
    id: 'excellent_salaried',
    name: 'Priya Sharma (Prime Salaried)',
    tagline: 'High credit score (780), low existing debt, 6 years experience',
    scenarioType: 'Prime Profile',
    data: {
      age: 32,
      gender: 'Female',
      maritalStatus: 'Married',
      dependents: 1,
      education: 'Post Graduate',
      residenceType: 'Owned',
      cityTier: 'Tier 1',
      employmentType: 'Salaried',
      experienceYears: 6,
      employerStability: 'High',
      monthlyIncome: 85000,
      monthlyExpenses: 30000,
      existingLoanAmount: 150000,
      existingMonthlyEmi: 8000,
      existingLoanCount: 1,
      savingsBalance: 350000,
      bankAccountAgeYears: 7,
      creditScore: 780,
      creditHistoryYears: 6,
      latePaymentCount: 0,
      creditUtilizationRatio: 18,
      previousLoanCount: 2,
      previousLoanDefaultCount: 0,
      loanPurpose: 'Home Renovation',
      requestedAmount: 500000,
      preferredTenureMonths: 36
    }
  },
  {
    id: 'average_salaried',
    name: 'Rahul Verma (Average Salaried)',
    tagline: 'Moderate income (₹45,000), fair credit score (690), average debt',
    scenarioType: 'Standard Profile',
    data: {
      age: 28,
      gender: 'Male',
      maritalStatus: 'Single',
      dependents: 0,
      education: 'Graduate',
      residenceType: 'Rented',
      cityTier: 'Tier 2',
      employmentType: 'Salaried',
      experienceYears: 3,
      employerStability: 'Medium',
      monthlyIncome: 45000,
      monthlyExpenses: 20000,
      existingLoanAmount: 120000,
      existingMonthlyEmi: 7500,
      existingLoanCount: 1,
      savingsBalance: 75000,
      bankAccountAgeYears: 4,
      creditScore: 690,
      creditHistoryYears: 3,
      latePaymentCount: 1,
      creditUtilizationRatio: 42,
      previousLoanCount: 1,
      previousLoanDefaultCount: 0,
      loanPurpose: 'Personal',
      requestedAmount: 250000,
      preferredTenureMonths: 24
    }
  },
  {
    id: 'self_employed_growth',
    name: 'Amit Patel (Business Proprietor)',
    tagline: 'Self-employed 5 yrs, monthly income ₹1,10,000, business loan requirement',
    scenarioType: 'Business Growth',
    data: {
      age: 38,
      gender: 'Male',
      maritalStatus: 'Married',
      dependents: 2,
      education: 'Graduate',
      residenceType: 'Owned',
      cityTier: 'Tier 1',
      employmentType: 'Business Owner',
      experienceYears: 9,
      employerStability: 'High',
      monthlyIncome: 110000,
      monthlyExpenses: 48000,
      existingLoanAmount: 400000,
      existingMonthlyEmi: 18000,
      existingLoanCount: 2,
      savingsBalance: 420000,
      bankAccountAgeYears: 8,
      creditScore: 735,
      creditHistoryYears: 7,
      latePaymentCount: 0,
      creditUtilizationRatio: 35,
      previousLoanCount: 3,
      previousLoanDefaultCount: 0,
      loanPurpose: 'Business',
      requestedAmount: 800000,
      preferredTenureMonths: 48
    }
  },
  {
    id: 'high_debt_consolidation',
    name: 'Vikram Singh (High Debt Burden)',
    tagline: 'DTI > 48%, multiple existing loans, seeking debt consolidation',
    scenarioType: 'Debt Consolidation',
    data: {
      age: 35,
      gender: 'Male',
      maritalStatus: 'Married',
      dependents: 2,
      education: 'Graduate',
      residenceType: 'Rented',
      cityTier: 'Tier 2',
      employmentType: 'Salaried',
      experienceYears: 7,
      employerStability: 'Medium',
      monthlyIncome: 55000,
      monthlyExpenses: 22000,
      existingLoanAmount: 600000,
      existingMonthlyEmi: 27000,
      existingLoanCount: 3,
      savingsBalance: 40000,
      bankAccountAgeYears: 5,
      creditScore: 645,
      creditHistoryYears: 5,
      latePaymentCount: 2,
      creditUtilizationRatio: 68,
      previousLoanCount: 3,
      previousLoanDefaultCount: 0,
      loanPurpose: 'Debt Consolidation',
      requestedAmount: 400000,
      preferredTenureMonths: 60
    }
  },
  {
    id: 'low_credit_rebuilding',
    name: 'Sunita Rao (Credit Builder)',
    tagline: 'Credit score 595, late payments, looking for flexible emergency loan',
    scenarioType: 'Subprime / Rebuilding',
    data: {
      age: 26,
      gender: 'Female',
      maritalStatus: 'Single',
      dependents: 0,
      education: 'Diploma',
      residenceType: 'Family',
      cityTier: 'Tier 3',
      employmentType: 'Freelancer',
      experienceYears: 2,
      employerStability: 'Low',
      monthlyIncome: 30000,
      monthlyExpenses: 16000,
      existingLoanAmount: 0,
      existingMonthlyEmi: 0,
      existingLoanCount: 0,
      savingsBalance: 25000,
      bankAccountAgeYears: 2,
      creditScore: 595,
      creditHistoryYears: 2,
      latePaymentCount: 3,
      creditUtilizationRatio: 78,
      previousLoanCount: 1,
      previousLoanDefaultCount: 0,
      loanPurpose: 'Emergency',
      requestedAmount: 80000,
      preferredTenureMonths: 18
    }
  },
  {
    id: 'education_aspirant',
    name: 'Ananya Deshmukh (Education Aspirant)',
    tagline: 'Age 23, young graduate, seeking education support loan',
    scenarioType: 'Education Loan',
    data: {
      age: 23,
      gender: 'Female',
      maritalStatus: 'Single',
      dependents: 0,
      education: 'Graduate',
      residenceType: 'Family',
      cityTier: 'Tier 2',
      employmentType: 'Salaried',
      experienceYears: 1,
      employerStability: 'Medium',
      monthlyIncome: 32000,
      monthlyExpenses: 12000,
      existingLoanAmount: 0,
      existingMonthlyEmi: 0,
      existingLoanCount: 0,
      savingsBalance: 45000,
      bankAccountAgeYears: 2,
      creditScore: 710,
      creditHistoryYears: 2,
      latePaymentCount: 0,
      creditUtilizationRatio: 12,
      previousLoanCount: 0,
      previousLoanDefaultCount: 0,
      loanPurpose: 'Education',
      requestedAmount: 300000,
      preferredTenureMonths: 36
    }
  }
];

export class DemoProfileController {
  public static getDemoProfiles(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'success',
      data: DEMO_PROFILES
    });
  }
}
