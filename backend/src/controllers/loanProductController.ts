import { Request, Response, NextFunction } from 'express';
import { LoanProductService } from '../services/loanProductService.js';

export class LoanProductController {
  public static getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const products = LoanProductService.getAllLoanProducts();
      res.status(200).json({
        status: 'success',
        count: products.length,
        data: products
      });
    } catch (err) {
      next(err);
    }
  }

  public static getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const product = LoanProductService.getLoanProductById(id);

      if (!product) {
        res.status(404).json({
          status: 'error',
          message: `Loan product with ID '${id}' was not found.`
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: product
      });
    } catch (err) {
      next(err);
    }
  }
}
