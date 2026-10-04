import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendationService.js';
import { CustomerProfileInput } from '../types/index.js';

export class RecommendationController {
  public static async createRecommendation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customer = req.body as CustomerProfileInput;
      const sessionId = (req.headers['x-session-id'] as string) || undefined;

      const recommendation = RecommendationService.generateRecommendation(customer, sessionId);

      res.status(200).json(recommendation);
    } catch (err) {
      next(err);
    }
  }
}
