import React from 'react';
import { LoanProduct } from '../types/index.js';
import { formatINR, formatPercent } from '../utils/formatters.js';
import { X, Layers, ShieldCheck, Check } from 'lucide-react';

interface ProductCatalogModalProps {
  products: LoanProduct[];
  isOpen: boolean;
  onClose: () => void;
  onSelectForApplication?: () => void;
}

export const ProductCatalogModal: React.FC<ProductCatalogModalProps> = ({
  products,
  isOpen,
  onClose,
  onSelectForApplication
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-fintech-50 text-fintech-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Demonstration Loan Product Catalog</h3>
              <p className="text-xs text-slate-500">Configured synthetic lending products evaluated by the engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto divide-y divide-slate-100 py-4 space-y-4 pr-1">
          {products.map((p) => (
            <div key={p.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{p.product_name}</h4>
                  <span className="text-xs text-slate-500">{p.lender_name} • {p.loan_type}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400">Interest Rate Band:</span>
                  <div className="text-sm font-extrabold text-fintech-600">
                    {formatPercent(p.min_interest_rate)} – {formatPercent(p.max_interest_rate)} p.a.
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400 block">Loan Amount Range:</span>
                  <strong>{formatINR(p.min_loan_amount)} – {formatINR(p.max_loan_amount)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Min Monthly Income:</span>
                  <strong>{formatINR(p.min_monthly_income)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Min Credit Score:</span>
                  <strong>{p.min_credit_score}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Max Allowed DTI:</span>
                  <strong>{p.max_dti}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>All 10 products use transparent, deterministic rule evaluation.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
