import {
  CustomerProfileInput,
  ProductRecommendationItem,
  RiskEvaluation,
  AffordabilityEvaluation
} from '../types/index.js';
import { calculateExistingDti } from '../calculations/financialCalculations.js';

export class ExplanationEngine {
  /**
   * Generates coherent, non-contradictory human-readable explanation bullet points
   * for the top recommended product.
   */
  public static generateExplanations(
    customer: CustomerProfileInput,
    topRecommendation: ProductRecommendationItem,
    allScoredItems: ProductRecommendationItem[],
    risk: RiskEvaluation,
    affordability: AffordabilityEvaluation
  ): {
    positiveReasons: string[];
    cautionaryNotes: string[];
    combinedHighlights: string[];
  } {
    const positiveReasons: string[] = [];
    const cautionaryNotes: string[] = [];

    const existingDti = calculateExistingDti(customer.monthlyIncome, customer.existingMonthlyEmi);

    // 1. Credit Score Evaluation
    if (customer.creditScore >= 750) {
      positiveReasons.push(`Your credit score of ${customer.creditScore} is in the excellent range, qualifying you for prime tier interest rates.`);
    } else if (customer.creditScore >= 700) {
      positiveReasons.push(`Your credit score of ${customer.creditScore} is healthy, supporting broad eligibility across competitive lending products.`);
    } else if (customer.creditScore < 640) {
      cautionaryNotes.push(`A credit score of ${customer.creditScore} increases the risk tier, narrowing the selection of low-interest products.`);
    }

    // 2. Existing Debt & DTI Ratio
    if (existingDti <= 20) {
      positiveReasons.push(`Your existing EMI obligations represent only ${existingDti.toFixed(1)}% of your monthly income, leaving substantial debt capacity.`);
    } else if (existingDti > 45) {
      cautionaryNotes.push(`Your current debt-to-income ratio of ${existingDti.toFixed(1)}% is elevated, which restricts borrowing capacity to prevent overleveraging.`);
    }

    // 3. Loan Amount Fit & Adjustments
    if (topRecommendation.recommended_amount === customer.requestedAmount) {
      positiveReasons.push(`The full requested amount of ₹${customer.requestedAmount.toLocaleString('en-IN')} fits comfortably within your assessed debt-service capacity.`);
    } else if (topRecommendation.recommended_amount < customer.requestedAmount) {
      cautionaryNotes.push(
        `Your requested amount (₹${customer.requestedAmount.toLocaleString('en-IN')}) was adjusted down to ₹${topRecommendation.recommended_amount.toLocaleString('en-IN')} to ensure the monthly EMI remains sustainable alongside your living expenses.`
      );
    }

    // 4. Interest Rate Advantage compared to alternatives
    const otherRates = allScoredItems
      .filter((item) => item.product.id !== topRecommendation.product.id)
      .map((item) => item.interest_rate);

    if (otherRates.length > 0) {
      const minOtherRate = Math.min(...otherRates);
      if (topRecommendation.interest_rate <= minOtherRate) {
        positiveReasons.push(
          `This product provides the lowest personalized interest rate (${topRecommendation.interest_rate.toFixed(2)}% p.a.) among all eligible options.`
        );
      }
    }

    // 5. Tenure & EMI Comfort
    if (topRecommendation.tenure_months > customer.preferredTenureMonths) {
      cautionaryNotes.push(
        `A tenure of ${topRecommendation.tenure_months} months was chosen instead of your preferred ${customer.preferredTenureMonths} months to keep the monthly payment at ₹${Math.round(topRecommendation.emi).toLocaleString('en-IN')}, well within your cash-flow limits.`
      );
    } else {
      const emiBuffer = affordability.maximum_new_emi > 0 ? (topRecommendation.emi / affordability.maximum_new_emi) * 100 : 100;
      if (emiBuffer <= 70) {
        positiveReasons.push(
          `The monthly EMI of ₹${Math.round(topRecommendation.emi).toLocaleString('en-IN')} utilizes only ${emiBuffer.toFixed(0)}% of your safe EMI limit, leaving room for unexpected expenses.`
        );
      }
    }

    // 6. Payment History & Delinquencies
    if (customer.latePaymentCount > 0 || customer.previousLoanDefaultCount > 0) {
      cautionaryNotes.push(
        `Previous late payments (${customer.latePaymentCount}) or default marks influenced risk pricing and restricted some ultra-low rate tiers.`
      );
    } else if (customer.latePaymentCount === 0 && customer.previousLoanDefaultCount === 0 && customer.creditHistoryYears >= 3) {
      positiveReasons.push(`A clean repayment history with zero defaults reinforces your financial stability indicator.`);
    }

    // Compile combined highlights (2 to 5 meaningful points)
    const combinedHighlights: string[] = [];
    if (positiveReasons.length > 0) {
      combinedHighlights.push(positiveReasons[0]);
    }
    if (cautionaryNotes.length > 0) {
      combinedHighlights.push(cautionaryNotes[0]);
    }
    // Add additional points without exceeding 5
    for (const r of positiveReasons.slice(1)) {
      if (combinedHighlights.length < 4) combinedHighlights.push(r);
    }
    for (const c of cautionaryNotes.slice(1)) {
      if (combinedHighlights.length < 5) combinedHighlights.push(c);
    }

    return {
      positiveReasons,
      cautionaryNotes,
      combinedHighlights
    };
  }
}
