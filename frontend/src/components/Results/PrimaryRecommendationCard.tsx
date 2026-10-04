import React from 'react';
import { RecommendationResponse } from '../../types/index.js';
import { formatINR, formatPercent, formatMonths } from '../../utils/formatters.js';
import { Award, ShieldCheck, PieChart, IndianRupee, Clock, Percent, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge.js';

interface PrimaryRecommendationCardProps {
  response: RecommendationResponse;
  onAdjustClick?: () => void;
}

export const PrimaryRecommendationCard: React.FC<PrimaryRecommendationCardProps> = ({
  response,
  onAdjustClick
}) => {
  const rec = response.recommendation;
  if (!rec) return null;

  const riskColor = {
    Low: 'success',
    Medium: 'info',
    High: 'warning',
    'Very High': 'danger'
  }[response.risk.category] as any;

  const affordabilityColor = {
    'Highly Affordable': 'success',
    Affordable: 'success',
    Borderline: 'warning',
    Difficult: 'danger',
    Unaffordable: 'danger'
  }[response.affordability.category] as any;

  return (
    <div className="bg-white rounded-3xl border-2 border-fintech-500/80 shadow-xl shadow-fintech-900/5 overflow-hidden">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-fintech-800 via-fintech-700 to-indigo-800 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Top Recommended Loan Product</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-fintech-200">Recommendation Fit:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              {rec.recommendation_score} / 100
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{rec.product_name}</h2>
            <p className="text-sm text-fintech-200 mt-1 flex items-center gap-2">
              <span>Lender: <strong>{rec.lender_name}</strong></span>
              <span>•</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-sm text-xs">{rec.loan_type}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={riskColor} size="md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{response.risk.category} Risk ({response.risk.score}/100)</span>
            </Badge>
            <Badge variant={affordabilityColor} size="md">
              <PieChart className="w-3.5 h-3.5" />
              <span>{response.affordability.category}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Numbers Grid */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-slate-100">
          {/* Recommended Amount */}
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recommended Amount
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatINR(rec.amount)}
            </div>
            <p className="text-[11px] text-slate-500">Risk & cashflow optimized</p>
          </div>

          {/* Monthly EMI */}
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estimated Monthly EMI
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-fintech-600 tracking-tight">
              {formatINR(rec.emi)} <span className="text-xs font-normal text-slate-500">/ mo</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">Within safe debt ceiling</p>
          </div>

          {/* Interest Rate */}
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Interest Rate
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatPercent(rec.interest_rate)} <span className="text-xs font-normal text-slate-500">p.a.</span>
            </div>
            <p className="text-[11px] text-slate-500">Risk-adjusted tier</p>
          </div>

          {/* Tenure */}
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recommended Tenure
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {rec.tenure_months} <span className="text-xs font-normal text-slate-500">Months</span>
            </div>
            <p className="text-[11px] text-slate-500">{formatMonths(rec.tenure_months)}</p>
          </div>
        </div>

        {/* Sub-metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-500">Total Interest Payable:</span>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{formatINR(rec.total_interest)}</div>
          </div>
          <div>
            <span className="text-slate-500">Total Principal + Interest:</span>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{formatINR(rec.total_payment)}</div>
          </div>
          <div>
            <span className="text-slate-500">Processing Fee:</span>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{formatINR(rec.processing_fee_amount)}</div>
          </div>
          <div>
            <span className="text-slate-500">Proposed Total DTI:</span>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{rec.proposed_dti.toFixed(1)}%</div>
          </div>
        </div>

        {/* Product Description & Quick Action */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {rec.description}
          </p>
          {onAdjustClick && (
            <button
              onClick={onAdjustClick}
              className="px-5 py-2.5 rounded-xl bg-fintech-50 hover:bg-fintech-100 text-fintech-700 border border-fintech-200 font-bold text-xs shrink-0 transition-colors cursor-pointer"
            >
              Adjust Amount & Tenure
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
