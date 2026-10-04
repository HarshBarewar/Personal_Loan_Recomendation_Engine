import React from 'react';
import { ShieldAlert, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200">100% Deterministic & Rule-Based</h4>
              <p className="text-xs text-slate-400 mt-1">
                Zero machine learning or black-box predictive models. Every calculation follows transparent financial formulas and verified business rules.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-fintech-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200">Mathematical Precision</h4>
              <p className="text-xs text-slate-400 mt-1">
                Exact amortization schedules, multi-factor risk categorization, and debt-service constraints computed in real time.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200">Privacy & Security First</h4>
              <p className="text-xs text-slate-400 mt-1">
                No personal identifiable credentials (PII) stored. Built as a secure, sandboxed financial decision-support tool.
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Important Financial Disclaimer</span>
          </div>
          <p>
            This recommendation engine is a financial decision-support demonstration. Recommendations are based on configurable rules and the information provided by the user. They are not a guarantee of loan approval, interest rates, or lending terms. Actual eligibility and terms depend on the applicable lender's policies and assessment.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Personal Loan Recommendation Engine. Production-Grade Portfolio System.</p>
          <div className="flex items-center gap-6">
            <span>Transparent Decision Architecture</span>
            <span>Indian Financial Norms (INR ₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
