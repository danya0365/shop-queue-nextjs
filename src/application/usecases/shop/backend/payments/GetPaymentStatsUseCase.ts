import { PaymentStatsDTO } from '@/src/application/dtos/shop/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/shop/backend/payment-mapper';
import type { ShopBackendPaymentRepository } from '@/src/domain/repositories/shop/backend/backend-payment-repository';
import { ShopBackendPaymentError, ShopBackendPaymentErrorType } from '@/src/domain/repositories/shop/backend/backend-payment-repository';

export class GetPaymentStatsUseCase implements IUseCase<void, PaymentStatsDTO> {
  constructor(
    private readonly paymentRepository: ShopBackendPaymentRepository
  ) { }

  async execute(): Promise<PaymentStatsDTO> {
    try {
      // Get payment stats from repository
      const stats = await this.paymentRepository.getPaymentStats();

      // Use mapper to convert entity to DTO
      return PaymentMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'Failed to get payment statistics',
        'GetPaymentStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
