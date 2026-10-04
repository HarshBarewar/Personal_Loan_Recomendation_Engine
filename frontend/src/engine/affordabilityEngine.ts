import { CustomerProfileInput, AffordabilityEvaluation, AffordabilityCategory } from '../types/index.js';
import {
  calculateAffordableEmi,
  calculateMaxLoanAmountFromEmi,
  calculateExistingDti
} from '../calculations/financialCalculations.js';

export class AffordabilityEngine {
  /**
   * Transparent Rule-Based Affordability Engine (0-100)
   * Evaluates disposable cash headroom, existing debt load, and savings liquidity cushion.
   */
  public static evaluateAffordability(
    customer: CustomerProfileInput,
    assumedInterestRate: number = 12.0,
    assumedTenureMonths: number = 48
  ): AffordabilityEvaluation {
    const details: string[] = [];

    const existingDti = calculateExistingDti(customer.monthlyIncome, customer.existingMonthlyEmi);
    const targetMaxDti = customer.loanPurpose === 'Debt Consolidation' ? 60.0 : 45.0;
    const emiAnalysis = calculateAffordableEmi(
      customer.monthlyIncome,
      customer.monthlyExpenses,
      customer.existingMonthlyEmi,
      targetMaxDti
    );

    const maxAffordableLoan = calculateMaxLoanAmountFromEmi(
      emiAnalysis.maxNewEmi,
      assumedInterestRate,
      assumedTenureMonths
    );

    // Scoring Breakdown:
    // 1. Disposable Income Ratio (Up to 40 pts)
    // disposableIncome / monthlyIncome
    let disposableScore = 0;
    const dispRatio = customer.monthlyIncome > 0 ? emiAnalysis.disposableIncome / customer.monthlyIncome : 0;
    if (dispRatio >= 0.45) {
      disposableScore = 40;
      details.push(`High disposable surplus (${(dispRatio * 100).toFixed(1)}% of income) provides strong cash buffer.`);
    } else if (dispRatio >= 0.30) {
      disposableScore = 32;
      details.push(`Comfortable disposable surplus (${(dispRatio * 100).toFixed(1)}% of income).`);
    } else if (dispRatio >= 0.15) {
      disposableScore = 20;
      details.push(`Moderate disposable surplus (${(dispRatio * 100).toFixed(1)}% of income).`);
    } else if (dispRatio > 0) {
      disposableScore = 10;
      details.push(`Narrow disposable surplus (${(dispRatio * 100).toFixed(1)}% of income), budget is tight.`);
    } else {
      disposableScore = 0;
      details.push('Negative cash flow: monthly living expenses exceed disposable income.');
    }

    // 2. DTI Headroom (Up to 35 pts)
    // How much space exists under 45% DTI
    let dtiScore = 0;
    const dtiHeadroom = Math.max(0, 45.0 - existingDti);
    if (existingDti <= 10) {
      dtiScore = 35;
      details.push(`Minimal existing debt burden (${existingDti.toFixed(1)}% DTI), ample borrowing headroom.`);
    } else if (existingDti <= 25) {
      dtiScore = 28;
      details.push(`Low existing debt burden (${existingDti.toFixed(1)}% DTI).`);
    } else if (existingDti <= 38) {
      dtiScore = 18;
      details.push(`Moderate debt obligations (${existingDti.toFixed(1)}% DTI).`);
    } else if (existingDti <= 45) {
      dtiScore = 8;
      details.push(`Existing debt near prudent ceiling (${existingDti.toFixed(1)}% DTI).`);
    } else {
      dtiScore = 2;
      details.push(`Existing debt already exceeds prudent guidelines (${existingDti.toFixed(1)}% DTI).`);
    }

    // 3. Savings Cushion (Up to 25 pts)
    let savingsScore = 0;
    const monthlyObligations = customer.monthlyExpenses + customer.existingMonthlyEmi;
    const monthsOfCushion = monthlyObligations > 0 ? customer.savingsBalance / monthlyObligations : 0;
    if (monthsOfCushion >= 4) {
      savingsScore = 25;
      details.push(`Substantial emergency reserves (${monthsOfCushion.toFixed(1)} months of expenses saved).`);
    } else if (monthsOfCushion >= 2) {
      savingsScore = 20;
      details.push(`Healthy emergency reserve (${monthsOfCushion.toFixed(1)} months of expenses saved).`);
    } else if (monthsOfCushion >= 1) {
      savingsScore = 14;
      details.push(`Basic emergency buffer (${monthsOfCushion.toFixed(1)} months saved).`);
    } else if (customer.savingsBalance > 0) {
      savingsScore = 8;
      details.push('Limited emergency cash reserve.');
    } else {
      savingsScore = 2;
      details.push('No liquid emergency savings detected.');
    }

    const totalAffordabilityScore = Math.min(100, Math.max(0, disposableScore + dtiScore + savingsScore));

    let category: AffordabilityCategory;
    if (totalAffordabilityScore >= 80) {
      category = 'Highly Affordable';
    } else if (totalAffordabilityScore >= 60) {
      category = 'Affordable';
    } else if (totalAffordabilityScore >= 40) {
      category = 'Borderline';
    } else if (totalAffordabilityScore >= 20) {
      category = 'Difficult';
    } else {
      category = 'Unaffordable';
    }

    return {
      score: totalAffordabilityScore,
      category,
      max_allowable_total_emi: emiAnalysis.maxAllowableTotalEmi,
      maximum_new_emi: emiAnalysis.maxNewEmi,
      max_affordable_loan_amount: maxAffordableLoan,
      factors: {
        disposable_income: emiAnalysis.disposableIncome,
        dti_headroom: Math.round(dtiHeadroom * 100) / 100,
        savings_cushion: Math.round(monthsOfCushion * 10) / 10
      },
      details
    };
  }
}
