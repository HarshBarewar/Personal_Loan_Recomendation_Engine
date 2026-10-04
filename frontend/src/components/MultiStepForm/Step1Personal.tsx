import React from 'react';
import { CustomerProfileInput } from '../../types/index.js';
import { User, Home, MapPin, GraduationCap } from 'lucide-react';

interface Step1Props {
  formData: CustomerProfileInput;
  onChange: (field: keyof CustomerProfileInput, value: any) => void;
  errors: Record<string, string>;
}

export const Step1Personal: React.FC<Step1Props> = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-fintech-600" />
          <span>Step 1: Personal Information</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Basic demographic profile used to determine baseline product eligibility age and living costs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Age */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Applicant Age (Years) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min={18}
              max={65}
              value={formData.age || ''}
              onChange={(e) => onChange('age', parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
              placeholder="e.g. 29"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">Yrs (18–65)</span>
          </div>
          {errors.age && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Gender <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => onChange('gender', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all bg-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Marital Status <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.maritalStatus}
            onChange={(e) => onChange('maritalStatus', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all bg-white"
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {/* Number of Dependents */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Number of Dependents <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={15}
            value={formData.dependents}
            onChange={(e) => onChange('dependents', Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all"
            placeholder="0"
          />
          {errors.dependents && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.dependents}</p>}
        </div>

        {/* Education Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Highest Education <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.education}
              onChange={(e) => onChange('education', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all bg-white"
            >
              <option value="High School">High School</option>
              <option value="Diploma">Diploma</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
        </div>

        {/* Residence Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Residence Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.residenceType}
            onChange={(e) => onChange('residenceType', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-fintech-500 focus:border-transparent transition-all bg-white"
          >
            <option value="Owned">Owned (Self / Family)</option>
            <option value="Rented">Rented</option>
            <option value="Family">Family Owned</option>
          </select>
        </div>

        {/* City Tier */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            City Tier <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Tier 1', 'Tier 2', 'Tier 3'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => onChange('cityTier', tier)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  formData.cityTier === tier
                    ? 'border-fintech-600 bg-fintech-50 text-fintech-700 ring-2 ring-fintech-200'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {tier}
                <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                  {tier === 'Tier 1' ? 'Metros' : tier === 'Tier 2' ? 'State Capitals / Cities' : 'Towns & Semi-Urban'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
