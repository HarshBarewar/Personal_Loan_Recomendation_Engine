import { CustomerProfileInput, LoanProduct, RiskEvaluation } from '../types/index.js';
import {
  calculateEmi,
  calculateMaxLoanAmountFromEmi,
  calculateTotalInterest
} from '../calculations/financialCalculations.js';

export class RateAndTenureEngine {
  /**
   * Determines the personalized interest rate within the product's defined band,
   * factoring in applicant's risk category and credit score fine-tuning.
   */
  public static calculatePersonalizedRate(
    product: LoanProduct,
    risk: RiskEvaluation,
    creditScore: number
  ): number {
    const minRate = product.min_interest_rate;
    const maxRate = product.max_interest_rate;
    const baseRate = product.base_interest_rate;
    const bandSpan = maxRate - minRate;

    let targetRate = baseRate;

    // 1. Risk Tier Positioning
    switch (risk.category) {
      case 'Low':
        // Lower quartile of band
        targetRate = minRate + bandSpan * 0.20;
        break;
      case 'Medium':
        // Midpoint/Base rate
        targetRate = baseRate;
        break;
      case 'High':
        // Upper quartile of band
        targetRate = baseRate + (maxRate - baseRate) * 0.60;
        break;
      case 'Very High':
        targetRate = maxRate;
        break;
    }

    // 2. Credit Score Fine-Tuning
    if (creditScore >= 780) {
      targetRate -= 0.50; // 50 bps prime discount
    } else if (creditScore >= 740) {
      targetRate -= 0.25; // 25 bps good credit discount
    } else if (creditScore < 640) {
      targetRate += 0.50; // 50 bps subprime surcharge
    }

    // 3. Clamping within strict product limits
    const clampedRate = Math.min(maxRate, Math.max(minRate, targetRate));
    return Math.round(clampedRate * 100) / 100;
  }

  /**
   * Determines recommended loan tenure:
   * Balances applicant preference, monthly EMI affordability, and total interest minimization.
   */
  public static optimizeTenure(
    product: LoanProduct,
    customer: CustomerProfileInput,
    principal: number,
    annualRate: number,
    maxNewEmi: number
  ): {
    recommendedTenure: number;
    tenureAdjustmentReason?: string;
    tradeoffs: {
      shorterOption?: { tenure: number; emi: number; totalInterest: number };
      longerOption?: { tenure: number; emi: number; totalInterest: number };
    };
  } {
    const validTenures = [12, 18, 24, 36, 48, 60, 72, 84].filter(
      (t) => t >= product.min_tenure_months && t <= product.max_tenure_months
    );

    let preferred = customer.preferredTenureMonths;
    // Clamp preferred within product range
    preferred = Math.min(product.max_tenure_months, Math.max(product.min_tenure_months, preferred));

    // Find nearest supported tenure
    let selectedTenure = validTenures.reduce((prev, curr) =>
      Math.abs(curr - preferred) < Math.abs(prev - preferred) ? curr : prev
    );

    let currentEmi = calculateEmi(principal, annualRate, selectedTenure);
    let tenureAdjustmentReason: string | undefined;

    // If EMI exceeds affordable ceiling at preferred tenure, search longer supported tenures
    if (currentEmi > maxNewEmi) {
      const longerOptions = validTenures.filter((t) => t > selectedTenure);
      let foundViable = false;

      for (const t of longerOptions) {
        const testEmi = calculateEmi(principal, annualRate, t);
        if (testEmi <= maxNewEmi) {
          selectedTenure = t;
          foundViable = true;
          tenureAdjustmentReason = `Tenure extended from ${customer.preferredTenureMonths} to ${selectedTenure} months to keep monthly EMI comfortably within your affordable ceiling.`;
          break;
        }
      }

      if (!foundViable && longerOptions.length > 0) {
        // Use max available tenure
        selectedTenure = validTenures[validTenures.length - 1];
        tenureAdjustmentReason = `Maximum available tenure of ${selectedTenure} months selected to minimize monthly EMI obligation.`;
      }
    } else {
      // Preferred tenure is affordable.
      // Check if applicant has ample headroom to shorten tenure and save substantial total interest
      if (currentEmi <= maxNewEmi * 0.60 && selectedTenure > 24) {
        const shorterCandidates = validTenures.filter((t) => t < selectedTenure);
        if (shorterCandidates.length > 0) {
          const nextShorter = shorterCandidates[shorterCandidates.length - 1];
          const shorterEmi = calculateEmi(principal, annualRate, nextShorter);
          if (shorterEmi <= maxNewEmi * 0.75) {
            // Suggest shorter as alternative tradeoff
            // But keep customer's preferred unless requested
          }
        }
      }
    }

    // Build tradeoff options
    const shorterT = validTenures.filter((t) => t < selectedTenure).pop();
    const longerT = validTenures.filter((t) => t > selectedTenure).shift();

    const tradeoffs: {
      shorterOption?: { tenure: number; emi: number; totalInterest: number };
      longerOption?: { tenure: number; emi: number; totalInterest: number };
    } = {};

    if (shorterT) {
      const emiShort = calculateEmi(principal, annualRate, shorterT);
      tradeoffs.shorterOption = {
        tenure: shorterT,
        emi: emiShort,
        totalInterest: calculateTotalInterest(principal, emiShort, shorterT)
      };
    }

    if (longerT) {
      const emiLong = calculateEmi(principal, annualRate, longerT);
      tradeoffs.longerOption = {
        tenure: longerT,
        emi: emiLong,
        totalInterest: calculateTotalInterest(principal, emiLong, longerT)
      };
    }

    return {
      recommendedTenure: selectedTenure,
      tenureAdjustmentReason,
      tradeoffs
    };
  }

