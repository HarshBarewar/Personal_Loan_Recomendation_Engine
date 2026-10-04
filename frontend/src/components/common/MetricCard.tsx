import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  icon,
  trend = 'neutral',
  tooltip
}) => {
  const trendColor = {
    positive: 'text-emerald-600',
    negative: 'text-rose-600',
    neutral: 'text-slate-500'
  }[trend];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500" title={tooltip}>
          {title}
        </span>
        {icon && <div className="p-2 rounded-lg bg-slate-50 text-slate-600">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
      {subValue && <div className={`text-xs mt-1.5 font-medium ${trendColor}`}>{subValue}</div>}
    </div>
  );
};
