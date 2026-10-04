import React, { useState, useEffect } from 'react';
import { CustomerProfileInput, RecommendationResponse, LoanProduct, DemoProfileItem } from './types/index.js';
import { submitRecommendationRequest, fetchLoanProducts, fetchDemoProfiles } from './services/api.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { LandingHero } from './components/LandingHero.js';
import { FeatureCards } from './components/FeatureCards.js';
import { DisclaimerBanner } from './components/DisclaimerBanner.js';
import { Stepper } from './components/MultiStepForm/Stepper.js';
import { DemoProfileSelector } from './components/MultiStepForm/DemoProfileSelector.js';
import { Step1Personal } from './components/MultiStepForm/Step1Personal.js';
import { Step2Employment } from './components/MultiStepForm/Step2Employment.js';
import { Step3Financial } from './components/MultiStepForm/Step3Financial.js';
import { Step4Credit } from './components/MultiStepForm/Step4Credit.js';
import { Step5LoanRequirement } from './components/MultiStepForm/Step5LoanRequirement.js';
import { Step6Review } from './components/MultiStepForm/Step6Review.js';
import { PrimaryRecommendationCard } from './components/Results/PrimaryRecommendationCard.js';
import { FinancialHealthSummary } from './components/Results/FinancialHealthSummary.js';
import { ExplanationsList } from './components/Results/ExplanationsList.js';
import { AlternativeProductsTable } from './components/Results/AlternativeProductsTable.js';
import { WhatIfSimulator } from './components/Results/WhatIfSimulator.js';
import { NoProductsFound } from './components/Results/NoProductsFound.js';
import { ProductCatalogModal } from './components/ProductCatalogModal.js';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const INITIAL_FORM_DATA: CustomerProfileInput = {
  age: 30,
  gender: 'Male',
  maritalStatus: 'Single',
  dependents: 0,
  education: 'Graduate',
  residenceType: 'Rented',
  cityTier: 'Tier 1',

  employmentType: 'Salaried',
  experienceYears: 4,
  employerStability: 'High',

  monthlyIncome: 65000,
  monthlyExpenses: 26000,
  existingLoanAmount: 120000,
  existingMonthlyEmi: 7000,
  existingLoanCount: 1,
  savingsBalance: 150000,
  bankAccountAgeYears: 5,

  creditScore: 745,
  creditHistoryYears: 4,
  latePaymentCount: 0,
  creditUtilizationRatio: 22,
  previousLoanCount: 1,
  previousLoanDefaultCount: 0,

  loanPurpose: 'Personal',
  requestedAmount: 400000,
  preferredTenureMonths: 36
};

const STEP_NAMES = [
  'Personal',
  'Employment',
  'Financial',
  'Credit Profile',
  'Loan Request',
  'Review & Submit'
];