  /**
   * Determines the recommended loan amount:
   * recommended_amount = min(product_max, requested_amount, affordable_amount, risk_adjusted_amount)
   */
  public static calculateRecommendedAmount(
    product: LoanProduct,
    customer: CustomerProfileInput,
    maxNewEmi: number,
    annualRate: number,
    tenureMonths: number,
    risk: RiskEvaluation
  ): {
    recommendedAmount: number;
    adjustmentReason?: string;
    isCapped: boolean;
  } {
    const maxProductAmount = product.max_loan_amount;
    const requestedAmount = customer.requestedAmount;

    // 1. Max affordable loan based on max new EMI
    const maxAffordable = calculateMaxLoanAmountFromEmi(maxNewEmi, annualRate, tenureMonths);

    // 2. Risk-adjusted cap:
    // Low risk: 100% of capacity
    // Medium risk: 90% of capacity
    // High risk: 75% of capacity
    // Very High risk: 50% of capacity
    let riskMultiplier = 1.0;
    if (risk.category === 'Medium') riskMultiplier = 0.90;
    else if (risk.category === 'High') riskMultiplier = 0.75;
    else if (risk.category === 'Very High') riskMultiplier = 0.50;

    const riskAdjustedMax = Math.floor((maxAffordable * riskMultiplier) / 5000) * 5000;

    // Minimum of all valid limits
    let finalAmount = Math.min(maxProductAmount, requestedAmount, maxAffordable, riskAdjustedMax);

    // Round to nearest 5,000 INR
    finalAmount = Math.max(0, Math.floor(finalAmount / 5000) * 5000);

    // If final amount is below product minimum, applicant cannot take this product at this low amount
    if (finalAmount < product.min_loan_amount) {
      return {
        recommendedAmount: 0,
        adjustmentReason: `Calculated maximum affordable amount (₹${finalAmount.toLocaleString('en-IN')}) is below the product's minimum loan threshold of ₹${product.min_loan_amount.toLocaleString('en-IN')}.`,
        isCapped: true
      };
    }

    let isCapped = false;
    let adjustmentReason: string | undefined;

    if (finalAmount < requestedAmount) {
      isCapped = true;
      if (finalAmount === maxProductAmount) {
        adjustmentReason = `Requested loan amount (₹${requestedAmount.toLocaleString('en-IN')}) exceeds the product's maximum loan cap of ₹${maxProductAmount.toLocaleString('en-IN')}.`;
      } else if (finalAmount === maxAffordable || finalAmount === riskAdjustedMax) {
        adjustmentReason = `Your requested amount (₹${requestedAmount.toLocaleString('en-IN')}) is above the amount estimated to fit within your current monthly cash-flow and debt-service capacity. Recommended amount is adjusted to ₹${finalAmount.toLocaleString('en-IN')}.`;
      }
    }

    return {
      recommendedAmount: finalAmount,
      adjustmentReason,
      isCapped
    };
  }
}
