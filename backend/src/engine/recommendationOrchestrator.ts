import {
  CustomerProfileInput,
  LoanProduct,
  RecommendationResponse,
  FinancialSummary
} from '../types/index.js';
import {
  calculateExistingDti,
  calculateDisposableIncome
} from '../calculations/financialCalculations.js';
import { EligibilityEngine } from './eligibilityEngine.js';
import { RiskScoringEngine } from './riskScoringEngine.js';
import { AffordabilityEngine } from './affordabilityEngine.js';
import { RecommendationRankingEngine } from './recommendationRankingEngine.js';
import { ExplanationEngine } from './explanationEngine.js';

export class RecommendationOrchestrator {
  public static processProfile(
    customer: CustomerProfileInput,
    products: LoanProduct[]
  ): RecommendationResponse {
    const existingDti = calculateExistingDti(customer.monthlyIncome, customer.existingMonthlyEmi);
    const disposableIncome = calculateDisposableIncome(
      customer.monthlyIncome,
      customer.monthlyExpenses,
      customer.existingMonthlyEmi
    );

    const isConstrained = disposableIncome <= 0 || customer.monthlyExpenses >= customer.monthlyIncome;
    const savingsRatio = customer.monthlyIncome > 0 ? customer.savingsBalance / customer.monthlyIncome : 0;

    const financialSummary: FinancialSummary = {
      monthly_income: customer.monthlyIncome,
      monthly_expenses: customer.monthlyExpenses,
      existing_emi: customer.existingMonthlyEmi,
      disposable_income: disposableIncome,
      existing_dti: existingDti,
      savings_to_income_ratio: Math.round(savingsRatio * 100) / 100,
      is_financially_constrained: isConstrained,
      constraint_reason: isConstrained
        ? 'Monthly expenses plus existing loan payments equal or exceed declared monthly income.'
        : undefined
    };

    // Edge case check: Invalid financial situation (expenses > income)
    if (customer.monthlyExpenses > customer.monthlyIncome) {
      return {
        status: 'invalid_situation',
        financial_summary: financialSummary,
        risk: {
          score: 15,
          category: 'Very High',
          summary: 'Applicant monthly expenses exceed declared monthly income.'
        },
        affordability: {
          score: 5,
          category: 'Unaffordable',
          maximum_new_emi: 0,
          max_affordable_loan: 0
        },
        reasons: [
          'Declared monthly living expenses (₹' +
            customer.monthlyExpenses.toLocaleString('en-IN') +
            ') exceed your monthly earnings (₹' +
            customer.monthlyIncome.toLocaleString('en-IN') +
            ').',
          'Responsible lending guidelines require positive net disposable cash flow before considering new debt obligations.',
          'Please verify and adjust your income or expense figures to proceed.'
        ],
        alternatives: [],
        ineligible_products_count: products.length,
        timestamp: new Date().toISOString()
      };
    }

    // 1. Risk Evaluation
    const risk = RiskScoringEngine.evaluateRisk(customer);

    // 2. Affordability Evaluation
    const affordability = AffordabilityEngine.evaluateAffordability(customer);

    // 3. Eligibility Filtering
    const { eligible, evaluations } = EligibilityEngine.evaluateAll(customer, products);

    // Compile ineligible breakdown
    const ineligibleReasonsSummary: Record<string, string[]> = {};
    for (const [prodId, evalResult] of Object.entries(evaluations)) {
      if (!evalResult.isEligible) {
        ineligibleReasonsSummary[evalResult.productName] = evalResult.failedHardRules;
      }
    }

    // Edge case: No eligible products found
    if (eligible.length === 0) {
      const mainReasons: string[] = [];

      if (affordability.maximum_new_emi <= 0) {
        mainReasons.push(
          'Your current existing debt obligations or living expenses leave no disposable headroom for an additional loan EMI.'
        );
      }

      if (customer.creditScore < 580) {
        mainReasons.push(
          `Your credit score (${customer.creditScore}) falls below the minimum entry threshold of all available loan products.`
        );
      }

      if (customer.monthlyIncome < 18000) {
        mainReasons.push(
          `Your monthly income (₹${customer.monthlyIncome.toLocaleString('en-IN')}) is below the minimum entry requirement (₹18,000) for all loan products.`
        );
      }

      if (customer.previousLoanDefaultCount > 2) {
        mainReasons.push(
          `Multiple past loan defaults (${customer.previousLoanDefaultCount}) disqualify this profile based on risk underwriting policies.`
        );
      }

      if (mainReasons.length === 0) {
        mainReasons.push(
          'None of the available loan products currently match the specific combination of loan purpose, employment type, or tenure requested.'
        );
      }

      return {
        status: 'no_match',
        financial_summary: financialSummary,
        risk: {
          score: risk.score,
          category: risk.category,
          summary: `Financial risk evaluated as ${risk.category} based on credit, stability, and debt profile.`
        },
        affordability: {
          score: affordability.score,
          category: affordability.category,
          maximum_new_emi: affordability.maximum_new_emi,
          max_affordable_loan: affordability.max_affordable_loan_amount
        },
        reasons: mainReasons,
        cautionary_notes: [
          'Improving your credit score above 650 or reducing existing debts can unlock product eligibility.',
          'Consider reviewing discretionary monthly expenses to create borrowing headroom.'
        ],
        alternatives: [],
        ineligible_products_count: products.length,
        ineligible_reasons_summary: ineligibleReasonsSummary,
        timestamp: new Date().toISOString()
      };
    }

    // 4. Score and Rank Eligible Products
    const rankedItems = RecommendationRankingEngine.rankEligibleProducts(
      customer,
      eligible,
      risk,
      affordability
    );

    if (rankedItems.length === 0) {
      return {
        status: 'no_match',
        financial_summary: financialSummary,
        risk: {
          score: risk.score,
          category: risk.category,
          summary: `Financial risk evaluated as ${risk.category}.`
        },
        affordability: {
          score: affordability.score,
          category: affordability.category,
          maximum_new_emi: affordability.maximum_new_emi,
          max_affordable_loan: affordability.max_affordable_loan_amount
        },
        reasons: [
          'While you meet preliminary criteria, your maximum safe EMI cannot sustain the minimum loan size for the eligible products.'
        ],
        alternatives: [],
        ineligible_products_count: products.length,
        ineligible_reasons_summary: ineligibleReasonsSummary,
        timestamp: new Date().toISOString()
      };
    }

    const topItem = rankedItems[0];
    const alternativeItems = rankedItems.slice(1, 4); // top 3 alternatives

    // 5. Generate Explanations
    const explanationData = ExplanationEngine.generateExplanations(
      customer,
      topItem,
      rankedItems,
      risk,
      affordability
    );

    return {
      status: 'success',
      financial_summary: financialSummary,
      risk: {
        score: risk.score,
        category: risk.category,
        summary: `Financial risk evaluated as ${risk.category} Risk (${risk.score}/100)`
      },
      affordability: {
        score: affordability.score,
        category: affordability.category,
        maximum_new_emi: affordability.maximum_new_emi,
        max_affordable_loan: affordability.max_affordable_loan_amount
      },
      recommendation: {
        product_id: topItem.product.id,
        product_name: topItem.product.product_name,
        lender_name: topItem.product.lender_name,
        loan_type: topItem.product.loan_type,
        description: topItem.product.description,
        amount: topItem.recommended_amount,
        interest_rate: topItem.interest_rate,
        tenure_months: topItem.tenure_months,
        emi: topItem.emi,
        total_interest: topItem.total_interest,
        total_payment: topItem.total_payment,
        processing_fee_amount: topItem.processing_fee_amount,
        proposed_dti: topItem.proposed_dti,
        recommendation_score: topItem.recommendation_score
      },
      reasons: explanationData.combinedHighlights,
      cautionary_notes: explanationData.cautionaryNotes,
      alternatives: alternativeItems.map((alt) => ({
        product_id: alt.product.id,
        product_name: alt.product.product_name,
        lender_name: alt.product.lender_name,
        loan_type: alt.product.loan_type,
        description: alt.product.description,
        amount: alt.recommended_amount,
        interest_rate: alt.interest_rate,
        tenure_months: alt.tenure_months,
        emi: alt.emi,
        total_interest: alt.total_interest,
        total_payment: alt.total_payment,
        proposed_dti: alt.proposed_dti,
        recommendation_score: alt.recommendation_score,
        key_reason: alt.reasons[0] || 'Viable alternative loan option'
      })),
      ineligible_products_count: products.length - eligible.length,
      ineligible_reasons_summary: ineligibleReasonsSummary,
      timestamp: new Date().toISOString()
    };
  }
}
