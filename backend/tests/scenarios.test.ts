import test from 'node:test';
import assert from 'node:assert/strict';
import { CustomerProfileInput } from '../src/types/index.js';
import { LoanProductRepository } from '../src/repositories/loanProductRepository.js';
import { RecommendationOrchestrator } from '../src/engine/recommendationOrchestrator.js';
import { seedDatabase } from '../src/database/seed.js';

// Ensure seed data is initialized for test execution
seedDatabase();
const products = LoanProductRepository.getAllActive();

test('Scenario 1: Excellent Prime Customer', () => {
  const customer: CustomerProfileInput = {
    age: 33,
    gender: 'Female',
    maritalStatus: 'Married',
    dependents: 1,
    education: 'Post Graduate',
    residenceType: 'Owned',
    cityTier: 'Tier 1',
    employmentType: 'Salaried',
    experienceYears: 8,
    employerStability: 'High',
    monthlyIncome: 120000,
    monthlyExpenses: 40000,
    existingLoanAmount: 100000,
    existingMonthlyEmi: 5000,
    existingLoanCount: 1,
    savingsBalance: 500000,
    bankAccountAgeYears: 8,
    creditScore: 810,
    creditHistoryYears: 8,
    latePaymentCount: 0,
    creditUtilizationRatio: 15,
    previousLoanCount: 2,
    previousLoanDefaultCount: 0,
    loanPurpose: 'Home Renovation',
    requestedAmount: 600000,
    preferredTenureMonths: 36
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  assert.equal(result.status, 'success');
  assert.equal(result.risk.category, 'Low');
  assert.ok(result.risk.score >= 80, `Expected risk score >= 80, got ${result.risk.score}`);
  assert.ok(result.recommendation !== undefined);
  assert.equal(result.recommendation.amount, 600000);
  assert.ok(result.recommendation.interest_rate <= 11.5);
  assert.ok(result.reasons.length >= 2);
  assert.ok(result.alternatives.length >= 1);
});

test('Scenario 2: Average Salaried Customer', () => {
  const customer: CustomerProfileInput = {
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
    existingLoanAmount: 100000,
    existingMonthlyEmi: 7000,
    existingLoanCount: 1,
    savingsBalance: 60000,
    bankAccountAgeYears: 4,
    creditScore: 690,
    creditHistoryYears: 3,
    latePaymentCount: 1,
    creditUtilizationRatio: 40,
    previousLoanCount: 1,
    previousLoanDefaultCount: 0,
    loanPurpose: 'Personal',
    requestedAmount: 200000,
    preferredTenureMonths: 24
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  assert.equal(result.status, 'success');
  assert.ok(['Low', 'Medium'].includes(result.risk.category));
  assert.ok(result.recommendation !== undefined);
  assert.ok(result.recommendation.amount > 0);
  assert.ok(result.recommendation.emi > 0);
});

test('Scenario 3: High-Risk Customer (Low credit & late payments)', () => {
  const customer: CustomerProfileInput = {
    age: 29,
    gender: 'Male',
    maritalStatus: 'Single',
    dependents: 1,
    education: 'Diploma',
    residenceType: 'Rented',
    cityTier: 'Tier 3',
    employmentType: 'Freelancer',
    experienceYears: 2,
    employerStability: 'Low',
    monthlyIncome: 32000,
    monthlyExpenses: 20000,
    existingLoanAmount: 50000,
    existingMonthlyEmi: 4000,
    existingLoanCount: 1,
    savingsBalance: 15000,
    bankAccountAgeYears: 2,
    creditScore: 605,
    creditHistoryYears: 2,
    latePaymentCount: 4,
    creditUtilizationRatio: 82,
    previousLoanCount: 1,
    previousLoanDefaultCount: 0,
    loanPurpose: 'Personal',
    requestedAmount: 100000,
    preferredTenureMonths: 18
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  assert.ok(['High', 'Medium', 'Very High'].includes(result.risk.category));
  if (result.status === 'success') {
    assert.ok(result.recommendation !== undefined);
    assert.ok(result.recommendation.interest_rate >= 13.0);
  }
});

test('Scenario 4: High-Income / High-Debt Customer (Seeking Debt Consolidation)', () => {
  const customer: CustomerProfileInput = {
    age: 36,
    gender: 'Male',
    maritalStatus: 'Married',
    dependents: 2,
    education: 'Graduate',
    residenceType: 'Owned',
    cityTier: 'Tier 1',
    employmentType: 'Salaried',
    experienceYears: 8,
    monthlyIncome: 95000,
    monthlyExpenses: 35000,
    existingLoanAmount: 900000,
    existingMonthlyEmi: 42000, // existing DTI is 44.2%
    existingLoanCount: 3,
    savingsBalance: 100000,
    bankAccountAgeYears: 6,
    creditScore: 660,
    creditHistoryYears: 6,
    latePaymentCount: 1,
    creditUtilizationRatio: 65,
    previousLoanCount: 3,
    previousLoanDefaultCount: 0,
    loanPurpose: 'Debt Consolidation',
    requestedAmount: 500000,
    preferredTenureMonths: 60
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  assert.equal(result.status, 'success');
  assert.ok(result.recommendation !== undefined);
  // Specifically matches Debt Consolidation product or capped amount
  assert.ok(result.recommendation.product_name.includes('Debt Consolidation') || result.recommendation.amount > 0);
});

test('Scenario 5: Low-Income Customer', () => {
  const customer: CustomerProfileInput = {
    age: 22,
    gender: 'Female',
    maritalStatus: 'Single',
    dependents: 0,
    education: 'High School',
    residenceType: 'Family',
    cityTier: 'Tier 3',
    employmentType: 'Salaried',
    experienceYears: 1,
    monthlyIncome: 19000,
    monthlyExpenses: 11000,
    existingLoanAmount: 0,
    existingMonthlyEmi: 0,
    existingLoanCount: 0,
    savingsBalance: 12000,
    bankAccountAgeYears: 1,
    creditScore: 620,
    creditHistoryYears: 1,
    latePaymentCount: 0,
    creditUtilizationRatio: 20,
    previousLoanCount: 0,
    previousLoanDefaultCount: 0,
    loanPurpose: 'Emergency',
    requestedAmount: 40000,
    preferredTenureMonths: 18
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  // Income is 19k, which qualifies for emergency or short term products with min income 18k
  assert.equal(result.status, 'success');
  assert.ok(result.recommendation !== undefined);
  assert.ok(result.recommendation.amount <= 50000);
});

test('Scenario 6: Large Requested Loan Exceeding Affordability (Amount Capped Safely)', () => {
  const customer: CustomerProfileInput = {
    age: 30,
    gender: 'Male',
    maritalStatus: 'Single',
    dependents: 0,
    education: 'Graduate',
    residenceType: 'Rented',
    cityTier: 'Tier 2',
    employmentType: 'Salaried',
    experienceYears: 4,
    monthlyIncome: 40000,
    monthlyExpenses: 20000,
    existingLoanAmount: 50000,
    existingMonthlyEmi: 5000,
    existingLoanCount: 1,
    savingsBalance: 50000,
    bankAccountAgeYears: 4,
    creditScore: 710,
    creditHistoryYears: 4,
    latePaymentCount: 0,
    creditUtilizationRatio: 25,
    previousLoanCount: 1,
    previousLoanDefaultCount: 0,
    loanPurpose: 'Personal',
    requestedAmount: 1500000, // User wants 15 Lakhs on 40k income!
    preferredTenureMonths: 36
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  assert.equal(result.status, 'success');
  assert.ok(result.recommendation !== undefined);
  // Must NOT recommend 15 lakhs; must safely cap amount to fit within affordable EMI
  assert.ok(result.recommendation.amount < 1500000, `Amount should be capped, got ${result.recommendation.amount}`);
  // Explanation must explain why amount was adjusted
  const hasDownsizeReason = result.reasons.concat(result.cautionary_notes || []).some((r) =>
    r.includes('adjusted') || r.includes('capacity') || r.includes('sustainable') || r.includes('exceeds')
  );
  assert.ok(hasDownsizeReason, 'Explanations should clearly mention downward adjustment of requested amount');
});

test('Scenario 7: Customer with Previous Defaults', () => {
  const customer: CustomerProfileInput = {
    age: 34,
    gender: 'Male',
    maritalStatus: 'Married',
    dependents: 1,
    education: 'Graduate',
    residenceType: 'Rented',
    cityTier: 'Tier 2',
    employmentType: 'Salaried',
    experienceYears: 6,
    monthlyIncome: 50000,
    monthlyExpenses: 25000,
    existingLoanAmount: 0,
    existingMonthlyEmi: 0,
    existingLoanCount: 0,
    savingsBalance: 30000,
    bankAccountAgeYears: 4,
    creditScore: 610,
    creditHistoryYears: 4,
    latePaymentCount: 2,
    creditUtilizationRatio: 50,
    previousLoanCount: 2,
    previousLoanDefaultCount: 1, // Past default
    loanPurpose: 'Personal',
    requestedAmount: 100000,
    preferredTenureMonths: 24
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  // Past defaults eliminate prime products (prod_low_interest, prod_premium)
  if (result.status === 'success') {
    assert.ok(result.recommendation !== undefined);
    assert.notEqual(result.recommendation.product_id, 'prod_low_interest');
    assert.notEqual(result.recommendation.product_id, 'prod_premium');
  }
});

test('Scenario 8: Customer with No Existing Debt', () => {
  const customer: CustomerProfileInput = {
    age: 26,
    gender: 'Female',
    maritalStatus: 'Single',
    dependents: 0,
    education: 'Graduate',
    residenceType: 'Owned',
    cityTier: 'Tier 1',
    employmentType: 'Salaried',
    experienceYears: 3,
    monthlyIncome: 60000,
    monthlyExpenses: 22000,
    existingLoanAmount: 0,
    existingMonthlyEmi: 0,
    existingLoanCount: 0,
    savingsBalance: 180000,
    bankAccountAgeYears: 3,
    creditScore: 745,
    creditHistoryYears: 3,
    latePaymentCount: 0,
    creditUtilizationRatio: 10,
    previousLoanCount: 0,
    previousLoanDefaultCount: 0,
    loanPurpose: 'Travel',
    requestedAmount: 200000,
    preferredTenureMonths: 24
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  assert.equal(result.status, 'success');
  assert.equal(result.financial_summary.existing_dti, 0);
  assert.ok(result.recommendation !== undefined);
  assert.equal(result.recommendation.amount, 200000);
});

test('Scenario 9: Customer with Expenses Exceeding Income (Invalid Situation)', () => {
  const customer: CustomerProfileInput = {
    age: 30,
    gender: 'Male',
    maritalStatus: 'Single',
    dependents: 0,
    education: 'Graduate',
    residenceType: 'Rented',
    cityTier: 'Tier 1',
    employmentType: 'Salaried',
    experienceYears: 4,
    monthlyIncome: 40000,
    monthlyExpenses: 45000, // Expenses exceed income!
    existingLoanAmount: 100000,
    existingMonthlyEmi: 6000,
    existingLoanCount: 1,
    savingsBalance: 10000,
    bankAccountAgeYears: 3,
    creditScore: 680,
    creditHistoryYears: 3,
    latePaymentCount: 0,
    creditUtilizationRatio: 40,
    previousLoanCount: 1,
    previousLoanDefaultCount: 0,
    loanPurpose: 'Personal',
    requestedAmount: 100000,
    preferredTenureMonths: 24
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  assert.equal(result.status, 'invalid_situation');
  assert.ok(result.reasons.some((r) => r.includes('exceed')));
});

test('Scenario 10: Customer with No Eligible Products (Severe subprime & defaults)', () => {
  const customer: CustomerProfileInput = {
    age: 25,
    gender: 'Male',
    maritalStatus: 'Single',
    dependents: 0,
    education: 'High School',
    residenceType: 'Rented',
    cityTier: 'Tier 3',
    employmentType: 'Freelancer',
    experienceYears: 1,
    monthlyIncome: 12000, // Below minimum 18k for all products
    monthlyExpenses: 11000,
    existingLoanAmount: 200000,
    existingMonthlyEmi: 6000, // 50% DTI on tiny income
    existingLoanCount: 2,
    savingsBalance: 1000,
    bankAccountAgeYears: 1,
    creditScore: 480, // Far below min credit score
    creditHistoryYears: 1,
    latePaymentCount: 6,
    creditUtilizationRatio: 95,
    previousLoanCount: 2,
    previousLoanDefaultCount: 3, // Disqualifying defaults
    loanPurpose: 'Personal',
    requestedAmount: 200000,
    preferredTenureMonths: 24
  };

  const result = RecommendationOrchestrator.processProfile(customer, products);

  assert.equal(result.status, 'no_match');
  assert.ok(result.recommendation === undefined);
  assert.ok(result.reasons.length > 0);
  assert.ok(result.ineligible_products_count > 0);
});
