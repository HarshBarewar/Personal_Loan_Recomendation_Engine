import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const customerProfileSchema = z.object({
  // Personal
  age: z
    .number({ required_error: 'Age is required' })
    .min(18, 'Age must be at least 18 years')
    .max(65, 'Age must not exceed 65 years'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  dependents: z.number().min(0, 'Dependents cannot be negative').max(15, 'Maximum 15 dependents allowed'),
  education: z.enum(['High School', 'Diploma', 'Graduate', 'Post Graduate', 'Professional']),
  residenceType: z.enum(['Owned', 'Rented', 'Family']),
  cityTier: z.enum(['Tier 1', 'Tier 2', 'Tier 3']),

  // Employment
  employmentType: z.enum([
    'Salaried',
    'Self-Employed',
    'Business Owner',
    'Freelancer',
    'Government Employee'
  ]),
  experienceYears: z
    .number({ required_error: 'Work experience is required' })
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years'),
  employerStability: z.string().optional(),

  // Financial
  monthlyIncome: z
    .number({ required_error: 'Monthly income is required' })
    .positive('Monthly income must be greater than ₹0'),
  monthlyExpenses: z
    .number({ required_error: 'Monthly expenses are required' })
    .min(0, 'Monthly expenses cannot be negative'),
  existingLoanAmount: z
    .number({ required_error: 'Existing loan amount is required' })
    .min(0, 'Existing loan amount cannot be negative'),
  existingMonthlyEmi: z
    .number({ required_error: 'Existing monthly EMI is required' })
    .min(0, 'Existing monthly EMI cannot be negative'),
  existingLoanCount: z
    .number()
    .min(0, 'Existing loan count cannot be negative')
    .max(30, 'Cannot exceed 30 existing loans'),
  savingsBalance: z
    .number({ required_error: 'Savings balance is required' })
    .min(0, 'Savings balance cannot be negative'),
  bankAccountAgeYears: z
    .number()
    .min(0, 'Bank account age cannot be negative')
    .max(50, 'Bank account age cannot exceed 50 years'),

  // Credit
  creditScore: z
    .number({ required_error: 'Credit score is required' })
    .min(300, 'Credit score minimum is 300')
    .max(900, 'Credit score maximum is 900'),
  creditHistoryYears: z
    .number()
    .min(0, 'Credit history cannot be negative')
    .max(50, 'Credit history cannot exceed 50 years'),
  latePaymentCount: z
    .number()
    .min(0, 'Late payments cannot be negative')
    .max(50, 'Late payments cannot exceed 50'),
  creditUtilizationRatio: z
    .number()
    .min(0, 'Credit utilization ratio must be at least 0%')
    .max(100, 'Credit utilization ratio cannot exceed 100%'),
  previousLoanCount: z.number().min(0, 'Previous loan count cannot be negative'),
  previousLoanDefaultCount: z.number().min(0, 'Previous default count cannot be negative'),

  // Loan Requirement
  loanPurpose: z.enum([
    'Medical',
    'Education',
    'Home Renovation',
    'Wedding',
    'Travel',
    'Debt Consolidation',
    'Vehicle',
    'Personal',
    'Business',
    'Emergency'
  ]),
  requestedAmount: z
    .number({ required_error: 'Requested loan amount is required' })
    .min(10000, 'Minimum loan request is ₹10,000')
    .max(10000000, 'Maximum loan request is ₹1,00,00,000'),
  preferredTenureMonths: z
    .number({ required_error: 'Preferred tenure is required' })
    .refine((val) => [12, 18, 24, 36, 48, 60, 72, 84].includes(val), {
      message: 'Tenure must be one of: 12, 18, 24, 36, 48, 60, 72, 84 months'
    })
}).superRefine((data, ctx) => {
  // Check experience relative to age (assuming starting work at earliest age 18)
  const maxPossibleExperience = Math.max(0, data.age - 18);
  if (data.experienceYears > maxPossibleExperience) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Work experience (${data.experienceYears} yrs) cannot exceed realistic adult working years (${maxPossibleExperience} yrs) for an applicant aged ${data.age}.`,
      path: ['experienceYears']
    });
  }

  // Cross check existing loan count vs existing loan amount / EMI
  if (data.existingLoanAmount > 0 && data.existingLoanCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'If existing loan amount is greater than ₹0, existing loan count must be at least 1.',
      path: ['existingLoanCount']
    });
  }
});

export function validateCustomerProfile(req: Request, res: Response, next: NextFunction): void {
  const parseResult = customerProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    const errorMap = parseResult.error.flatten();
    res.status(400).json({
      status: 'error',
      message: 'Validation failed on submitted financial profile',
      fieldErrors: errorMap.fieldErrors,
      formErrors: errorMap.formErrors
    });
    return;
  }
  req.body = parseResult.data;
  next();
}

export const emiCalculationSchema = z.object({
  principal: z.number().positive('Principal must be greater than 0'),
  annualInterestRate: z.number().min(0, 'Interest rate cannot be negative').max(50, 'Interest rate exceeds maximum 50%'),
  tenureMonths: z.number().int().min(1, 'Tenure must be at least 1 month').max(120, 'Tenure cannot exceed 120 months')
});

export function validateEmiCalculation(req: Request, res: Response, next: NextFunction): void {
  const result = emiCalculationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid EMI calculation parameters',
      errors: result.error.flatten().fieldErrors
    });
    return;
  }
  req.body = result.data;
  next();
}

export const affordabilityCalculationSchema = z.object({
  monthlyIncome: z.number().positive('Monthly income must be greater than 0'),
  monthlyExpenses: z.number().min(0, 'Monthly expenses cannot be negative'),
  existingMonthlyEmi: z.number().min(0, 'Existing monthly EMI cannot be negative'),
  interestRate: z.number().min(0).max(50).optional().default(12.0),
  tenureMonths: z.number().min(6).max(84).optional().default(48)
});

export function validateAffordabilityCalculation(req: Request, res: Response, next: NextFunction): void {
  const result = affordabilityCalculationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid affordability parameters',
      errors: result.error.flatten().fieldErrors
    });
    return;
  }
  req.body = result.data;
  next();
}
