import { Request, Response, NextFunction } from 'express';
import {
  calculateEmi,
  calculateTotalInterest,
  calculateAffordableEmi,
  calculateMaxLoanAmountFromEmi,
  calculateExistingDti,
  calculateProposedDti
} from '../calculations/financialCalculations.js';

export class CalculationController {
  public static calculateEmi(req: Request, res: Response, next: NextFunction): void {
    try {
      const { principal, annualInterestRate, tenureMonths } = req.body;

      const emi = calculateEmi(principal, annualInterestRate, tenureMonths);
      const totalInterest = calculateTotalInterest(principal, emi, tenureMonths);
      const totalPayable = Math.round((principal + totalInterest) * 100) / 100;

      res.status(200).json({
        status: 'success',
        data: {
          principal,
          annualInterestRate,
          tenureMonths,
          monthlyEmi: emi,
          totalInterest,
          totalPayable
        }
      });
    } catch (err) {
      next(err);
    }
  }

  public static calculateAffordability(req: Request, res: Response, next: NextFunction): void {
    try {
      const {
        monthlyIncome,
        monthlyExpenses,
        existingMonthlyEmi,
        interestRate = 12.0,
        tenureMonths = 48
      } = req.body;

      const existingDti = calculateExistingDti(monthlyIncome, existingMonthlyEmi);
      const affordability = calculateAffordableEmi(monthlyIncome, monthlyExpenses, existingMonthlyEmi);
      const maxAffordableLoan = calculateMaxLoanAmountFromEmi(
        affordability.maxNewEmi,
        interestRate,
        tenureMonths
      );

      res.status(200).json({
        status: 'success',
        data: {
          monthlyIncome,
          monthlyExpenses,
          existingMonthlyEmi,
          existingDti,
          disposableIncome: affordability.disposableIncome,
          maxAllowableTotalEmi: affordability.maxAllowableTotalEmi,
          maxNewEmi: affordability.maxNewEmi,
          maxAffordableLoanAmount: maxAffordableLoan,
          isFinanciallyConstrained: affordability.isFinanciallyConstrained,
          constraintReason: affordability.constraintReason
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
