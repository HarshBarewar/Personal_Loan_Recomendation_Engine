import { CustomerProfileInput, LoanProduct, EligibilityResult } from '../types/index.js';
import { calculateExistingDti } from '../calculations/financialCalculations.js';

export class EligibilityEngine {
  /**
   * Evaluates a loan product against applicant's profile using transparent hard rules.
   */
  public static evaluateProduct(
    customer: CustomerProfileInput,
    product: LoanProduct
  ): EligibilityResult {
    const failedHardRules: string[] = [];
    const passedRules: string[] = [];

    // Rule 1: Age Range
    if (customer.age < product.min_age) {
      failedHardRules.push(
        `Age (${customer.age} yrs) is below minimum required age (${product.min_age} yrs).`
      );
    } else if (customer.age > product.max_age) {
      failedHardRules.push(
        `Age (${customer.age} yrs) exceeds maximum allowed age (${product.max_age} yrs).`
      );
    } else {
      passedRules.push(`Applicant age (${customer.age}) satisfies criteria (${product.min_age}–${product.max_age} yrs).`);
    }

    // Rule 2: Minimum Monthly Income
    if (customer.monthlyIncome < product.min_monthly_income) {
      failedHardRules.push(
        `Monthly income (₹${customer.monthlyIncome.toLocaleString('en-IN')}) is below minimum requirement of ₹${product.min_monthly_income.toLocaleString('en-IN')}.`
      );
    } else {
      passedRules.push(
        `Monthly income meets or exceeds threshold of ₹${product.min_monthly_income.toLocaleString('en-IN')}.`
      );
    }

    // Rule 3: Minimum Credit Score
    if (customer.creditScore < product.min_credit_score) {
      failedHardRules.push(
        `Credit score (${customer.creditScore}) is below minimum required score of ${product.min_credit_score}.`
      );
    } else {
      passedRules.push(
        `Credit score (${customer.creditScore}) satisfies minimum threshold (${product.min_credit_score}).`
      );
    }

    // Rule 4: Employment Type Suitability
    let allowedEmployment: string[] = [];
    try {
      allowedEmployment = Array.isArray(product.allowed_employment_types)
        ? product.allowed_employment_types
        : JSON.parse(product.allowed_employment_types as unknown as string);
    } catch {
      allowedEmployment = ['Salaried'];
    }

    if (!allowedEmployment.includes(customer.employmentType)) {
      failedHardRules.push(
        `Employment type '${customer.employmentType}' is not supported by this product (requires: ${allowedEmployment.join(', ')}).`
      );
    } else {
      passedRules.push(`Employment type '${customer.employmentType}' is supported.`);
    }

    // Rule 5: Loan Purpose Suitability
    let allowedPurposes: string[] = [];
    try {
      allowedPurposes = Array.isArray(product.allowed_purposes)
        ? product.allowed_purposes
        : JSON.parse(product.allowed_purposes as unknown as string);
    } catch {
      allowedPurposes = ['Personal'];
    }

    if (!allowedPurposes.includes(customer.loanPurpose)) {
      failedHardRules.push(
        `Loan purpose '${customer.loanPurpose}' is not covered by this product (eligible purposes: ${allowedPurposes.join(', ')}).`
      );
    } else {
      passedRules.push(`Loan purpose '${customer.loanPurpose}' is eligible.`);
    }

    // Rule 6: Existing DTI Ceiling (Relaxed for debt consolidation products when purpose is Debt Consolidation)
    const existingDti = calculateExistingDti(customer.monthlyIncome, customer.existingMonthlyEmi);
    const isDebtConsolidationMatch =
      product.loan_type === 'Debt Consolidation Loan' &&
      customer.loanPurpose === 'Debt Consolidation';

    if (!isDebtConsolidationMatch && existingDti > product.max_dti) {
      failedHardRules.push(
        `Existing DTI ratio (${existingDti.toFixed(1)}%) exceeds product ceiling of ${product.max_dti}%.`
      );
    } else {
      passedRules.push(`Existing DTI (${existingDti.toFixed(1)}%) is acceptable for this product.`);
    }

    // Rule 7: Serious Default History (Tiered by product risk tolerance)
    if (customer.previousLoanDefaultCount > 0) {
      // Prime and low-interest products disallow any past defaults
      if (product.id === 'prod_low_interest' || product.id === 'prod_premium') {
        failedHardRules.push(
          `Product requires spotless credit record; past defaults (${customer.previousLoanDefaultCount}) are not permitted.`
        );
      } else if (customer.previousLoanDefaultCount > 2) {
        // High defaults disallow all products
        failedHardRules.push(
          `Past default count (${customer.previousLoanDefaultCount}) exceeds policy limit.`
        );
      }
    }

    // Rule 8: Late payment tolerance
    if (customer.latePaymentCount > 4 && (product.id === 'prod_low_interest' || product.id === 'prod_premium')) {
      failedHardRules.push(
        `Late payment history (${customer.latePaymentCount} incidents) exceeds tolerance for prime products.`
      );
    }

    return {
      productId: product.id,
      productName: product.product_name,
      isEligible: failedHardRules.length === 0,
      failedHardRules,
      passedRules
    };
  }

  /**
   * Filter and return all eligible products with detailed audit trail
   */
  public static evaluateAll(
    customer: CustomerProfileInput,
    products: LoanProduct[]
  ): {
    eligible: LoanProduct[];
    evaluations: Record<string, EligibilityResult>;
  } {
    const eligible: LoanProduct[] = [];
    const evaluations: Record<string, EligibilityResult> = {};

    for (const product of products) {
      if (!product.active) continue;
      const res = this.evaluateProduct(customer, product);
      evaluations[product.id] = res;
      if (res.isEligible) {
        eligible.push(product);
      }
    }

    return { eligible, evaluations };
  }
}
