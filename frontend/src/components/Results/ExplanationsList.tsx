import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface ExplanationsListProps {
  reasons: string[];
  cautionaryNotes?: string[];
}

export const ExplanationsList: React.FC<ExplanationsListProps> = ({
  reasons,
  cautionaryNotes = []
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Why Was This Recommended?</h3>
          <p className="text-xs text-slate-500">
            Transparent breakdown of deterministic underwriting rules and risk factors
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{reason}</span>
          </div>
        ))}

        {cautionaryNotes.map((note, idx) => (
          <div
            key={`caution-${idx}`}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm text-amber-900 leading-relaxed"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-950">Underwriting Adjustment Note: </span>
              <span>{note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
