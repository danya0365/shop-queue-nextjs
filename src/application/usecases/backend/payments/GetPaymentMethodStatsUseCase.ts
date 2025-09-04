import { PaymentMethodStatsDTO } from '@/src/application/dtos/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/backend/payment-mapper';
import type { BackendPaymentRepository } from '@/src/domain/repositories/backend/backend-payment-repository';
import { BackendPaymentError, BackendPaymentErrorType } from '@/src/domain/repositories/backend/backend-payment-repository';

/**
 * Use case for getting payment method statistics
 * Following Clean Architecture and SOLID principles
 */
export class GetPaymentMethodStatsUseCase implements IUseCase<void, PaymentMethodStatsDTO> {
  constructor(
    private readonly paymentRepository: BackendPaymentRepository
  ) { }

  async execute(): Promise<PaymentMethodStatsDTO> {
    try {
      const stats = await this.paymentRepository.getPaymentMethodStats();
      return PaymentMapper.methodStatsToDTO(stats);
    } catch (error) {
      if (error instanceof BackendPaymentError) {
        throw error;
      }
      throw new BackendPaymentError(
        BackendPaymentErrorType.UNKNOWN,
        'Failed to get payment method statistics',
        'GetPaymentMethodStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
