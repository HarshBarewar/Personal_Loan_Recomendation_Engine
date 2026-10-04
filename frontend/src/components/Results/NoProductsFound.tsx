import React from 'react';
import { RecommendationResponse } from '../../types/index.js';
import { ShieldX, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';

interface NoProductsFoundProps {
  response: RecommendationResponse;
  onModifyProfile: () => void;
}

export const NoProductsFound: React.FC<NoProductsFoundProps> = ({ response, onModifyProfile }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
        <ShieldX className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          We Couldn't Find a Suitable Loan Option
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Based on the transparent underwriting criteria of the available loan products, your current financial or credit metrics did not meet the mandatory entry thresholds.
        </p>
      </div>

      {/* Main Factors Preventing Match */}
      <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200/80 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Key Factors Preventing a Recommendation</span>
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          {response.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>

        {response.cautionary_notes && response.cautionary_notes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Recommendations for Future Eligibility:</span>
            {response.cautionary_notes.map((note, i) => (
              <p key={i}>✓ {note}</p>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={onModifyProfile}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-fintech-600 hover:bg-fintech-700 text-white font-semibold text-sm shadow-md shadow-fintech-600/20 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Adjust Financial Profile & Re-evaluate</span>
        </button>
      </div>
    </div>
  );
};
