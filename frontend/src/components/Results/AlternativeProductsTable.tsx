import React from 'react';
import { RecommendationResponse } from '../../types/index.js';
import { formatINR, formatPercent } from '../../utils/formatters.js';
import { Scale, Check, ArrowRight } from 'lucide-react';

interface AlternativeProductsTableProps {
  alternatives: RecommendationResponse['alternatives'];
  onSelectProduct?: (productName: string, amount: number, rate: number, tenure: number) => void;
}

export const AlternativeProductsTable: React.FC<AlternativeProductsTableProps> = ({
  alternatives,
  onSelectProduct
}) => {
  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Alternative Eligible Loan Options</h3>
            <p className="text-xs text-slate-500">
              Other products that passed hard eligibility filters, ranked by composite suitability
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {alternatives.length} Alternatives Available
        </span>
      </div>

      {/* Desktop Comparison Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <th className="py-3 px-3">Product & Lender</th>
              <th className="py-3 px-3">Loan Amount</th>
              <th className="py-3 px-3">Interest Rate</th>
              <th className="py-3 px-3">Tenure</th>
              <th className="py-3 px-3">Monthly EMI</th>
              <th className="py-3 px-3">Total Interest</th>
              <th className="py-3 px-3">Fit Score</th>
              <th className="py-3 px-3">Key Differentiator</th>
              {onSelectProduct && <th className="py-3 px-3 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alternatives.map((alt) => (
              <tr key={alt.product_id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-3 font-semibold text-slate-900">
                  <div>{alt.product_name}</div>
                  <div className="text-[11px] font-normal text-slate-400">{alt.lender_name} • {alt.loan_type}</div>
                </td>
                <td className="py-4 px-3 font-bold text-slate-900">{formatINR(alt.amount)}</td>
                <td className="py-4 px-3 font-bold text-slate-900">{formatPercent(alt.interest_rate)}</td>
                <td className="py-4 px-3 text-slate-700">{alt.tenure_months} mos</td>
                <td className="py-4 px-3 font-bold text-fintech-600">{formatINR(alt.emi)}</td>
                <td className="py-4 px-3 text-slate-600">{formatINR(alt.total_interest)}</td>
                <td className="py-4 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold">
                    {alt.recommendation_score}
                  </span>
                </td>
                <td className="py-4 px-3 text-slate-600 max-w-xs">{alt.key_reason}</td>
                {onSelectProduct && (
                  <td className="py-4 px-3 text-right">
                    <button
                      onClick={() => onSelectProduct(alt.product_name, alt.amount, alt.interest_rate, alt.tenure_months)}
                      className="px-2.5 py-1 text-xs font-semibold text-fintech-600 hover:text-fintech-700 hover:bg-fintech-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Simulate
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {alternatives.map((alt) => (
          <div key={alt.product_id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{alt.product_name}</h4>
                <p className="text-[11px] text-slate-500">{alt.lender_name} • {alt.loan_type}</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-fintech-50 text-fintech-700 border border-fintech-200 text-xs font-bold">
                {alt.recommendation_score}/100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/60">
              <div>
                <span className="text-slate-400">Amount:</span> <strong className="text-slate-800">{formatINR(alt.amount)}</strong>
              </div>
              <div>
                <span className="text-slate-400">Rate:</span> <strong className="text-slate-800">{formatPercent(alt.interest_rate)}</strong>
              </div>
              <div>
                <span className="text-slate-400">Monthly EMI:</span> <strong className="text-fintech-600">{formatINR(alt.emi)}</strong>
              </div>
              <div>
                <span className="text-slate-400">Tenure:</span> <strong className="text-slate-800">{alt.tenure_months} mos</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 italic">"{alt.key_reason}"</p>

            {onSelectProduct && (
              <button
                onClick={() => onSelectProduct(alt.product_name, alt.amount, alt.interest_rate, alt.tenure_months)}
                className="w-full py-2 rounded-xl bg-white border border-slate-300 font-semibold text-xs text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Simulate in What-If Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
