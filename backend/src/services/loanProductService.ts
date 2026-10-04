import { LoanProductRepository } from '../repositories/loanProductRepository.js';
import { LoanProduct } from '../types/index.js';

export class LoanProductService {
  public static getAllLoanProducts(): LoanProduct[] {
    return LoanProductRepository.getAllActive();
  }

  public static getLoanProductById(id: string): LoanProduct | null {
    return LoanProductRepository.getById(id);
  }
}
