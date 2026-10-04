# Business Rules and Underwriting Logic Reference

This document explains the transparent, deterministic underwriting logic, scoring weights, financial formulas, and configurable parameters used by the **Personal Loan Recommendation Engine**.

---

## 1. Zero Machine Learning Policy
- **No Machine Learning or Neural Networks**: All intelligence is derived from financial mathematics, risk underwriting rules, and policy configurations.
- **No `.pkl` or Serialized Weights**: Every decision is explainable, repeatable, auditable, and traceable to specific inputs and parameters.
- **No Training Pipeline**: Does not rely on statistical correlations or bias-prone historical sanction data.

---

## 2. Configurable Business Rules (`business_rules` Table)

| Rule ID | Parameter | Category | Default Value | Description |
|---|---|---|---|---|
| `rule_risk_credit_score_weight` | `credit_score_weight` | `risk_scoring` | `40` | Maximum points contributed by credit score to the 0–100 Risk Score |
| `rule_risk_dti_weight` | `dti_weight` | `risk_scoring` | `20` | Maximum points contributed by existing DTI ratio |
| `rule_risk_emp_weight` | `employment_stability_weight` | `risk_scoring` | `15` | Maximum points contributed by job stability and experience |
| `rule_risk_payment_history_weight` | `payment_history_weight` | `risk_scoring` | `15` | Maximum points contributed by clean payment track and zero defaults |
| `rule_risk_affordability_weight` | `affordability_weight` | `risk_scoring` | `10` | Maximum points contributed by disposable cash cushion and savings |
| `rule_rank_affordability_weight` | `weight_affordability` | `ranking` | `0.30` | Weight (30%) assigned to affordability fit in composite ranking score |
| `rule_rank_interest_rate_weight` | `weight_interest_rate` | `ranking` | `0.25` | Weight (25%) assigned to low interest rate advantage |
| `rule_rank_product_fit_weight` | `weight_product_fit` | `ranking` | `0.20` | Weight (20%) assigned to stated purpose and applicant segment fit |
| `rule_rank_amount_fit_weight` | `weight_amount_fit` | `ranking` | `0.15` | Weight (15%) assigned to requested amount satisfaction |
| `rule_rank_tenure_fit_weight` | `weight_tenure_fit` | `ranking` | `0.10` | Weight (10%) assigned to requested tenure match |
| `rule_affordability_max_dti` | `max_dti_ratio` | `affordability` | `45.0` | Maximum allowable total EMI as percentage of monthly income |

---

## 3. Financial Calculations

### 3.1 Equated Monthly Installment (EMI)
Calculated using the standard amortizing annuity formula:
$$\text{EMI} = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$$
Where:
- $P$ = Principal loan amount in INR (₹)
- $r$ = Monthly interest rate: $\frac{\text{Annual Rate \%}}{12 \cdot 100}$
- $n$ = Tenure in months

**Edge Cases:**
- If $r = 0$, $\text{EMI} = \frac{P}{n}$
- If $P \le 0$ or $n \le 0$, $\text{EMI} = 0$

### 3.2 Total Interest Payable
$$\text{Total Interest} = (\text{EMI} \times n) - P$$

### 3.3 Debt-to-Income (DTI) Ratios
- **Existing DTI**:
  $$\text{Existing DTI} = \left(\frac{\text{Existing Monthly EMI}}{\text{Monthly Income}}\right) \times 100$$
- **Proposed Total DTI**:
  $$\text{Proposed DTI} = \left(\frac{\text{Existing Monthly EMI} + \text{Recommended EMI}}{\text{Monthly Income}}\right) \times 100$$

### 3.4 Disposable Cash Surplus
$$\text{Disposable Income} = \text{Monthly Income} - \text{Monthly Expenses} - \text{Existing EMI}$$

### 3.5 Maximum Affordable New EMI
1. **Debt-Service Capacity**:
   $$\text{Max EMI}_{\text{dti}} = \max(0, (\text{Monthly Income} \times 0.45) - \text{Existing Monthly EMI})$$
2. **Cash-Flow Buffer Capacity**:
   $$\text{Max EMI}_{\text{disposable}} = \max(0, \text{Disposable Income} \times 0.85)$$
3. **Effective Cap**:
   $$\text{Max New EMI} = \min(\text{Max EMI}_{\text{dti}}, \text{Max EMI}_{\text{disposable}})$$

---

## 4. Eligibility Engine (Hard Rules vs Soft Rules)

