import { LoanProductRepository } from '../repositories/loanProductRepository.js';
import { RecommendationRepository } from '../repositories/recommendationRepository.js';
import { RecommendationOrchestrator } from '../engine/recommendationOrchestrator.js';
import { CustomerProfileInput, RecommendationResponse } from '../types/index.js';

export class RecommendationService {
  public static generateRecommendation(
    customer: CustomerProfileInput,
    sessionId?: string
  ): RecommendationResponse {
    const products = LoanProductRepository.getAllActive();
    const result = RecommendationOrchestrator.processProfile(customer, products);

    // Save recommendation result asynchronously/safely without blocking
    try {
      RecommendationRepository.save(sessionId || 'anon_session', result);
    } catch (err) {
      console.warn('Failed to record recommendation history audit:', err);
    }

    return result;
  }
}
