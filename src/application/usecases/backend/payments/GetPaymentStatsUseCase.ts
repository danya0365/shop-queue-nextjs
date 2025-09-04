import { PaymentStatsDTO } from '@/src/application/dtos/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/backend/payment-mapper';
import type { BackendPaymentRepository } from '@/src/domain/repositories/backend/backend-payment-repository';
import { BackendPaymentError, BackendPaymentErrorType } from '@/src/domain/repositories/backend/backend-payment-repository';

export class GetPaymentStatsUseCase implements IUseCase<void, PaymentStatsDTO> {
  constructor(
    private readonly paymentRepository: BackendPaymentRepository
  ) { }

  async execute(): Promise<PaymentStatsDTO> {
    try {
      // Get payment stats from repository
      const stats = await this.paymentRepository.getPaymentStats();

      // Use mapper to convert entity to DTO
      return PaymentMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof BackendPaymentError) {
        throw error;
      }

      throw new BackendPaymentError(
        BackendPaymentErrorType.UNKNOWN,
        'Failed to get payment statistics',
        'GetPaymentStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
