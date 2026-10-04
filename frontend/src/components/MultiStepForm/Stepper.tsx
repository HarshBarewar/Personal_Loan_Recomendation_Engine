import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="w-full mb-8">
      {/* Mobile step label */}
      <div className="sm:hidden flex items-center justify-between mb-3 text-xs font-semibold text-slate-700">
        <span>Step {currentStep} of {steps.length}: <strong className="text-fintech-600">{steps[currentStep - 1]}</strong></span>
        <span className="text-slate-400">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
      </div>

      {/* Mobile progress bar */}
      <div className="sm:hidden w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-fintech-600 h-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-fintech-600 -z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((name, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = onStepClick && stepNumber <= currentStep;

          return (
            <div
              key={index}
              onClick={() => isClickable && onStepClick(stepNumber)}
              className={`flex flex-col items-center z-10 ${isClickable ? 'cursor-pointer group' : 'cursor-default'}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-fintech-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-white border-2 border-fintech-600 text-fintech-600 shadow-md ring-4 ring-fintech-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </div>
              <span
                className={`text-xs mt-2 font-medium tracking-tight whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-fintech-700 font-semibold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
