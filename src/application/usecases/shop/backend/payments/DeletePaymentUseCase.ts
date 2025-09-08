import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendPaymentRepository } from '@/src/domain/repositories/shop/backend/backend-payment-repository';
import { ShopBackendPaymentError, ShopBackendPaymentErrorType } from '@/src/domain/repositories/shop/backend/backend-payment-repository';

export class DeletePaymentUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly paymentRepository: ShopBackendPaymentRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      // Validate input
      if (!id) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.VALIDATION_ERROR,
          'Payment ID is required',
          'DeletePaymentUseCase.execute',
          { id }
        );
      }

      // Delete payment from repository
      const result = await this.paymentRepository.deletePayment(id);
      return result;
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'Failed to delete payment',
        'DeletePaymentUseCase.execute',
        { id },
        error
      );
    }
  }
}
