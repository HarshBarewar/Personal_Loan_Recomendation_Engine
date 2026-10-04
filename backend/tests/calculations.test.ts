import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEmi,
  calculateTotalInterest,
  calculateExistingDti,
  calculateProposedDti,
  calculateDisposableIncome,
  calculateAffordableEmi,
  calculateMaxLoanAmountFromEmi
} from '../src/calculations/financialCalculations.js';

test('EMI Calculation - standard realistic personal loan', () => {
  // Principal: ₹5,00,000, 12% p.a., 36 months
  // Standard financial calculator EMI: ₹16,607.15
  const emi = calculateEmi(500000, 12, 36);
  assert.equal(Math.round(emi), 16607);
});

test('EMI Calculation - zero interest edge case', () => {
  const emi = calculateEmi(120000, 0, 12);
  assert.equal(emi, 10000);
});

test('EMI Calculation - zero or negative principal edge cases', () => {
  assert.equal(calculateEmi(0, 12, 36), 0);
  assert.equal(calculateEmi(-5000, 12, 36), 0);
  assert.equal(calculateEmi(100000, 12, 0), 0);
});

test('Total Interest Calculation', () => {
  // ₹10,000 EMI for 12 months on ₹1,00,000 loan -> ₹1,20,000 paid -> ₹20,000 interest
  const interest = calculateTotalInterest(100000, 10000, 12);
  assert.equal(interest, 20000);
});

test('DTI Calculation - existing and proposed', () => {
  // Income 1,00,000, existing EMI 20,000 -> 20%
  const existingDti = calculateExistingDti(100000, 20000);
  assert.equal(existingDti, 20);

  // New EMI 15,000 -> total 35,000 -> 35%
  const proposedDti = calculateProposedDti(100000, 20000, 15000);
  assert.equal(proposedDti, 35);
});

test('Disposable Income Calculation', () => {
  // Income 60,000, Expenses 25,000, Existing EMI 8,000 -> 27,000
  const disp = calculateDisposableIncome(60000, 25000, 8000);
  assert.equal(disp, 27000);
});

test('Affordable EMI Calculation - healthy borrower', () => {
  // Income 80,000, expenses 30,000, existing EMI 10,000
  // Max debt service: 45% of 80,000 = 36,000. Less existing 10,000 = 26,000.
  // Disposable = 40,000. 85% of 40,000 = 34,000.
  // Effective max new EMI = min(26000, 34000) = 26,000.
  const res = calculateAffordableEmi(80000, 30000, 10000, 45);
  assert.equal(res.maxNewEmi, 26000);
  assert.equal(res.isFinanciallyConstrained, false);
});

test('Affordable EMI Calculation - financially constrained borrower', () => {
  // Income 30,000, expenses 25,000, existing EMI 5,000 -> disposable = 0
  const res = calculateAffordableEmi(30000, 25000, 5000, 45);
  assert.equal(res.maxNewEmi, 0);
  assert.equal(res.isFinanciallyConstrained, true);
  assert.ok(res.constraintReason);
});

test('Calculate Max Loan Amount from Affordable EMI', () => {
  // If affordable EMI is ₹10,000, rate is 12%, tenure is 36 months
  // P ≈ ₹3,01,000
  const maxPrincipal = calculateMaxLoanAmountFromEmi(10000, 12, 36);
  assert.ok(maxPrincipal > 290000 && maxPrincipal <= 310000);
  // Verify that EMI on this principal is <= affordable EMI
  const testEmi = calculateEmi(maxPrincipal, 12, 36);
  assert.ok(testEmi <= 10000);
});
