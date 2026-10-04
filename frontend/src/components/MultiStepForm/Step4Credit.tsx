import React from 'react';
import { CustomerProfileInput } from '../../types/index.js';
import { ShieldCheck, Info, Sliders, AlertCircle } from 'lucide-react';

interface Step4Props {
  formData: CustomerProfileInput;
  onChange: (field: keyof CustomerProfileInput, value: any) => void;
  errors: Record<string, string>;
}

export const Step4Credit: React.FC<Step4Props> = ({ formData, onChange, errors }) => {
  const getScoreTier = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 700) return { label: 'Good', color: 'bg-teal-50 text-teal-700 border-teal-200' };
    if (score >= 650) return { label: 'Fair', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (score >= 600) return { label: 'Weak', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { label: 'Poor', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const scoreTier = getScoreTier(formData.creditScore);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-fintech-600" />
          <span>Step 4: Credit History & Repayment Track</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Repayment track record and bureau indicators dictate interest rate tiers and product risk weighting.
        </p>
      </div>

      {/* Contextual disclaimer note */}
      <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-900 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          Credit score is one of several factors evaluated by the recommendation engine alongside cash flow and stability. The system does not guarantee loan approval or lender sanction.
        </div>
      </div>

      {/* Credit Score - Slider + Number Input */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Credit Score (300 – 900) <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mt-0.5">Use slider or enter exact bureau score</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${scoreTier.color}`}>
              {scoreTier.label} Tier
            </span>
            <input
              type="number"
              min={300}
              max={900}
              value={formData.creditScore}
              onChange={(e) => {
                const val = Math.min(900, Math.max(300, parseInt(e.target.value, 10) || 300));
                onChange('creditScore', val);
              }}
              className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-center text-slate-900 text-base focus:ring-2 focus:ring-fintech-500"
            />
          </div>
        </div>

        <input
          type="range"
          min={300}
          max={900}
          step={5}
          value={formData.creditScore}
          onChange={(e) => onChange('creditScore', parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fintech-600"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
          <span>300 (Poor)</span>
          <span>600 (Weak)</span>
          <span>650 (Fair)</span>
          <span>700 (Good)</span>
          <span>750+ (Excellent)</span>
          <span>900</span>
        </div>
      </div>

      {/* Credit Utilization - Slider + Number Input */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Credit Card / Revolving Utilization Ratio (%) <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mt-0.5">Proportion of your available credit limits currently used</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                formData.creditUtilizationRatio <= 30
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : formData.creditUtilizationRatio <= 50
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {formData.creditUtilizationRatio <= 30 ? 'Healthy (<=30%)' : formData.creditUtilizationRatio <= 50 ? 'Moderate' : 'High Utilization'}
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={formData.creditUtilizationRatio}
              onChange={(e) => {
                const val = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                onChange('creditUtilizationRatio', val);
              }}
              className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 font-bold text-center text-slate-900 text-sm focus:ring-2 focus:ring-fintech-500"
            />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={formData.creditUtilizationRatio}
          onChange={(e) => onChange('creditUtilizationRatio', parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fintech-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
        {/* Credit History Length */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Credit History Vintage (Years) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={formData.creditHistoryYears === 0 ? '0' : formData.creditHistoryYears || ''}
            onChange={(e) => onChange('creditHistoryYears', Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
            placeholder="e.g. 4"
          />
          {errors.creditHistoryYears && <p className="text-xs text-rose-500 mt-1">{errors.creditHistoryYears}</p>}
        </div>

        {/* Late Payments Count */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Late Payments in Past 24 Months <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={30}
            value={formData.latePaymentCount === 0 ? '0' : formData.latePaymentCount || ''}
            onChange={(e) => onChange('latePaymentCount', Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
            placeholder="0"
          />
          <p className="text-[11px] text-slate-500 mt-1">Number of 30+ day overdue instances</p>
          {errors.latePaymentCount && <p className="text-xs text-rose-500 mt-1">{errors.latePaymentCount}</p>}
        </div>

        {/* Previous Closed/Active Loans Count */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Previous Lifetime Loans Count <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={30}
            value={formData.previousLoanCount === 0 ? '0' : formData.previousLoanCount || ''}
            onChange={(e) => onChange('previousLoanCount', Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
            placeholder="0"
          />
          {errors.previousLoanCount && <p className="text-xs text-rose-500 mt-1">{errors.previousLoanCount}</p>}
        </div>

        {/* Previous Loan Defaults */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Past Loan Defaults / Write-Offs <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={10}
            value={formData.previousLoanDefaultCount === 0 ? '0' : formData.previousLoanDefaultCount || ''}
            onChange={(e) => onChange('previousLoanDefaultCount', Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
            placeholder="0"
          />
          <p className="text-[11px] text-slate-500 mt-1">Non-performing loan or settlement marks</p>
          {errors.previousLoanDefaultCount && <p className="text-xs text-rose-500 mt-1">{errors.previousLoanDefaultCount}</p>}
        </div>
      </div>
    </div>
  );
};
