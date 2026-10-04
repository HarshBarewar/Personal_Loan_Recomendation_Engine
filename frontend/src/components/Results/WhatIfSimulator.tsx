import React, { useState, useEffect } from 'react';
import { formatINR, formatPercent } from '../../utils/formatters.js';
import { SlidersHorizontal, Calculator, TrendingDown, ArrowRightLeft, Sparkles } from 'lucide-react';

interface WhatIfSimulatorProps {
  initialAmount: number;
  initialRate: number;
  initialTenure: number;
  monthlyIncome: number;
  existingMonthlyEmi: number;
  maxAffordableEmi: number;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialAmount,
  initialRate,
  initialTenure,
  monthlyIncome,
  existingMonthlyEmi,
  maxAffordableEmi
}) => {
  const [simAmount, setSimAmount] = useState<number>(initialAmount);
  const [simRate, setSimRate] = useState<number>(initialRate);
  const [simTenure, setSimTenure] = useState<number>(initialTenure);

  useEffect(() => {
    setSimAmount(initialAmount);
    setSimRate(initialRate);
    setSimTenure(initialTenure);
  }, [initialAmount, initialRate, initialTenure]);

  // Standard EMI calculation formula
  const calculateSimEmi = (p: number, r: number, n: number): number => {
    if (p <= 0 || n <= 0) return 0;
    if (r <= 0) return p / n;
    const monthlyRate = r / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, n);
    return (p * monthlyRate * factor) / (factor - 1);
  };

  const currentEmi = calculateSimEmi(simAmount, simRate, simTenure);
  const totalInterest = Math.max(0, currentEmi * simTenure - simAmount);
  const totalPayable = simAmount + totalInterest;
  const proposedDti = monthlyIncome > 0 ? ((existingMonthlyEmi + currentEmi) / monthlyIncome) * 100 : 0;
  const isEmiExceedingCeiling = maxAffordableEmi > 0 && currentEmi > maxAffordableEmi;

  // Compare Tradeoffs: Shorter vs Longer tenure with same amount and rate
  const shorterTenure = Math.max(12, simTenure - 12);
  const shorterEmi = calculateSimEmi(simAmount, simRate, shorterTenure);
  const shorterInterest = Math.max(0, shorterEmi * shorterTenure - simAmount);

  const longerTenure = Math.min(84, simTenure + 12);
  const longerEmi = calculateSimEmi(simAmount, simRate, longerTenure);
  const longerInterest = Math.max(0, longerEmi * longerTenure - simAmount);

  const interestSavingsFromShorter = totalInterest - shorterInterest;
  const emiSavingsFromLonger = currentEmi - longerEmi;

  return (
    <div id="what-if-simulator" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-fintech-50 text-fintech-600 rounded-xl">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Interactive "What-If" Loan Simulator</h3>
            <p className="text-xs text-slate-500">
              Adjust loan terms in real time to simulate repayment changes and interest trade-offs
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSimAmount(initialAmount);
            setSimRate(initialRate);
            setSimTenure(initialTenure);
          }}
          className="text-xs font-semibold text-fintech-600 hover:text-fintech-700 cursor-pointer self-start sm:self-auto"
        >
          Reset to Recommendation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Loan Principal Amount</span>
              <span className="text-base font-extrabold text-fintech-600">{formatINR(simAmount)}</span>
            </div>
            <input
              type="range"
              min={25000}
              max={2500000}
              step={25000}
              value={simAmount}
              onChange={(e) => setSimAmount(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fintech-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>₹25,000</span>
              <span>₹10,00,000</span>
              <span>₹25,00,000</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Repayment Tenure</span>
              <span className="text-base font-extrabold text-slate-900">{simTenure} Months ({(simTenure / 12).toFixed(1)} yrs)</span>
            </div>
            <input
              type="range"
              min={12}
              max={84}
              step={6}
              value={simTenure}
              onChange={(e) => setSimTenure(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fintech-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>12 Months</span>
              <span>36 Months</span>
              <span>60 Months</span>
              <span>84 Months</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Simulated Interest Rate</span>
              <span className="text-base font-extrabold text-slate-900">{formatPercent(simRate)} p.a.</span>
            </div>
            <input
              type="range"
              min={9.5}
              max={20.0}
              step={0.25}
              value={simRate}
              onChange={(e) => setSimRate(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fintech-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>9.50% (Prime)</span>
              <span>14.00% (Standard)</span>
              <span>20.00% (High Risk)</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div className="space-y-4">
            <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 flex items-center justify-between">
              <span>Simulated Monthly Payment</span>
              <Calculator className="w-4 h-4 text-fintech-400" />
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-fintech-400 tracking-tight">
                {formatINR(currentEmi)}
                <span className="text-xs font-normal text-slate-400"> / month</span>
              </div>

              {isEmiExceedingCeiling ? (
                <p className="text-xs text-rose-300 mt-1.5 font-medium flex items-center gap-1">
                  ⚠️ Exceeds safe EMI ceiling ({formatINR(maxAffordableEmi)})
                </p>
              ) : (
                <p className="text-xs text-emerald-400 mt-1.5 font-medium flex items-center gap-1">
                  ✓ Fits within assessed monthly headroom
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-700/80 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Total Interest Payable:</span>
                <strong className="text-white font-bold">{formatINR(totalInterest)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Amount to Repay:</span>
                <strong className="text-white font-bold">{formatINR(totalPayable)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Simulated Total DTI:</span>
                <strong className={proposedDti > 45 ? 'text-amber-300 font-bold' : 'text-emerald-300 font-bold'}>
                  {proposedDti.toFixed(1)}% {proposedDti > 45 ? '(High)' : '(Healthy)'}
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-[11px] text-slate-400">
            Real-time calculations use exact amortization formulas without server delay.
          </div>
        </div>
      </div>

      {/* Trade-Off Comparison Strip */}
      <div className="mt-4 pt-6 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ArrowRightLeft className="w-4 h-4 text-fintech-600" />
          <span>Tenure Trade-Off Analysis for {formatINR(simAmount)}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shorter Option -> Lower Total Interest */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-emerald-900 flex items-center justify-between">
              <span>Strategy A: Lower Total Interest ({shorterTenure} mos)</span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-slate-600">
              Higher monthly EMI of <strong>{formatINR(shorterEmi)}</strong> saves you approx{' '}
              <strong className="text-emerald-700">{formatINR(interestSavingsFromShorter)} in total interest</strong> over the loan life.
            </p>
          </div>

          {/* Longer Option -> Lower Monthly EMI */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-sky-900 flex items-center justify-between">
              <span>Strategy B: Lower Monthly EMI ({longerTenure} mos)</span>
              <TrendingDown className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-slate-600">
              Lower monthly EMI of <strong>{formatINR(longerEmi)}</strong> reduces monthly cash-flow strain by{' '}
              <strong className="text-sky-700">{formatINR(emiSavingsFromLonger)} / mo</strong>, with higher total interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