export function App() {
  const [view, setView] = useState<'landing' | 'form' | 'results'>('landing');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<CustomerProfileInput>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResponse | null>(null);

  const [demoProfiles, setDemoProfiles] = useState<DemoProfileItem[]>([]);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);

  // Fetch demo profiles and products on load
  useEffect(() => {
    fetchDemoProfiles()
      .then((data) => setDemoProfiles(data))
      .catch((err) => console.warn('Could not load demo profiles:', err));

    fetchLoanProducts()
      .then((data) => setLoanProducts(data))
      .catch((err) => console.warn('Could not load loan products:', err));
  }, []);

  const handleFieldChange = (field: keyof CustomerProfileInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSelectDemoProfile = (data: CustomerProfileInput, _name: string) => {
    setFormData(data);
    setErrors({});
    setGeneralError(null);
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.age || formData.age < 18 || formData.age > 65) {
        stepErrors.age = 'Age must be between 18 and 65 years';
      }
      if (formData.dependents < 0) {
        stepErrors.dependents = 'Dependents cannot be negative';
      }
    } else if (currentStep === 2) {
      const maxExp = Math.max(0, formData.age - 18);
      if (formData.experienceYears > maxExp) {
        stepErrors.experienceYears = `Experience (${formData.experienceYears} yrs) cannot exceed working years (${maxExp} yrs) for age ${formData.age}`;
      }
      if (formData.experienceYears < 0) {
        stepErrors.experienceYears = 'Experience cannot be negative';
      }
    } else if (currentStep === 3) {
      if (!formData.monthlyIncome || formData.monthlyIncome <= 0) {
        stepErrors.monthlyIncome = 'Monthly income must be greater than ₹0';
      }
      if (formData.monthlyExpenses < 0) {
        stepErrors.monthlyExpenses = 'Expenses cannot be negative';
      }
      if (formData.existingMonthlyEmi < 0) {
        stepErrors.existingMonthlyEmi = 'Existing EMI cannot be negative';
      }
      if (formData.existingLoanAmount > 0 && formData.existingLoanCount === 0) {
        stepErrors.existingLoanCount = 'Please indicate count of existing active loans';
      }
    } else if (currentStep === 4) {
      if (!formData.creditScore || formData.creditScore < 300 || formData.creditScore > 900) {
        stepErrors.creditScore = 'Credit score must be between 300 and 900';
      }
      if (formData.creditUtilizationRatio < 0 || formData.creditUtilizationRatio > 100) {
        stepErrors.creditUtilizationRatio = 'Utilization must be between 0% and 100%';
      }
    } else if (currentStep === 5) {
      if (!formData.requestedAmount || formData.requestedAmount < 10000) {
        stepErrors.requestedAmount = 'Requested amount must be at least ₹10,000';
      }
      if (!formData.preferredTenureMonths) {
        stepErrors.preferredTenureMonths = 'Please select a repayment tenure';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(6, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);
    setGeneralError(null);

    try {
      const response = await submitRecommendationRequest(formData);
      setRecommendationResult(response);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setGeneralError(err.message || 'An error occurred while evaluating recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setView('landing');
    setCurrentStep(1);
    setRecommendationResult(null);
    setGeneralError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar
        onReset={handleReset}
        onBrowseProducts={() => setIsCatalogOpen(true)}
        isFormOrResults={view !== 'landing'}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* LANDING PAGE VIEW */}
        {view === 'landing' && (
          <div className="space-y-8 animate-fadeIn">
            <LandingHero
              onStart={() => {
                setView('form');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBrowseProducts={() => setIsCatalogOpen(true)}
            />
            <FeatureCards />
            <DisclaimerBanner />
          </div>
        )}

        {/* MULTI-STEP FORM VIEW */}
        {view === 'form' && (
          <div className="max-w-4xl mx-auto py-4">
            {/* Top Stepper and Demo Bar */}
            <Stepper
              currentStep={currentStep}
              totalSteps={6}
              steps={STEP_NAMES}
              onStepClick={(s) => {
                if (s < currentStep) setCurrentStep(s);
              }}
            />

            <DemoProfileSelector
              profiles={demoProfiles}
              onSelectProfile={handleSelectDemoProfile}
            />

            {generalError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Evaluation Notice: </span>
                  {generalError}
                </div>
              </div>
            )}

            {/* Form Step Body Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
              {currentStep === 1 && (
                <Step1Personal formData={formData} onChange={handleFieldChange} errors={errors} />
              )}
              {currentStep === 2 && (
                <Step2Employment formData={formData} onChange={handleFieldChange} errors={errors} />
              )}
              {currentStep === 3 && (
                <Step3Financial formData={formData} onChange={handleFieldChange} errors={errors} />
              )}
              {currentStep === 4 && (
                <Step4Credit formData={formData} onChange={handleFieldChange} errors={errors} />
              )}
              {currentStep === 5 && (
                <Step5LoanRequirement formData={formData} onChange={handleFieldChange} errors={errors} />
              )}
              {currentStep === 6 && (
                <Step6Review
                  formData={formData}
                  onEditStep={(s) => setCurrentStep(s)}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              )}

              {/* Step Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setView('landing')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Back to Home
                  </button>
                )}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-fintech-600 hover:bg-fintech-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-fintech-600/20 transition-all cursor-pointer"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-fintech-600 to-indigo-600 hover:from-fintech-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-fintech-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Rules & Rates...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Recommendation</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-500">
              Personal Loan Recommendation Engine • 100% Rule-Based Decision System
            </div>
          </div>
        )}

        {/* RESULTS DASHBOARD VIEW */}
        {view === 'results' && recommendationResult && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto py-2">
            {/* Top Return Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div>
                <span className="text-xs font-bold text-fintech-600 uppercase tracking-wider">Evaluation Completed</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Your Personalized Loan Assessment
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setView('form');
                    setCurrentStep(5);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Modify Request
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs cursor-pointer"
                >
                  New Application
                </button>
              </div>
            </div>

            {/* If No Products Found (Case 5) */}
            {recommendationResult.status === 'no_match' && (
              <NoProductsFound
                response={recommendationResult}
                onModifyProfile={() => {
                  setView('form');
                  setCurrentStep(3);
                }}
              />
            )}

            {/* If Invalid Situation (Case 6) */}
            {recommendationResult.status === 'invalid_situation' && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-rose-950">Cash Flow Imbalance Detected</h2>
                <div className="text-sm text-rose-900 space-y-2 text-left bg-white/80 p-5 rounded-2xl border border-rose-200">
                  {recommendationResult.reasons.map((r, i) => (
                    <p key={i}>• {r}</p>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setView('form');
                    setCurrentStep(3);
                  }}
                  className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  Correct Monthly Income & Expenses
                </button>
              </div>
            )}

            {/* Successful Recommendation Dashboard */}
            {recommendationResult.status === 'success' && recommendationResult.recommendation && (
              <>
                {/* 1. Primary Recommendation Card */}
                <PrimaryRecommendationCard
                  response={recommendationResult}
                  onAdjustClick={() => {
                    const el = document.getElementById('what-if-simulator');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* 2. Financial Capacity and Health Meters */}
                <FinancialHealthSummary
                  summary={recommendationResult.financial_summary}
                  affordabilityScore={recommendationResult.affordability.score}
                  affordabilityCategory={recommendationResult.affordability.category}
                  proposedDti={recommendationResult.recommendation.proposed_dti}
                  maximumNewEmi={recommendationResult.affordability.maximum_new_emi}
                />

                {/* 3. Human-Readable Explanations */}
                <ExplanationsList
                  reasons={recommendationResult.reasons}
                  cautionaryNotes={recommendationResult.cautionary_notes}
                />

                {/* 4. Alternative Loan Products Comparison */}
                <AlternativeProductsTable
                  alternatives={recommendationResult.alternatives}
                  onSelectProduct={(name, amt, rate, tenure) => {
                    const el = document.getElementById('what-if-simulator');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* 5. What-If Interactive Simulator */}
                <WhatIfSimulator
                  initialAmount={recommendationResult.recommendation.amount}
                  initialRate={recommendationResult.recommendation.interest_rate}
                  initialTenure={recommendationResult.recommendation.tenure_months}
                  monthlyIncome={recommendationResult.financial_summary.monthly_income}
                  existingMonthlyEmi={recommendationResult.financial_summary.existing_emi}
                  maxAffordableEmi={recommendationResult.affordability.maximum_new_emi}
                />
              </>
            )}

            <DisclaimerBanner />
          </div>
        )}
      </main>

      {/* Product Catalog Modal */}
      <ProductCatalogModal
        products={loanProducts}
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />

      <Footer />
    </div>
  );
}
