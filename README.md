# Personal Loan Recommendation Engine

A full-stack, **100% rule-based financial recommendation system** designed to evaluate borrower eligibility, stress-test cash-flow affordability, quantify financial risk, and rank personalized personal loan products with complete transparency.

> **IMPORTANT:**
> This system contains **ZERO machine learning**, **NO neural networks**, **NO `.pkl` files**, and **NO black-box predictive models**. All intelligence is derived from transparent, deterministic financial calculations, configurable business rules, risk scoring rubrics, and multi-lender underwriting policies.

---

## Important Disclaimer

> *"This recommendation engine is a financial decision-support demonstration. Recommendations are based on configurable rules and the information provided by the user. They are not a guarantee of loan approval, interest rates, or lending terms. Actual eligibility and terms depend on the applicable lender's policies and assessment."*

---

## 1. System Features

1. **Deterministic User Journey**:
   - **Landing Page**: Value proposition hero, feature overview, product catalog viewer, and mandatory regulatory disclaimer.
   - **Multi-Step Form**: 6-step form (Personal, Employment, Financial, Credit, Loan Requirement, Pre-Submission Review).
   - **Instant Demo Presets**: 1-click loading of 6 realistic borrower profiles (Prime salaried, Average salaried, Business proprietor, Debt consolidation, Subprime/rebuilder, Education aspirant).
   - **Strict Input Validation**: Dual-layer (frontend and backend via Zod) enforcing age limits (18–65), realistic work experience relative to age, INR amounts, credit scores (300–900), and cash-flow sanity checks.
   - **Financial Health Summary**: Real-time evaluation of disposable cash surplus, existing DTI, proposed DTI, and emergency liquid reserve cushion.
   - **Smart Hard-Rule Filtering**: Filters 10 synthetic lending products by age, income, employment type, loan purpose, and bureau default history.
   - **Risk Scoring Engine (0–100)**: Transparent points breakdown across Credit (40 pts), DTI (20 pts), Employment (15 pts), Payment History (15 pts), and Affordability (10 pts).
   - **Cash-Flow Affordability Engine (0–100)**: Prudent debt-service ceiling (45% DTI standard) and disposable income buffering.
   - **Intelligent Loan Capping & Tenure Optimization**: Safely down-sizes requested amounts and extends tenures if required to keep monthly payments comfortably within applicant affordability limits.
   - **Auditable Explanation Engine**: Generates human-readable, non-contradictory positive reasons and cautionary underwriting adjustment notes.
   - **Ranked Alternative Products**: Displays top 3 alternative eligible loans in desktop comparison tables and mobile cards.
   - **Interactive "What-If" Loan Simulator**: Real-time sliders for loan amount, tenure, and interest rate with instant amortization recalculation and side-by-side Strategy Trade-off analysis ("Lower Monthly EMI" vs "Lower Total Interest").
   - **Indian Numbering (INR ₹) Formatting**: Strict formatting using ₹ symbols and Lakh / Cr notation (e.g. ₹60,000, ₹5,00,000).

---

## 2. Technology Stack

- **Frontend**:
  - React 18 + TypeScript
  - Tailwind CSS + Autoprefixer + PostCSS
  - Lucide React (Fintech UI icons)
  - Vite 6 (Fast bundler & dev server with reverse proxy)
- **Backend**:
  - Node.js 22 + TypeScript
  - Express.js
  - Zod (Schema validation & sanitization)
  - CORS, Dotenv
- **Database**:
  - SQLite using Node 22 built-in `node:sqlite` (`DatabaseSync` - zero native C++ build tool dependencies, reliable, portable)
- **Testing**:
  - Built-in `node:test` and `node:assert` via `tsx`
  - 19 automated test suites covering financial calculations and 10 realistic customer scenarios

---

## 3. Project Structure

