import React from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import { CustomerProfileInput, DemoProfileItem } from '../../types/index.js';

interface DemoProfileSelectorProps {
  profiles: DemoProfileItem[];
  onSelectProfile: (data: CustomerProfileInput, name: string) => void;
}

export const DemoProfileSelector: React.FC<DemoProfileSelectorProps> = ({
  profiles,
  onSelectProfile
}) => {
  if (!profiles || profiles.length === 0) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-fintech-50 via-sky-50 to-indigo-50 border border-fintech-200/80 rounded-xl p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-fintech-600 text-white rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Quick Test: Load Demo Customer Profile</span>
              <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-fintech-100 text-fintech-700">
                1-Click Preset
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Select a pre-configured profile to test the rule engine instantly without typing:
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            defaultValue=""
            onChange={(e) => {
              const selected = profiles.find((p) => p.id === e.target.value);
              if (selected) {
                onSelectProfile(selected.data, selected.name);
                e.target.value = '';
              }
            }}
            className="w-full sm:w-auto text-xs font-medium bg-white text-slate-800 border border-fintech-300 rounded-lg px-3 py-2 shadow-xs hover:border-fintech-500 focus:outline-hidden focus:ring-2 focus:ring-fintech-500 cursor-pointer"
          >
            <option value="" disabled>
              ⚡ Choose a Sample Scenario...
            </option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.scenarioType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick profile chips for fast tapping */}
      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-fintech-200/60">
        {profiles.slice(0, 4).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectProfile(p.data, p.name)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-white/90 hover:bg-white text-slate-700 border border-slate-200 hover:border-fintech-400 rounded-md shadow-3xs transition-all cursor-pointer"
          >
            <UserCheck className="w-3 h-3 text-fintech-600" />
            <span>{p.name.split(' ')[0]} ({p.scenarioType})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
