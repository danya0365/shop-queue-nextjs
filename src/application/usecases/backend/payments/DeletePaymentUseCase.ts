import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendPaymentRepository } from '@/src/domain/repositories/backend/backend-payment-repository';
import { BackendPaymentError, BackendPaymentErrorType } from '@/src/domain/repositories/backend/backend-payment-repository';

export class DeletePaymentUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly paymentRepository: BackendPaymentRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      // Validate input
      if (!id) {
        throw new BackendPaymentError(
          BackendPaymentErrorType.VALIDATION_ERROR,
          'Payment ID is required',
          'DeletePaymentUseCase.execute',
          { id }
        );
      }

      // Delete payment from repository
      const result = await this.paymentRepository.deletePayment(id);
      return result;
    } catch (error) {
      if (error instanceof BackendPaymentError) {
        throw error;
      }

      throw new BackendPaymentError(
        BackendPaymentErrorType.UNKNOWN,
        'Failed to delete payment',
        'DeletePaymentUseCase.execute',
        { id },
        error
      );
    }
  }
}
