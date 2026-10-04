import {
  CustomerProfileInput,
  LoanProduct,
  ProductRecommendationItem,
  RiskEvaluation,
  AffordabilityEvaluation
} from '../types/index.js';
import {
  calculateEmi,
  calculateTotalInterest,
  calculateProposedDti,
  calculateAffordableEmi
} from '../calculations/financialCalculations.js';
import { RateAndTenureEngine } from './rateAndTenureEngine.js';

export interface RankingWeights {
  affordability: number;
  interestRate: number;
  productFit: number;
  amountFit: number;
  tenureFit: number;
}

export const DEFAULT_WEIGHTS: RankingWeights = {
  affordability: 0.30,
  interestRate: 0.25,
  productFit: 0.20,
  amountFit: 0.15,
  tenureFit: 0.10
};

export class RecommendationRankingEngine {
  /**
   * Scores and ranks all eligible loan products transparently.
   */
  public static rankEligibleProducts(
    customer: CustomerProfileInput,
    eligibleProducts: LoanProduct[],
    risk: RiskEvaluation,
    affordability: AffordabilityEvaluation,
    weights: RankingWeights = DEFAULT_WEIGHTS
  ): ProductRecommendationItem[] {
    const scoredItems: ProductRecommendationItem[] = [];

    for (const product of eligibleProducts) {
      // 1. Personalized Interest Rate
      const rate = RateAndTenureEngine.calculatePersonalizedRate(
        product,
        risk,
        customer.creditScore
      );

      // 2. Determine Product-Specific Affordable EMI Capacity based on product.max_dti
      const productEmiCap = calculateAffordableEmi(
        customer.monthlyIncome,
        customer.monthlyExpenses,
        customer.existingMonthlyEmi,
        product.max_dti
      );
      const effectiveProductNewEmi = Math.max(affordability.maximum_new_emi, productEmiCap.maxNewEmi);

      // 3. Optimized Tenure
      const tenureResult = RateAndTenureEngine.optimizeTenure(
        product,
        customer,
        customer.requestedAmount,
        rate,
        effectiveProductNewEmi
      );
      const tenure = tenureResult.recommendedTenure;

      // 4. Recommended Amount
      const amountResult = RateAndTenureEngine.calculateRecommendedAmount(
        product,
        customer,
        effectiveProductNewEmi,
        rate,
        tenure,
        risk
      );

      if (amountResult.recommendedAmount <= 0) {
        // Product cannot provide an eligible amount for this applicant
        continue;
      }

      const amount = amountResult.recommendedAmount;
      const emi = calculateEmi(amount, rate, tenure);
      const totalInterest = calculateTotalInterest(amount, emi, tenure);
      const totalPayment = amount + totalInterest;
      const proposedDti = calculateProposedDti(customer.monthlyIncome, customer.existingMonthlyEmi, emi);

      // Processing Fee calculation
      let processingFeeAmount = 0;
      if (product.processing_fee_type === 'percentage') {
        processingFeeAmount = Math.round((amount * (product.processing_fee / 100)) * 100) / 100;
      } else {
        processingFeeAmount = product.processing_fee;
      }

      // 4. Sub-scores calculation (Normalized 0 - 100)
      // A. Affordability Fit Score
      let affordabilitySubScore = 100;
      if (effectiveProductNewEmi > 0) {
        const emiUsageRatio = emi / effectiveProductNewEmi;
        if (emiUsageRatio <= 0.70) {
          affordabilitySubScore = 100;
        } else if (emiUsageRatio <= 1.0) {
          affordabilitySubScore = Math.max(60, 100 - (emiUsageRatio - 0.70) * 133);
        } else {
          affordabilitySubScore = Math.max(10, 60 - (emiUsageRatio - 1.0) * 100);
        }
      } else {
        affordabilitySubScore = 20;
      }

      // B. Interest Rate Advantage Score (9.5% -> 100 pts, 20% -> 0 pts)
      const benchmarkMin = 9.5;
      const benchmarkMax = 20.0;
      const rateSubScore = Math.min(
        100,
        Math.max(0, ((benchmarkMax - rate) / (benchmarkMax - benchmarkMin)) * 100)
      );

      // C. Product and Purpose Fit Score
      let productFitScore = 75; // Standard baseline for general match
      const pType = product.loan_type;
      const purpose = customer.loanPurpose;

      if (
        (purpose === 'Debt Consolidation' && pType === 'Debt Consolidation Loan') ||
        (purpose === 'Education' && pType === 'Education Support Loan') ||
        (purpose === 'Home Renovation' && pType === 'Home Improvement Loan') ||
        ((purpose === 'Emergency' || purpose === 'Medical') && pType === 'Emergency Personal Loan') ||
        (purpose === 'Business' && pType === 'Business Personal Loan')
      ) {
        productFitScore = 100; // Perfect specialized purpose fit
      } else if (customer.creditScore >= 740 && customer.monthlyIncome >= 50000) {
        if (pType === 'Low Interest Personal Loan' || pType === 'Premium Personal Loan') {
          productFitScore = 95; // Premium customer matching premium/low-rate product
        }
      } else if (pType === 'Flexible Personal Loan' && (customer.creditScore < 660 || customer.employmentType === 'Freelancer')) {
        productFitScore = 90; // Flexible product matching specialized profile
      }

      // D. Loan Amount Fit Score
      const amountFitScore = Math.min(100, Math.max(0, (amount / customer.requestedAmount) * 100));

      // E. Tenure Fit Score
      const tenureDeviation = Math.abs(tenure - customer.preferredTenureMonths);
      const tenureFitScore = Math.min(
        100,
        Math.max(0, 100 - (tenureDeviation / customer.preferredTenureMonths) * 75)
      );

      // Composite Weighted Recommendation Score
      const compositeScore =
        weights.affordability * affordabilitySubScore +
        weights.interestRate * rateSubScore +
        weights.productFit * productFitScore +
        weights.amountFit * amountFitScore +
        weights.tenureFit * tenureFitScore;

      // Build product-specific reasons
      const reasons: string[] = [];
      if (rateSubScore >= 75) {
        reasons.push(`Offers an attractive interest rate of ${rate.toFixed(2)}% p.a., below average market rates.`);
      }
      if (productFitScore >= 90) {
        reasons.push(`Direct alignment with your stated purpose (${purpose}) and profile.`);
      }
      if (amount === customer.requestedAmount) {
        reasons.push(`Fully covers your requested funding amount of ₹${amount.toLocaleString('en-IN')}.`);
      } else {
        reasons.push(`Prudently sized at ₹${amount.toLocaleString('en-IN')} to safeguard monthly disposable cash flow.`);
      }
      if (emi <= affordability.maximum_new_emi * 0.75) {
        reasons.push(`Estimated EMI of ₹${Math.round(emi).toLocaleString('en-IN')} is comfortably within your affordability ceiling.`);
      }

      scoredItems.push({
        product,
        recommended_amount: amount,
        interest_rate: rate,
        tenure_months: tenure,
        emi: Math.round(emi * 100) / 100,
        total_interest: Math.round(totalInterest * 100) / 100,
        total_payment: Math.round(totalPayment * 100) / 100,
        processing_fee_amount: processingFeeAmount,
        proposed_dti: Math.round(proposedDti * 100) / 100,
        recommendation_score: Math.round(compositeScore * 10) / 10,
        sub_scores: {
          affordability_score: Math.round(affordabilitySubScore),
          interest_rate_score: Math.round(rateSubScore),
          product_fit_score: Math.round(productFitScore),
          amount_fit_score: Math.round(amountFitScore),
          tenure_fit_score: Math.round(tenureFitScore)
        },
        reasons
      });
    }

    // Sort descending by recommendation_score
    scoredItems.sort((a, b) => b.recommendation_score - a.recommendation_score);

    return scoredItems;
  }
}
