import React from 'react';
import { CustomerProfileInput, EmploymentType } from '../../types/index.js';
import { Briefcase, Building2, ShieldCheck, AlertCircle } from 'lucide-react';

interface Step2Props {
  formData: CustomerProfileInput;
  onChange: (field: keyof CustomerProfileInput, value: any) => void;
  errors: Record<string, string>;
}

export const Step2Employment: React.FC<Step2Props> = ({ formData, onChange, errors }) => {
  const maxPossibleExperience = Math.max(0, formData.age - 18);

  const employmentTypes: { value: EmploymentType; label: string; desc: string }[] = [
    { value: 'Salaried', label: 'Salaried', desc: 'Working at private corporate or firm' },
    { value: 'Government Employee', label: 'Government', desc: 'Central/State PSUs or Public Services' },
    { value: 'Business Owner', label: 'Business Owner', desc: 'Registered enterprise or firm proprietor' },
    { value: 'Self-Employed', label: 'Self-Employed', desc: 'Doctors, Lawyers, Chartered Accountants, etc.' },
    { value: 'Freelancer', label: 'Freelancer / Consultant', desc: 'Independent contractor / gigs' }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-fintech-600" />
          <span>Step 2: Employment & Stability</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Income source consistency is an essential factor in risk-weighting and lender policy eligibility.
        </p>
      </div>

      {/* Employment Type Cards */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Employment Type <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {employmentTypes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange('employmentType', item.value)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                formData.employmentType === item.value
                  ? 'border-fintech-600 bg-fintech-50/70 ring-2 ring-fintech-200 shadow-2xs'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            >
              <div className="font-semibold text-sm text-slate-900">{item.label}</div>
              <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
        {errors.employmentType && <p className="text-xs text-rose-500 mt-1">{errors.employmentType}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Total Work Experience */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Total Work Experience (Years) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={50}
              value={formData.experienceYears === 0 ? '0' : formData.experienceYears || ''}
              onChange={(e) => onChange('experienceYears', Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
              placeholder="e.g. 5"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              Max {maxPossibleExperience} yrs (for age {formData.age})
            </span>
          </div>
          {errors.experienceYears && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.experienceYears}</span>
            </p>
          )}
        </div>

        {/* Employer Stability Indicator */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Employer / Business Stability Indicator
          </label>
          <select
            value={formData.employerStability || 'High'}
            onChange={(e) => onChange('employerStability', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all bg-white"
          >
            <option value="High">High Stability (MNC / Listed Co. / Govt / 5+ yrs Business)</option>
            <option value="Medium">Medium Stability (SME / Established Startup / 2-5 yrs)</option>
            <option value="Low">Low Stability (Early-stage startup / &lt;1 yr Business)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-1">Used to evaluate employment risk points.</p>
        </div>
      </div>
    </div>
  );
};
