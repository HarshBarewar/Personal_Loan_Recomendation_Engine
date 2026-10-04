/**
 * Core Financial Calculations
 * Fully transparent, mathematically precise, zero ML.
 */

/**
 * Calculates Monthly EMI using standard amortization formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 *
 * @param principal Loan principal amount (INR)
 * @param annualInterestRate Annual interest rate in percentage (e.g. 11.5)
 * @param tenureMonths Loan tenure in months
 * @returns Monthly EMI rounded to 2 decimal places (or integer for display)
 */
export function calculateEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) {
    return 0;
  }

  // Handle zero-interest edge case
  if (annualInterestRate <= 0) {
    return Math.round((principal / tenureMonths) * 100) / 100;
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);

  if (factor === 1 || !isFinite(factor)) {
    return Math.round((principal / tenureMonths) * 100) / 100;
  }

  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi * 100) / 100;
}

/**
 * Calculates Total Interest payable over the tenure:
 * Total Interest = (EMI * tenure) - Principal
 */
export function calculateTotalInterest(
  principal: number,
  emi: number,
  tenureMonths: number
): number {
  if (principal <= 0 || emi <= 0 || tenureMonths <= 0) {
    return 0;
  }
  const totalPaid = emi * tenureMonths;
  const interest = Math.max(0, totalPaid - principal);
  return Math.round(interest * 100) / 100;
}

/**
 * Calculates Existing Debt-to-Income (DTI) ratio percentage:
 * DTI = (Existing Monthly EMI / Monthly Income) * 100
 */
export function calculateExistingDti(
  monthlyIncome: number,
  existingMonthlyEmi: number
): number {
  if (monthlyIncome <= 0) {
    return 100;
  }
  const dti = (existingMonthlyEmi / monthlyIncome) * 100;
  return Math.round(dti * 100) / 100;
}

/**
 * Calculates Proposed Debt-to-Income (DTI) ratio percentage:
 * Proposed DTI = ((Existing Monthly EMI + Proposed EMI) / Monthly Income) * 100
 */
export function calculateProposedDti(
  monthlyIncome: number,
  existingMonthlyEmi: number,
  proposedEmi: number
): number {
  if (monthlyIncome <= 0) {
    return 100;
  }
  const totalEmi = existingMonthlyEmi + proposedEmi;
  const dti = (totalEmi / monthlyIncome) * 100;
  return Math.round(dti * 100) / 100;
}

/**
 * Calculates Disposable Income:
 * Disposable = Monthly Income - Monthly Expenses - Existing Monthly EMI
 */
export function calculateDisposableIncome(
  monthlyIncome: number,
  monthlyExpenses: number,
  existingMonthlyEmi: number
): number {
  const disposable = monthlyIncome - monthlyExpenses - existingMonthlyEmi;
  return Math.round(disposable * 100) / 100;
}

/**
 * Calculates Maximum Affordable New EMI based on max debt-service ceiling and disposable income buffer:
 * Max Total EMI = Monthly Income * maxDtiPercentage
 * Max New EMI = max(0, Max Total EMI - existingMonthlyEmi)
 *
 * It is also bounded by disposable income minus an emergency living buffer (default 15%).
 */
export function calculateAffordableEmi(
  monthlyIncome: number,
  monthlyExpenses: number,
  existingMonthlyEmi: number,
  maxDtiPercentage: number = 45 // 45% standard prudent limit
): {
  maxAllowableTotalEmi: number;
  maxNewEmi: number;
  disposableIncome: number;
  isFinanciallyConstrained: boolean;
  constraintReason?: string;
} {
  const maxAllowableTotalEmi = Math.round((monthlyIncome * (maxDtiPercentage / 100)) * 100) / 100;
  const rawMaxNewEmiFromDti = Math.max(0, maxAllowableTotalEmi - existingMonthlyEmi);
  const disposableIncome = calculateDisposableIncome(monthlyIncome, monthlyExpenses, existingMonthlyEmi);

  // If expenses exceed income or disposable income is negative
  if (disposableIncome <= 0) {
    return {
      maxAllowableTotalEmi,
      maxNewEmi: 0,
      disposableIncome,
      isFinanciallyConstrained: true,
      constraintReason: 'Your current monthly expenses and loan EMIs exceed or equal your monthly income.'
    };
  }

  // Prudent disposable income cushion: Applicant must preserve at least 15% of disposable income as emergency buffer
  const maxNewEmiFromDisposable = Math.max(0, disposableIncome * 0.85);

  // The actual max new EMI is the minimum of DTI ceiling limit and disposable income capacity
  const effectiveMaxNewEmi = Math.min(rawMaxNewEmiFromDti, maxNewEmiFromDisposable);

  const isFinanciallyConstrained = effectiveMaxNewEmi < (monthlyIncome * 0.05); // Less than 5% capacity

  return {
    maxAllowableTotalEmi,
    maxNewEmi: Math.round(effectiveMaxNewEmi * 100) / 100,
    disposableIncome,
    isFinanciallyConstrained,
    constraintReason: isFinanciallyConstrained
      ? 'High existing expenses or debt obligations severely restrict new monthly repayment capacity.'
      : undefined
  };
}

/**
 * Inverts the EMI formula to determine the Maximum Principal Loan Amount
 * that fits within an affordable monthly EMI at given interest rate and tenure:
 * P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
 */
export function calculateMaxLoanAmountFromEmi(
  affordableEmi: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  if (affordableEmi <= 0 || tenureMonths <= 0) {
    return 0;
  }

  if (annualInterestRate <= 0) {
    return Math.floor(affordableEmi * tenureMonths);
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);

  const principal = (affordableEmi * (factor - 1)) / (monthlyRate * factor);
  // Round down to nearest 5,000 for standard realistic banking sanction amounts
  return Math.max(0, Math.floor(principal / 5000) * 5000);
}
