import { PaymentMethodStatsDTO } from '@/src/application/dtos/shop/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/shop/backend/payment-mapper';
import type { ShopBackendPaymentRepository } from '@/src/domain/repositories/shop/backend/backend-payment-repository';
import { ShopBackendPaymentError, ShopBackendPaymentErrorType } from '@/src/domain/repositories/shop/backend/backend-payment-repository';

/**
 * Use case for getting payment method statistics
 * Following Clean Architecture and SOLID principles
 */
export class GetPaymentMethodStatsUseCase implements IUseCase<void, PaymentMethodStatsDTO> {
  constructor(
    private readonly paymentRepository: ShopBackendPaymentRepository
  ) { }

  async execute(): Promise<PaymentMethodStatsDTO> {
    try {
      const stats = await this.paymentRepository.getPaymentMethodStats();
      return PaymentMapper.methodStatsToDTO(stats);
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }
      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'Failed to get payment method statistics',
        'GetPaymentMethodStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
