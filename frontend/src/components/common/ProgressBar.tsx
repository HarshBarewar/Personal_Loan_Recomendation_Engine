import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  color?: 'emerald' | 'sky' | 'indigo' | 'amber' | 'rose' | 'fintech';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'fintech',
  height = 'md',
  showLabel = false,
  label
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const colorStyles = {
    emerald: 'bg-emerald-500',
    sky: 'bg-sky-500',
    indigo: 'bg-indigo-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    fintech: 'bg-fintech-600'
  }[color];

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }[height];

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-slate-600">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightStyles}`}>
        <div
          className={`${colorStyles} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