```
d:\Loan_engine\
├── backend/
│   ├── src/
│   │   ├── calculations/          # EMI, DTI, Disposable Income, Max Affordable Loan
│   │   │   └── financialCalculations.ts
│   │   ├── engine/                # Rule-based underwriting & scoring engines
│   │   │   ├── eligibilityEngine.ts
│   │   │   ├── riskScoringEngine.ts
│   │   │   ├── affordabilityEngine.ts
│   │   │   ├── rateAndTenureEngine.ts
│   │   │   ├── recommendationRankingEngine.ts
│   │   │   ├── explanationEngine.ts
│   │   │   └── recommendationOrchestrator.ts
│   │   ├── controllers/           # REST Controllers
│   │   ├── routes/                # API router
│   │   ├── services/              # Recommendation & Product services
│   │   ├── repositories/          # SQLite repository queries
│   │   ├── database/              # Schema, connection, seed data
│   │   ├── middleware/            # Zod validation & global error handler
│   │   ├── types/                 # Shared TypeScript models
│   │   ├── app.ts                 # Express factory
│   │   └── server.ts              # Server bootstrap & DB seeder
│   ├── tests/
│   │   ├── calculations.test.ts   # Mathematical formula verification
│   │   └── scenarios.test.ts      # 10 realistic user test scenarios
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Badge, ProgressBar, MetricCard
│   │   │   ├── MultiStepForm/     # Stepper, Steps 1-6, Demo presets
│   │   │   ├── Results/           # Recommendation card, What-If simulator, alternatives
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LandingHero.tsx
│   │   │   ├── FeatureCards.tsx
│   │   │   └── DisclaimerBanner.tsx
│   │   ├── services/api.ts        # Fetch API service
│   │   ├── utils/formatters.ts    # Indian currency (INR ₹) formatting
│   │   ├── types/index.ts         # TypeScript definitions
│   │   ├── App.tsx                # Master state and view coordinator
│   │   └── main.tsx               # Entry point
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── ARCHITECTURE.md            # Architecture diagram & design overview
│   └── BUSINESS_RULES.md          # Comprehensive underwriting rule specification
├── package.json                   # Root workspace scripts
└── README.md
```

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js version 22.x or higher
- npm 10.x or higher

### Step 1: Install Dependencies
From the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### Step 2: Seed Database
The SQLite database (`backend/loan_engine.sqlite`) seeds automatically on backend startup. To run the seed script manually:
```bash
cd backend
npm run seed
```

### Step 3: Run Automated Test Suite
To verify all 19 unit tests and scenario suites:
```bash
cd backend
npm test
```
All 19 tests will execute and verify:
- EMI Amortization calculations
- Zero interest edge cases
- Negative/Zero principal handling
- DTI and proposed DTI ratios
- Disposable income calculation
- Affordable EMI caps
- Max loan principal calculation from EMI
- All 10 customer scenarios (Prime, Average, High Risk, Debt Consolidation, Low Income, Capped Large Loan, Defaults, Zero Debt, Expense > Income, Subprime No Match).

### Step 4: Run the Application
In terminal 1 (start backend API on port 5000):
```bash
cd backend
npm start
```

In terminal 2 (start frontend web interface on port 3000):
```bash
cd frontend
npm run dev -- --port 3000
```
Open your browser at:
`http://localhost:3000`

---

## 5. API Documentation

