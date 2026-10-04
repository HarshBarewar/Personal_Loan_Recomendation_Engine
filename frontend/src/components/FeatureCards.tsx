import React from 'react';
import { CheckCircle, PieChart, Award } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 text-emerald-600',
      title: 'Smart Eligibility',
      description:
        'Instantly filters available loan products against multi-lender hard criteria including age limits, employment stability, minimum income thresholds, and credit score guidelines.'
    },
    {
      icon: <PieChart className="w-6 h-6 text-fintech-600" />,
      bg: 'bg-fintech-50 text-fintech-600',
      title: 'Affordability Analysis',
      description:
        'Calculates your true disposable income, existing debt-to-income (DTI) ratio, and maximum safe monthly EMI without risking financial overextension.'
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 text-indigo-600',
      title: 'Personalized Recommendations',
      description:
        'Ranks eligible products through transparent multi-factor scoring (affordability, rate advantage, purpose alignment), pairing each recommendation with clear human-readable explanations.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
      {features.map((feat, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feat.bg}`}>
            {feat.icon}
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
        </div>
      ))}
    </div>
  );
};
