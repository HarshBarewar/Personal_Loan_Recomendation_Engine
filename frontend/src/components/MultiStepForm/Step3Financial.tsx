import React from 'react';
import { CustomerProfileInput } from '../../types/index.js';
import { formatINR } from '../../utils/formatters.js';
import { IndianRupee, AlertTriangle, Wallet, PiggyBank } from 'lucide-react';

interface Step3Props {
  formData: CustomerProfileInput;
  onChange: (field: keyof CustomerProfileInput, value: any) => void;
  errors: Record<string, string>;
}

export const Step3Financial: React.FC<Step3Props> = ({ formData, onChange, errors }) => {
  const disposable = formData.monthlyIncome - formData.monthlyExpenses - formData.existingMonthlyEmi;
  const isNegativeCashFlow = formData.monthlyExpenses > formData.monthlyIncome;
  const existingDti = formData.monthlyIncome > 0 ? (formData.existingMonthlyEmi / formData.monthlyIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-fintech-600" />
          <span>Step 3: Financial Profile & Cash Flow</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          All values are in Indian Rupees (₹). Used to compute DTI, disposable surplus, and maximum affordable EMI.
        </p>
      </div>

      {/* Cash Flow Health Preview Pill */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 font-medium">Monthly Gross Income:</span>
          <div className="font-bold text-slate-900 text-sm">{formatINR(formData.monthlyIncome)}</div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Existing DTI Ratio:</span>
          <div className={`font-bold text-sm ${existingDti > 45 ? 'text-amber-600' : 'text-slate-900'}`}>
            {existingDti.toFixed(1)}% {existingDti > 45 && '(High Debt)'}
          </div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Estimated Disposable Surplus:</span>
          <div className={`font-bold text-sm ${disposable <= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {formatINR(disposable)}
          </div>
        </div>
      </div>

      {isNegativeCashFlow && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Cash Flow Warning:</span> Declared monthly expenses ({formatINR(formData.monthlyExpenses)}) exceed your monthly income ({formatINR(formData.monthlyIncome)}). Please ensure figures are accurate before calculating.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Monthly Income */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Gross Monthly Income (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
            <input
              type="number"
              min={1000}
              step={1000}
              value={formData.monthlyIncome || ''}
              onChange={(e) => onChange('monthlyIncome', Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all font-medium"
              placeholder="e.g. 60000"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>Formatted: {formatINR(formData.monthlyIncome)}</span>
            <span>Min ₹18,000 for standard loans</span>
          </div>
          {errors.monthlyIncome && <p className="text-xs text-rose-500 mt-1">{errors.monthlyIncome}</p>}
        </div>

        {/* Monthly Expenses */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Monthly Living Expenses (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
            <input
              type="number"
              min={0}
              step={1000}
              value={formData.monthlyExpenses === 0 ? '0' : formData.monthlyExpenses || ''}
              onChange={(e) => onChange('monthlyExpenses', Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all font-medium"
              placeholder="e.g. 25000"
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Formatted: {formatINR(formData.monthlyExpenses)} (Rent, food, utilities)
          </div>
          {errors.monthlyExpenses && <p className="text-xs text-rose-500 mt-1">{errors.monthlyExpenses}</p>}
        </div>

        {/* Existing Monthly EMI */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Existing Monthly EMI (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
            <input
              type="number"
              min={0}
              step={500}
              value={formData.existingMonthlyEmi === 0 ? '0' : formData.existingMonthlyEmi || ''}
              onChange={(e) => onChange('existingMonthlyEmi', Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all font-medium"
              placeholder="0 if none"
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Formatted: {formatINR(formData.existingMonthlyEmi)} / month
          </div>
          {errors.existingMonthlyEmi && <p className="text-xs text-rose-500 mt-1">{errors.existingMonthlyEmi}</p>}
        </div>

        {/* Existing Total Outstanding Loan Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Total Outstanding Loan Balance (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
            <input
              type="number"
              min={0}
              step={5000}
              value={formData.existingLoanAmount === 0 ? '0' : formData.existingLoanAmount || ''}
              onChange={(e) => onChange('existingLoanAmount', Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all font-medium"
              placeholder="0 if none"
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Formatted: {formatINR(formData.existingLoanAmount)}
          </div>
          {errors.existingLoanAmount && <p className="text-xs text-rose-500 mt-1">{errors.existingLoanAmount}</p>}
        </div>

        {/* Number of Existing Active Loans */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Active Existing Loans Count <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={20}
            value={formData.existingLoanCount === 0 ? '0' : formData.existingLoanCount || ''}
            onChange={(e) => onChange('existingLoanCount', Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
            placeholder="0"
          />
          {errors.existingLoanCount && <p className="text-xs text-rose-500 mt-1">{errors.existingLoanCount}</p>}
        </div>

        {/* Liquid Savings Balance */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Liquid Savings / Deposits (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
            <input
              type="number"
              min={0}
              step={5000}
              value={formData.savingsBalance === 0 ? '0' : formData.savingsBalance || ''}
              onChange={(e) => onChange('savingsBalance', Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all font-medium"
              placeholder="e.g. 100000"
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Formatted: {formatINR(formData.savingsBalance)} (Emergency cushion)
          </div>
          {errors.savingsBalance && <p className="text-xs text-rose-500 mt-1">{errors.savingsBalance}</p>}
        </div>

        {/* Primary Bank Account Age */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Bank Account Relationship (Years) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={formData.bankAccountAgeYears === 0 ? '0' : formData.bankAccountAgeYears || ''}
            onChange={(e) => onChange('bankAccountAgeYears', Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
            placeholder="e.g. 5"
          />
          {errors.bankAccountAgeYears && <p className="text-xs text-rose-500 mt-1">{errors.bankAccountAgeYears}</p>}
        </div>
      </div>
    </div>
  );
};
