import React from 'react';
import { CustomerProfileInput } from '../../types/index.js';
import { formatINR } from '../../utils/formatters.js';
import { CheckCircle2, Edit3, ShieldAlert, Cpu } from 'lucide-react';

interface Step6Props {
  formData: CustomerProfileInput;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const Step6Review: React.FC<Step6Props> = ({ formData, onEditStep, onSubmit, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Step 6: Review Profile Before Calculation</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Please review your entered parameters. Our rule engine will run eligibility filters, stress-test affordability, and generate ranked recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Personal Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">1. Personal Information</h4>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-fintech-600 hover:text-fintech-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Age:</span> <strong className="text-slate-800">{formData.age} years</strong>
            </div>
            <div className="flex justify-between">
              <span>Gender:</span> <strong className="text-slate-800">{formData.gender}</strong>
            </div>
            <div className="flex justify-between">
              <span>Marital Status & Dependents:</span>{' '}
              <strong className="text-slate-800">{formData.maritalStatus} ({formData.dependents} deps)</strong>
            </div>
            <div className="flex justify-between">
              <span>Education:</span> <strong className="text-slate-800">{formData.education}</strong>
            </div>
            <div className="flex justify-between">
              <span>Residence & Tier:</span>{' '}
              <strong className="text-slate-800">{formData.residenceType} ({formData.cityTier})</strong>
            </div>
          </div>
        </div>

        {/* Employment Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">2. Employment Profile</h4>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-fintech-600 hover:text-fintech-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Employment Type:</span> <strong className="text-slate-800">{formData.employmentType}</strong>
            </div>
            <div className="flex justify-between">
              <span>Work Experience:</span> <strong className="text-slate-800">{formData.experienceYears} years</strong>
            </div>
            <div className="flex justify-between">
              <span>Stability Level:</span>{' '}
              <strong className="text-slate-800">{formData.employerStability || 'High'}</strong>
            </div>
          </div>
        </div>

        {/* Financial Profile */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">3. Financial Capacity</h4>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-fintech-600 hover:text-fintech-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Monthly Gross Income:</span>{' '}
              <strong className="text-emerald-700 font-bold">{formatINR(formData.monthlyIncome)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Monthly Living Expenses:</span>{' '}
              <strong className="text-slate-800">{formatINR(formData.monthlyExpenses)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Existing Monthly EMI:</span>{' '}
              <strong className="text-slate-800">{formatINR(formData.existingMonthlyEmi)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Existing Loan Balance:</span>{' '}
              <strong className="text-slate-800">{formatINR(formData.existingLoanAmount)} ({formData.existingLoanCount} loans)</strong>
            </div>
            <div className="flex justify-between">
              <span>Emergency Liquid Savings:</span>{' '}
              <strong className="text-slate-800">{formatINR(formData.savingsBalance)}</strong>
            </div>
          </div>
        </div>

        {/* Credit Profile */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">4. Credit Track</h4>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-fintech-600 hover:text-fintech-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Credit Score:</span>{' '}
              <strong className="text-fintech-700 font-bold">{formData.creditScore}</strong>
            </div>
            <div className="flex justify-between">
              <span>Credit Utilization:</span>{' '}
              <strong className="text-slate-800">{formData.creditUtilizationRatio}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Credit History Vintage:</span>{' '}
              <strong className="text-slate-800">{formData.creditHistoryYears} years</strong>
            </div>
            <div className="flex justify-between">
              <span>Late Payments (24m):</span>{' '}
              <strong className={formData.latePaymentCount > 0 ? 'text-amber-600' : 'text-slate-800'}>
                {formData.latePaymentCount}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Past Loan Defaults:</span>{' '}
              <strong className={formData.previousLoanDefaultCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                {formData.previousLoanDefaultCount}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Target Loan Requirement Banner */}
      <div className="p-4 rounded-xl bg-fintech-50 border border-fintech-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-fintech-700 uppercase tracking-wider">Target Loan Request</span>
          <div className="text-xl font-bold text-slate-900 mt-0.5">
            {formatINR(formData.requestedAmount)} for {formData.loanPurpose}
          </div>
          <p className="text-xs text-slate-600 mt-0.5">Target repayment tenure: {formData.preferredTenureMonths} months</p>
        </div>
        <button
          type="button"
          onClick={() => onEditStep(5)}
          className="px-3 py-1.5 rounded-lg border border-fintech-300 bg-white hover:bg-fintech-100 text-fintech-700 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" /> Change Request
        </button>
      </div>

      {/* Confirmation Callout */}
      <div className="p-4 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-start gap-3">
        <Cpu className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          By continuing, our rule-based engine will execute multi-lender eligibility filtering, cash-flow affordability stress testing, and recommendation ranking using deterministic business rules.
        </div>
      </div>
    </div>
  );
};
