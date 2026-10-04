import React from 'react';
import { CustomerProfileInput, LoanPurpose } from '../../types/index.js';
import { formatINR } from '../../utils/formatters.js';
import { Target, Calendar, Stethoscope, GraduationCap, Home, HeartHandshake, Plane, RefreshCw, Car, User, Store, AlertOctagon } from 'lucide-react';

interface Step5Props {
  formData: CustomerProfileInput;
  onChange: (field: keyof CustomerProfileInput, value: any) => void;
  errors: Record<string, string>;
}

export const Step5LoanRequirement: React.FC<Step5Props> = ({ formData, onChange, errors }) => {
  const purposes: { value: LoanPurpose; label: string; icon: React.ReactNode }[] = [
    { value: 'Medical', label: 'Medical Treatment', icon: <Stethoscope className="w-4 h-4" /> },
    { value: 'Education', label: 'Higher Education / Courses', icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'Home Renovation', label: 'Home Renovation & Repairs', icon: <Home className="w-4 h-4" /> },
    { value: 'Debt Consolidation', label: 'Debt Consolidation', icon: <RefreshCw className="w-4 h-4" /> },
    { value: 'Emergency', label: 'Urgent Emergency Cash', icon: <AlertOctagon className="w-4 h-4" /> },
    { value: 'Wedding', label: 'Wedding & Family Events', icon: <HeartHandshake className="w-4 h-4" /> },
    { value: 'Business', label: 'Business Growth / Working Cap', icon: <Store className="w-4 h-4" /> },
    { value: 'Vehicle', label: 'Vehicle Purchase / Upgrade', icon: <Car className="w-4 h-4" /> },
    { value: 'Travel', label: 'Travel & Vacation', icon: <Plane className="w-4 h-4" /> },
    { value: 'Personal', label: 'General Personal Need', icon: <User className="w-4 h-4" /> }
  ];

  const tenures = [12, 18, 24, 36, 48, 60, 72, 84];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-fintech-600" />
          <span>Step 5: Loan Requirements</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Specify what you need funding for, how much you seek, and your target repayment duration.
        </p>
      </div>

      {/* Purpose Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Loan Purpose <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {purposes.map((p) => {
            const isSelected = formData.loanPurpose === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onChange('loanPurpose', p.value)}
                className={`p-3 rounded-xl border text-left flex flex-col items-start gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-fintech-600 bg-fintech-50/80 ring-2 ring-fintech-200 shadow-2xs text-fintech-900'
                    : 'border-slate-300 bg-white hover:border-slate-400 text-slate-700'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-fintech-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {p.icon}
                </div>
                <span className="text-xs font-bold leading-tight">{p.label}</span>
              </button>
            );
          })}
        </div>
        {errors.loanPurpose && <p className="text-xs text-rose-500 mt-1">{errors.loanPurpose}</p>}
      </div>

      {/* Requested Loan Amount */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Requested Loan Amount (₹) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
          <input
            type="number"
            min={10000}
            max={10000000}
            step={10000}
            value={formData.requestedAmount || ''}
            onChange={(e) => onChange('requestedAmount', Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full pl-8 pr-3.5 py-3 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
            placeholder="e.g. 500000"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-1.5">
          <span>In words: <strong className="text-slate-800">{formatINR(formData.requestedAmount)}</strong></span>
          <div className="flex gap-1.5 mt-1 sm:mt-0">
            {[100000, 300000, 500000, 1000000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onChange('requestedAmount', amt)}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                ₹{amt / 100000}L
              </button>
            ))}
          </div>
        </div>
        {errors.requestedAmount && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.requestedAmount}</p>}
      </div>

      {/* Preferred Tenure */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Preferred Repayment Tenure <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {tenures.map((m) => {
            const isSelected = formData.preferredTenureMonths === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onChange('preferredTenureMonths', m)}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-fintech-600 bg-fintech-600 text-white font-bold shadow-sm ring-2 ring-fintech-200'
                    : 'border-slate-300 bg-white hover:border-slate-400 text-slate-800 font-medium'
                }`}
              >
                <div className="text-sm">{m}</div>
                <div className={`text-[10px] ${isSelected ? 'text-fintech-100' : 'text-slate-400'}`}>Months</div>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Shorter tenures reduce total interest paid. Longer tenures lower monthly EMI.</span>
        </p>
        {errors.preferredTenureMonths && <p className="text-xs text-rose-500 mt-1">{errors.preferredTenureMonths}</p>}
      </div>
    </div>
  );
};
