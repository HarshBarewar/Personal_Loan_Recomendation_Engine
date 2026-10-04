import { execute, queryAll } from '../database/connection.js';
import { RecommendationResponse } from '../types/index.js';

export class RecommendationRepository {
  public static save(
    sessionId: string,
    recResponse: RecommendationResponse
  ): void {
    const recId = 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    execute(
      `INSERT INTO recommendations (
        id, session_id, timestamp, risk_category, risk_score,
        affordability_score, affordability_category,
        recommended_product_id, recommended_product_name,
        recommended_amount, recommended_rate, recommended_tenure,
        recommended_emi, total_interest, input_summary, reasons
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recId,
        sessionId,
        recResponse.timestamp,
        recResponse.risk.category,
        recResponse.risk.score,
        recResponse.affordability.score,
        recResponse.affordability.category,
        recResponse.recommendation?.product_id || null,
        recResponse.recommendation?.product_name || null,
        recResponse.recommendation?.amount || null,
        recResponse.recommendation?.interest_rate || null,
        recResponse.recommendation?.tenure_months || null,
        recResponse.recommendation?.emi || null,
        recResponse.recommendation?.total_interest || null,
        JSON.stringify(recResponse.financial_summary),
        JSON.stringify(recResponse.reasons)
      ]
    );
  }

  public static getRecent(limit: number = 10): Record<string, unknown>[] {
    return queryAll(
      'SELECT id, session_id, timestamp, risk_category, affordability_category, recommended_product_name, recommended_amount, recommended_emi FROM recommendations ORDER BY timestamp DESC LIMIT ?',
      [limit]
    );
  }
}
