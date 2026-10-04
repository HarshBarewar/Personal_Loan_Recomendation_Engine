# System Architecture & Technical Design

The **Personal Loan Recommendation Engine** is engineered as a full-stack, modular, rule-based fintech web application.

---

## 1. High-Level Architecture

```
User Browser (React + TypeScript + Tailwind)
                  ↓  HTTP REST API
Backend Express Server (TypeScript on Node.js 22)
       │
       ├── Middleware (Validation / Sanitization / Error Handling)
       ├── API Routes & Controllers
       ├── Services Layer
       │       ↓
       ├── Business Engines:
       │       ├── Financial Calculations (Amortization, DTI, Disposable Income)
       │       ├── Eligibility Engine (Hard Constraint Filtering)
       │       ├── Risk Scoring Engine (Multi-Factor Scoring 0–100)
       │       ├── Affordability Engine (Cash-Flow & Headroom Capacity)
       │       ├── Rate & Tenure Optimization Engine
       │       ├── Recommendation Ranking Engine (Composite Weighted Fit)
       │       └── Explanation Engine (Auditable Rationale Generator)
       │       ↓
       ├── Repositories (Data Access Layer)
       │       ↓
       └── SQLite Database (node:sqlite synchronous driver)
```

---

## 2. Directory Structure

```
d:\Loan_engine\
├── backend/
│   ├── src/
│   │   ├── calculations/          # Pure mathematical financial calculations
│   │   │   └── financialCalculations.ts
│   │   ├── engine/                # Core rule-based intelligence engines
│   │   │   ├── eligibilityEngine.ts
│   │   │   ├── riskScoringEngine.ts
│   │   │   ├── affordabilityEngine.ts
│   │   │   ├── rateAndTenureEngine.ts
│   │   │   ├── recommendationRankingEngine.ts
│   │   │   ├── explanationEngine.ts
│   │   │   └── recommendationOrchestrator.ts
│   │   ├── controllers/           # HTTP Request handlers
│   │   ├── routes/                # Express API routes
│   │   ├── services/              # Orchestration services
│   │   ├── repositories/          # SQLite database query abstraction
│   │   ├── database/              # Schema, connection, seed data
│   │   ├── middleware/            # Zod validation, error handler
│   │   ├── types/                 # Shared data contracts
│   │   ├── app.ts                 # Express app factory
│   │   └── server.ts              # Server bootstrap and entrypoint
│   ├── tests/                     # 19 Automated unit & scenario tests
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Badge, ProgressBar, MetricCard
│   │   │   ├── MultiStepForm/     # Stepper, 6 Step Forms, Demo Presets
│   │   │   ├── Results/           # Recommendation Card, Health, Alternatives, What-If Simulator
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LandingHero.tsx
│   │   │   ├── FeatureCards.tsx
│   │   │   └── DisclaimerBanner.tsx
│   │   ├── services/api.ts        # API client
│   │   ├── utils/formatters.ts    # Indian numbering (INR ₹) formatters
│   │   ├── types/index.ts         # TypeScript models
│   │   ├── App.tsx                # Main application view manager
│   │   ├── main.tsx               # React DOM bootstrap
│   │   └── index.css              # Tailwind base & utilities
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── docs/
│   ├── ARCHITECTURE.md
│   └── BUSINESS_RULES.md
│
├── package.json                   # Root orchestrator scripts
└── README.md                      # Comprehensive developer guide
```

---

## 3. Database Schema

### Table: `loan_products`
Stores active synthetic loan products, criteria, and rate parameters.
- `id` (TEXT PRIMARY KEY)
- `product_name` (TEXT)
- `lender_name` (TEXT)
- `loan_type` (TEXT)
- `description` (TEXT)
- `min_age`, `max_age` (INTEGER)
- `min_monthly_income` (REAL)
- `min_credit_score` (INTEGER)
- `max_dti` (REAL)
- `min_loan_amount`, `max_loan_amount` (REAL)
- `min_tenure_months`, `max_tenure_months` (INTEGER)
- `base_interest_rate`, `min_interest_rate`, `max_interest_rate` (REAL)
- `processing_fee`, `processing_fee_type` (REAL, TEXT)
- `allowed_employment_types` (TEXT, JSON array)
- `allowed_purposes` (TEXT, JSON array)
- `active` (INTEGER)

### Table: `business_rules`
Stores configurable underwriting parameters and ranking weights.
- `id` (TEXT PRIMARY KEY)
- `rule_name` (TEXT)
- `rule_category` (TEXT)
- `parameter` (TEXT)
- `value` (TEXT)
- `description` (TEXT)
- `priority` (INTEGER)
- `active` (INTEGER)

### Table: `recommendations`
Stores generated recommendation audits without sensitive PII.
- `id` (TEXT PRIMARY KEY)
- `session_id` (TEXT)
- `timestamp` (TEXT)
- `risk_category`, `risk_score` (TEXT, REAL)
- `affordability_score`, `affordability_category` (REAL, TEXT)
- `recommended_product_id`, `recommended_product_name` (TEXT)
- `recommended_amount`, `recommended_rate`, `recommended_tenure` (REAL, REAL, INTEGER)
- `recommended_emi`, `total_interest` (REAL, REAL)
- `input_summary`, `reasons` (TEXT, JSON strings)
