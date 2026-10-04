import React from 'react';
import { FinancialSummary, AffordabilityCategory } from '../../types/index.js';
import { formatINR } from '../../utils/formatters.js';
import { ProgressBar } from '../common/ProgressBar.js';
import { Activity, Wallet, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FinancialHealthSummaryProps {
  summary: FinancialSummary;
  affordabilityScore: number;
  affordabilityCategory: AffordabilityCategory;
  proposedDti: number;
  maximumNewEmi: number;
}

export const FinancialHealthSummary: React.FC<FinancialHealthSummaryProps> = ({
  summary,
  affordabilityScore,
  affordabilityCategory,
  proposedDti,
  maximumNewEmi
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Financial Health & Capacity Breakdown</h3>
            <p className="text-xs text-slate-500">Transparent assessment of cash flow surplus and debt-service buffer</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500">Affordability Score</span>
          <div className="text-xl font-extrabold text-emerald-600">{affordabilityScore} / 100</div>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Monthly Net Disposable Cash Flow */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Disposable Cash Surplus</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <div className={`text-xl font-extrabold ${summary.disposable_income > 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {formatINR(summary.disposable_income)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Income ({formatINR(summary.monthly_income)}) − Expenses − Current EMI
          </p>
        </div>

        {/* DTI Headroom Shift */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Debt-to-Income (DTI) Shift</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-200 text-slate-700">45% Cap</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-slate-600">{summary.existing_dti.toFixed(1)}%</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className={`text-xl font-extrabold ${proposedDti > 45 ? 'text-amber-600' : 'text-fintech-600'}`}>
              {proposedDti.toFixed(1)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {proposedDti <= 45 ? 'Well within prudent 45% ceiling' : 'Elevated debt utilization'}
          </p>
        </div>

        {/* Max Affordable New EMI */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Safe New EMI Ceiling</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700">
            {formatINR(maximumNewEmi)} <span className="text-xs font-normal text-slate-500">/ mo</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Preserving emergency living cushion</p>
        </div>
      </div>

      {/* Visual Bars for Debt Burden vs Prudent Limits */}
      <div className="space-y-3 pt-2">
        <div>
          <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1.5">
            <span>Proposed Debt Service Utilization (DTI)</span>
            <span>{proposedDti.toFixed(1)}% / 45% standard benchmark</span>
          </div>
          <ProgressBar
            value={(proposedDti / 45) * 100}
            color={proposedDti > 45 ? 'rose' : proposedDti > 35 ? 'amber' : 'emerald'}
            height="md"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1.5">
            <span>Affordability Index</span>
            <span className="font-semibold">{affordabilityCategory} ({affordabilityScore}/100)</span>
          </div>
          <ProgressBar
            value={affordabilityScore}
            color={affordabilityScore >= 70 ? 'emerald' : affordabilityScore >= 40 ? 'amber' : 'rose'}
            height="md"
          />
        </div>
      </div>
    </div>
  );
};
