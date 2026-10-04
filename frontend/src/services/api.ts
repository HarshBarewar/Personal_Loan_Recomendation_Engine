import {
  CustomerProfileInput,
  RecommendationResponse,
  LoanProduct,
  DemoProfileItem
} from '../types/index.js';
import { RecommendationOrchestrator } from '../engine/recommendationOrchestrator.js';
import { calculateEmi, calculateTotalInterest } from '../calculations/financialCalculations.js';
import { SEED_LOAN_PRODUCTS, SEED_DEMO_PROFILES } from '../data/seedData.js';

const API_BASE = '/api';

export async function submitRecommendationRequest(
  profile: CustomerProfileInput
): Promise<RecommendationResponse> {
  try {
    const res = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // If backend endpoint is unavailable (e.g., standalone Vercel client deployment)
    // fallback gracefully to deterministic client-side execution
  }

  // Deterministic rule-based execution in browser
  return RecommendationOrchestrator.processProfile(profile, SEED_LOAN_PRODUCTS);
}

export async function fetchLoanProducts(): Promise<LoanProduct[]> {
  try {
    const res = await fetch(`${API_BASE}/loan-products`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) return json.data;
    }
  } catch {
    // Fallback to seeded products
  }
  return SEED_LOAN_PRODUCTS;
}

export async function fetchDemoProfiles(): Promise<DemoProfileItem[]> {
  try {
    const res = await fetch(`${API_BASE}/demo-profiles`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) return json.data;
    }
  } catch {
    // Fallback to seeded demo profiles
  }
  return SEED_DEMO_PROFILES;
}

export async function calculateEmiApi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): Promise<{ monthlyEmi: number; totalInterest: number; totalPayable: number }> {
  try {
    const res = await fetch(`${API_BASE}/calculate-emi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ principal, annualInterestRate, tenureMonths })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Fallback
  }

  const monthlyEmi = calculateEmi(principal, annualInterestRate, tenureMonths);
  const totalInterest = calculateTotalInterest(principal, monthlyEmi, tenureMonths);
  return {
    monthlyEmi,
    totalInterest,
    totalPayable: principal + totalInterest
  };
}
