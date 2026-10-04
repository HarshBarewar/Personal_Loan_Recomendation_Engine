import { CustomerProfileInput, RiskEvaluation, RiskCategory } from '../types/index.js';
import { calculateExistingDti, calculateDisposableIncome } from '../calculations/financialCalculations.js';

export class RiskScoringEngine {
  /**
   * Transparent Rule-Based Financial Risk Indicator (0-100)
   * Credit Score (40 pts) + DTI (20 pts) + Employment (15 pts) + Payment History (15 pts) + Affordability/Savings (10 pts)
   */
  public static evaluateRisk(customer: CustomerProfileInput): RiskEvaluation {
    const details: string[] = [];

    // 1. Credit Score Component (Max 40 points)
    let creditScorePoints = 0;
    const cs = customer.creditScore;
    if (cs >= 780) {
      creditScorePoints = 40;
      details.push(`Credit score of ${cs} is outstanding (40/40 pts).`);
    } else if (cs >= 740) {
      creditScorePoints = 35;
      details.push(`Credit score of ${cs} is strong (35/40 pts).`);
    } else if (cs >= 700) {
      creditScorePoints = 30;
      details.push(`Credit score of ${cs} is good (30/40 pts).`);
    } else if (cs >= 650) {
      creditScorePoints = 22;
      details.push(`Credit score of ${cs} is fair (22/40 pts).`);
    } else if (cs >= 600) {
      creditScorePoints = 14;
      details.push(`Credit score of ${cs} is moderate (14/40 pts).`);
    } else {
      creditScorePoints = 5;
      details.push(`Credit score of ${cs} reflects higher credit risk (5/40 pts).`);
    }

    // 2. Debt-to-Income (DTI) Component (Max 20 points)
    const existingDti = calculateExistingDti(customer.monthlyIncome, customer.existingMonthlyEmi);
    let dtiPoints = 0;
    if (existingDti <= 15) {
      dtiPoints = 20;
      details.push(`Existing DTI of ${existingDti.toFixed(1)}% is very low, showing ample debt capacity (20/20 pts).`);
    } else if (existingDti <= 30) {
      dtiPoints = 16;
      details.push(`Existing DTI of ${existingDti.toFixed(1)}% is healthy (16/20 pts).`);
    } else if (existingDti <= 40) {
      dtiPoints = 12;
      details.push(`Existing DTI of ${existingDti.toFixed(1)}% is moderate (12/20 pts).`);
    } else if (existingDti <= 50) {
      dtiPoints = 7;
      details.push(`Existing DTI of ${existingDti.toFixed(1)}% is elevated (7/20 pts).`);
    } else {
      dtiPoints = 2;
      details.push(`Existing DTI of ${existingDti.toFixed(1)}% is high, significantly constraining cash flow (2/20 pts).`);
    }

    // 3. Employment Stability Component (Max 15 points)
    let empPoints = 0;
    const exp = customer.experienceYears;
    const empType = customer.employmentType;

    // Base experience points (up to 10 pts)
    if (exp >= 5) {
      empPoints += 10;
    } else if (exp >= 3) {
      empPoints += 8;
    } else if (exp >= 1) {
      empPoints += 5;
    } else {
      empPoints += 2;
    }

    // Type stability bonus (up to 5 pts)
    if (empType === 'Government Employee') {
      empPoints += 5;
      details.push(`Government employment with ${exp} yrs experience offers high income stability (15/15 pts).`);
    } else if (empType === 'Salaried') {
      empPoints += 4;
      details.push(`Salaried employment with ${exp} yrs experience demonstrates solid stability (${empPoints}/15 pts).`);
    } else if (empType === 'Business Owner') {
      empPoints += 3;
      details.push(`Business ownership with ${exp} yrs operational track (${empPoints}/15 pts).`);
    } else if (empType === 'Self-Employed') {
      empPoints += 2;
      details.push(`Self-employed professional with ${exp} yrs experience (${empPoints}/15 pts).`);
    } else {
      empPoints += 1;
      details.push(`Freelancing career with ${exp} yrs track record (${empPoints}/15 pts).`);
    }
    empPoints = Math.min(15, empPoints);

    // 4. Payment History & Credit Utilization Component (Max 15 points)
    let paymentHistoryPoints = 15;
    // Penalty for late payments: -3 per late payment
    paymentHistoryPoints -= Math.min(9, customer.latePaymentCount * 3);
    // Severe penalty for past defaults: -7 per default
    paymentHistoryPoints -= Math.min(10, customer.previousLoanDefaultCount * 7);
    // Credit utilization penalty if > 50%: -2 to -4 pts
    if (customer.creditUtilizationRatio > 70) {
      paymentHistoryPoints -= 3;
    } else if (customer.creditUtilizationRatio > 50) {
      paymentHistoryPoints -= 1;
    }
    paymentHistoryPoints = Math.max(0, paymentHistoryPoints);

    if (customer.latePaymentCount === 0 && customer.previousLoanDefaultCount === 0) {
      details.push(`Impeccable repayment record with 0 late payments or defaults (${paymentHistoryPoints}/15 pts).`);
    } else {
      details.push(
        `Repayment history affected by ${customer.latePaymentCount} late payments and ${customer.previousLoanDefaultCount} past defaults (${paymentHistoryPoints}/15 pts).`
      );
    }

    // 5. Affordability & Savings Cushion Component (Max 10 points)
    let affordabilityPoints = 0;
    const disposable = calculateDisposableIncome(
      customer.monthlyIncome,
      customer.monthlyExpenses,
      customer.existingMonthlyEmi
    );
    const monthsOfExpensesInSavings =
      customer.monthlyExpenses > 0 ? customer.savingsBalance / customer.monthlyExpenses : 0;

    if (disposable > customer.monthlyIncome * 0.4 && monthsOfExpensesInSavings >= 3) {
      affordabilityPoints = 10;
      details.push('High disposable cash flow and robust emergency savings buffer (10/10 pts).');
    } else if (disposable > customer.monthlyIncome * 0.25 && monthsOfExpensesInSavings >= 1) {
      affordabilityPoints = 7;
      details.push('Adequate disposable surplus and healthy savings reserve (7/10 pts).');
    } else if (disposable > 0) {
      affordabilityPoints = 4;
      details.push('Positive disposable cash flow with modest savings buffer (4/10 pts).');
    } else {
      affordabilityPoints = 1;
      details.push('Tight cash flow with minimal savings cushion (1/10 pts).');
    }

    // Total Risk Score
    const totalScore = Math.min(
      100,
      Math.max(0, creditScorePoints + dtiPoints + empPoints + paymentHistoryPoints + affordabilityPoints)
    );

    let category: RiskCategory;
    if (totalScore >= 80) {
      category = 'Low';
    } else if (totalScore >= 60) {
      category = 'Medium';
    } else if (totalScore >= 40) {
      category = 'High';
    } else {
      category = 'Very High';
    }

    return {
      score: totalScore,
      category,
      factors: {
        credit_score_points: creditScorePoints,
        dti_points: dtiPoints,
        employment_stability_points: empPoints,
        payment_history_points: paymentHistoryPoints,
        affordability_points: affordabilityPoints
      },
      details
    };
  }
}
