import React from 'react';
import { Landmark, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onBrowseProducts: () => void;
  isFormOrResults: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onBrowseProducts, isFormOrResults }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group transition-opacity hover:opacity-90"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fintech-700 to-fintech-500 flex items-center justify-center text-white shadow-md shadow-fintech-500/20">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-fintech-600 transition-colors">
                LoanEngine
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3 h-3" /> Rule-Based Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">Personal Loan Recommendation & Eligibility System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBrowseProducts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-fintech-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Browse Products</span>
          </button>

          {isFormOrResults && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
