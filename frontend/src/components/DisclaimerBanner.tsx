import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div
      className={`rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-900 ${
        compact ? 'p-3 text-xs' : 'p-4 text-xs sm:text-sm'
      } flex items-start gap-3 shadow-xs`}
    >
      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-950">Important Notice & Disclaimer</p>
        <p className="text-amber-800/90 mt-0.5 leading-relaxed">
          This tool provides estimates and recommendations based on the information you provide. It does not guarantee loan approval or lending terms. All calculations are produced using transparent deterministic financial rules.
        </p>
      </div>
    </div>
  );
};