For every loan product in the database, the engine evaluates strict hard constraints:
1. **Age Constraint**: Applicant age must fall between `min_age` and `max_age`.
2. **Income Constraint**: Monthly income $\ge$ `min_monthly_income`.
3. **Credit Score Constraint**: Credit score $\ge$ `min_credit_score`.
4. **Employment Eligibility**: Applicant's employment type must belong to the product's `allowed_employment_types` list.
5. **Purpose Eligibility**: Applicant's loan purpose must belong to `allowed_purposes`.
6. **Debt-to-Income Constraint**: Existing DTI must not exceed `product.max_dti` (with exception for Debt Consolidation loans where purpose is debt restructuring).
7. **Credit Default Policy**: Prime and low-interest products disallow any past defaults (`previousLoanDefaultCount == 0`).
8. **Late Payment Tolerance**: Over 4 late payment incidents eliminates prime loan products.

Any product failing a hard rule is filtered out, with the exact violation recorded in `ineligible_reasons_summary`.

---

## 5. Recommendation Risk Scoring Engine (0–100)

Total Points: **100**
- **Credit Score (up to 40 points)**:
  - $\ge 780$: 40 pts
  - $740 - 779$: 35 pts
  - $700 - 739$: 30 pts
  - $650 - 699$: 22 pts
  - $600 - 649$: 14 pts
  - $< 600$: 5 pts
- **DTI Ratio (up to 20 points)**:
  - $\le 15\%$: 20 pts
  - $16\% - 30\%$: 16 pts
  - $31\% - 40\%$: 12 pts
  - $41\% - 50\%$: 7 pts
  - $> 50\%$: 2 pts
- **Employment Stability (up to 15 points)**:
  - Base Experience: $\ge 5$ yrs (10 pts), $3-4$ yrs (8 pts), $1-2$ yrs (5 pts), $< 1$ yr (2 pts)
  - Type Bonus: Government (+5 pts), Salaried (+4 pts), Business Owner (+3 pts), Self-Employed (+2 pts), Freelancer (+1 pt)
- **Payment History (up to 15 points)**:
  - 15 base points
  - Late payments penalty: $-3$ per incident (up to $-9$ pts)
  - Past defaults penalty: $-7$ per incident (up to $-10$ pts)
  - High utilization penalty ($> 70\%$): $-3$ pts
- **Affordability & Savings Buffer (up to 10 points)**:
  - Emergency savings $\ge 3$ months of expenses: 10 pts
  - Emergency savings $1 - 2$ months: 7 pts
  - Positive disposable flow: 4 pts
  - Minimal savings: 1 pt

### Risk Categories:
- **80 – 100**: Low Risk
- **60 – 79**: Medium Risk
- **40 – 59**: High Risk
- **0 – 39**: Very High Risk

---

## 6. Recommended Loan Amount Logic
$$\text{Recommended Amount} = \min(\text{Product Max Amount}, \text{Requested Amount}, \text{Affordable Amount}, \text{Risk-Adjusted Amount})$$
- Low Risk multiplier: $100\%$ of affordable capacity
- Medium Risk multiplier: $90\%$
- High Risk multiplier: $75\%$
- Very High Risk multiplier: $50\%$
- Result is rounded down to nearest ₹5,000 for standard banking sanction increments.

If the requested amount exceeds the affordable limit, the engine recommends the safe amount and produces an explicit explanation.

---

## 7. Dynamic Interest Rate Selection
Within each product's `[min_interest_rate, max_interest_rate]` band:
- **Low Risk**: Positioned in lower quartile: $\text{min\_rate} + (\text{band} \times 0.20)$
- **Medium Risk**: Positioned at product base rate
- **High Risk**: Positioned in upper quartile: $\text{base\_rate} + ((\text{max\_rate} - \text{base\_rate}) \times 0.60)$
- **Very High Risk**: Positioned at maximum interest rate
- **Credit Score Fine-Tuning**:
  - Score $\ge 780$: $-0.50\%$ prime discount
  - Score $740 - 779$: $-0.25\%$ good credit discount
  - Score $< 640$: $+0.50\%$ subprime surcharge
Clamped strictly within product boundaries.

---

## 8. Recommendation Ranking Formula
$$\text{Score} = (0.30 \times S_{\text{affordability}}) + (0.25 \times S_{\text{rate}}) + (0.20 \times S_{\text{fit}}) + (0.15 \times S_{\text{amount}}) + (0.10 \times S_{\text{tenure}})$$
All sub-scores normalized to $0 - 100$.
Top scoring product is selected as the primary recommendation; subsequent high scorers are presented as alternatives.
