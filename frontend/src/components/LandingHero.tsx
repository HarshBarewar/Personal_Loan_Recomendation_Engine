import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, SlidersHorizontal, Calculator } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
  onBrowseProducts: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart, onBrowseProducts }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 text-center">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-fintech-200/50 via-sky-100/40 to-indigo-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* Pill header */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fintech-50 border border-fintech-200 text-fintech-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
        <Cpu className="w-3.5 h-3.5 text-fintech-600" />
        <span>Rule-Based Financial Intelligence</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
        Find the Loan That <span className="text-transparent bg-clip-text bg-gradient-to-r from-fintech-600 to-indigo-600">Fits You</span>
      </h1>

      {/* Supporting text */}
      <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
        Our transparent recommendation engine compares your profile across eligibility rules, debt-to-income affordability, total borrowing costs, and product-fit criteria with zero black-box bias.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onStart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-fintech-600 hover:bg-fintech-700 text-white font-semibold text-base shadow-lg shadow-fintech-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>Get My Recommendation</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onBrowseProducts}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-base shadow-xs transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span>Explore Loan Products</span>
        </button>
      </div>

      {/* Trust badges */}
      <div className="mt-12 pt-8 border-t border-slate-200/70 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Deterministic</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Calculator className="w-4 h-4 text-fintech-600" />
          <span>Precise Amortization</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <span>Transparent Scoring</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>No PII Stored</span>
        </div>
      </div>
    </div>
  );
};
