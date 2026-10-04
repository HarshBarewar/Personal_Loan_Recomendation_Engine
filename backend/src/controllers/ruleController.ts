import { Request, Response, NextFunction } from 'express';
import { BusinessRuleRepository } from '../repositories/businessRuleRepository.js';

export class RuleController {
  public static getAllRules(_req: Request, res: Response, next: NextFunction): void {
    try {
      const rules = BusinessRuleRepository.getAllActive();
      res.status(200).json({
        status: 'success',
        count: rules.length,
        data: rules
      });
    } catch (err) {
      next(err);
    }
  }

  public static getByCategory(req: Request, res: Response, next: NextFunction): void {
    try {
      const { category } = req.params;
      const rules = BusinessRuleRepository.getByCategory(category);
      res.status(200).json({
        status: 'success',
        count: rules.length,
        data: rules
      });
    } catch (err) {
      next(err);
    }
  }
}
