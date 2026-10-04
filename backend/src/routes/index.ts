import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController.js';
import { LoanProductController } from '../controllers/loanProductController.js';
import { CalculationController } from '../controllers/calculationController.js';
import { RuleController } from '../controllers/ruleController.js';
import { DemoProfileController } from '../controllers/demoProfileController.js';
import {
  validateCustomerProfile,
  validateEmiCalculation,
  validateAffordabilityCalculation
} from '../middleware/validation.js';

const router = Router();

// Recommendations Endpoint
router.post(
  '/recommendations',
  validateCustomerProfile,
  RecommendationController.createRecommendation
);

// Loan Products Endpoints
router.get('/loan-products', LoanProductController.getAll);
router.get('/loan-products/:id', LoanProductController.getById);

// Pure Calculation Endpoints
router.post('/calculate-emi', validateEmiCalculation, CalculationController.calculateEmi);
router.post(
  '/calculate-affordability',
  validateAffordabilityCalculation,
  CalculationController.calculateAffordability
);

// Business Rules Configuration Endpoints
router.get('/rules', RuleController.getAllRules);
router.get('/rules/:category', RuleController.getByCategory);

// Demo Profiles for fast UI testing
router.get('/demo-profiles', DemoProfileController.getDemoProfiles);

export default router;
