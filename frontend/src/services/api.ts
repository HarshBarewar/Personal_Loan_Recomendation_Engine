import {
  CustomerProfileInput,
  RecommendationResponse,
  LoanProduct,
  DemoProfileItem
} from '../types/index.js';

const API_BASE = '/api';

export async function submitRecommendationRequest(
  profile: CustomerProfileInput
): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const message =
      errorJson.message ||
      (errorJson.fieldErrors
        ? Object.entries(errorJson.fieldErrors)
            .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`)
            .join(' | ')
        : 'Failed to process recommendation request.');
    throw new Error(message);
  }

  return res.json();
}

export async function fetchLoanProducts(): Promise<LoanProduct[]> {
  const res = await fetch(`${API_BASE}/loan-products`);
  if (!res.ok) throw new Error('Failed to load loan products');
  const json = await res.json();
  return json.data;
}

export async function fetchDemoProfiles(): Promise<DemoProfileItem[]> {
  const res = await fetch(`${API_BASE}/demo-profiles`);
  if (!res.ok) throw new Error('Failed to load demo customer profiles');
  const json = await res.json();
  return json.data;
}

export async function calculateEmiApi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): Promise<{ monthlyEmi: number; totalInterest: number; totalPayable: number }> {
  const res = await fetch(`${API_BASE}/calculate-emi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ principal, annualInterestRate, tenureMonths })
  });

  if (!res.ok) throw new Error('Failed to calculate EMI');
  const json = await res.json();
  return json.data;
}