### 5.1 POST `/api/recommendations`
Generates full personal loan recommendation, financial health assessment, risk categorization, explanations, and alternative products.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "age": 32,
  "gender": "Female",
  "maritalStatus": "Married",
  "dependents": 1,
  "education": "Post Graduate",
  "residenceType": "Owned",
  "cityTier": "Tier 1",
  "employmentType": "Salaried",
  "experienceYears": 7,
  "monthlyIncome": 85000,
  "monthlyExpenses": 28000,
  "existingLoanAmount": 150000,
  "existingMonthlyEmi": 8000,
  "existingLoanCount": 1,
  "savingsBalance": 300000,
  "bankAccountAgeYears": 6,
  "creditScore": 780,
  "creditHistoryYears": 6,
  "latePaymentCount": 0,
  "creditUtilizationRatio": 18,
  "previousLoanCount": 2,
  "previousLoanDefaultCount": 0,
  "loanPurpose": "Home Renovation",
  "requestedAmount": 500000,
  "preferredTenureMonths": 36
}
```
- **Response**:
```json
{
  "status": "success",
  "financial_summary": {
    "monthly_income": 85000,
    "monthly_expenses": 28000,
    "existing_emi": 8000,
    "disposable_income": 49000,
    "existing_dti": 9.41,
    "savings_to_income_ratio": 3.53,
    "is_financially_constrained": false
  },
  "risk": {
    "score": 99,
    "category": "Low",
    "summary": "Financial risk evaluated as Low Risk (99/100)"
  },
  "affordability": {
    "score": 100,
    "category": "Highly Affordable",
    "maximum_new_emi": 30250,
    "max_affordable_loan": 1145000
  },
  "recommendation": {
    "product_id": "prod_low_interest",
    "product_name": "Demo Prime Low-Interest Personal Loan",
    "lender_name": "Demo Prime Capital",
    "loan_type": "Low Interest Personal Loan",
    "description": "Lowest interest rates crafted for salaried professionals...",
    "amount": 500000,
    "interest_rate": 9.75,
    "tenure_months": 36,
    "emi": 16074.97,
    "total_interest": 78698.92,
    "total_payment": 578698.92,
    "processing_fee_amount": 5000,
    "proposed_dti": 28.32,
    "recommendation_score": 98.4
  },
  "reasons": [
    "Your credit score of 780 is in the excellent range...",
    "Your existing EMI obligations represent only 9.4% of your monthly income...",
    "The full requested amount of ₹5,00,000 fits comfortably within your capacity...",
    "This product provides the lowest personalized interest rate (9.75% p.a.)"
  ],
  "alternatives": [ ... ],
  "ineligible_products_count": 4,
  "timestamp": "2026-10-04T05:03:37.461Z"
}
```

### 5.2 GET `/api/loan-products`
Returns all 10 active demonstration loan products.

### 5.3 GET `/api/loan-products/:id`
Returns product metadata by product ID.

### 5.4 POST `/api/calculate-emi`
Pure amortization calculator:
- Request: `{ "principal": 500000, "annualInterestRate": 11.5, "tenureMonths": 36 }`
- Response: `{ "status": "success", "data": { "monthlyEmi": 16488, "totalInterest": 93568, "totalPayable": 593568 } }`

### 5.5 POST `/api/calculate-affordability`
Returns disposable income, safe debt-service headroom, and maximum affordable principal.

### 5.6 GET `/api/rules`
Returns all configurable business rules and active parameters.

### 5.7 GET `/api/demo-profiles`
Returns the 6 pre-configured realistic customer profiles.

---

## 6. Configurable Business Rules

Business rules are stored in the `business_rules` table and can be modified directly or queried via `/api/rules`:
- **Recommendation Risk Weights**:
  - Credit Score: 40 points
  - DTI Ratio: 20 points
  - Employment Stability: 15 points
  - Payment History & Defaults: 15 points
  - Affordability / Savings Cushion: 10 points
- **Recommendation Ranking Formula**:
  $$\text{Score} = (0.30 \times S_{\text{affordability}}) + (0.25 \times S_{\text{rate}}) + (0.20 \times S_{\text{fit}}) + (0.15 \times S_{\text{amount}}) + (0.10 \times S_{\text{tenure}})$$
- **Maximum Prudent Debt Service Ratio**: 45% (configurable up to 65% for debt consolidation products).

---

## 7. Synthetic Loan Products Catalog

The engine comes seeded with 10 synthetic demonstration products:
1. **Demo Finance Standard Personal Loan**: Balanced general purpose loan (₹50k–₹15L, 11.5%–16.5%).
2. **Demo Prime Low-Interest Personal Loan**: Lowest interest for salaried borrowers with 740+ credit score (₹1L–₹25L, 9.75%–12.0%).
3. **Demo Elite Premium Personal Loan**: High-ticket loans up to 84 months for affluent earners (₹3L–₹40L, 10.25%–13.5%).
4. **Demo Flexi-Choice Personal Loan**: Relaxed criteria for freelancers and credit scores 600+ (₹30k–₹8L, 13.0%–19.5%).
5. **Demo Relief Debt Consolidation Loan**: Higher DTI allowance (up to 65%) for consolidating debts (₹1L–₹20L, 11.25%–15.0%).
6. **Demo Swift Emergency Personal Loan**: Rapid liquidity for medical and emergency needs (₹25k–₹5L, 12.5%–18.0%).
7. **Demo Express Short-Term Personal Loan**: Quick bridge financing for 12–24 months (₹20k–₹3L, 12.0%–17.5%).
8. **Demo Vidya Education Support Loan**: Specialized financing for tuition and course fees (₹50k–₹20L, 10.5%–13.5%).
9. **Demo Griha Home Improvement Loan**: Renovations and repairs with tenures up to 84 months (₹1L–₹30L, 10.75%–14.0%).
10. **Demo Udyam Business Growth Personal Loan**: Working capital facility for business proprietors (₹1.5L–₹35L, 12.0%–17.0%).
