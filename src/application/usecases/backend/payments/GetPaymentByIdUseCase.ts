import { PaymentDTO } from '@/src/application/dtos/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/backend/payment-mapper';
import type { BackendPaymentRepository } from '@/src/domain/repositories/backend/backend-payment-repository';
import { BackendPaymentError, BackendPaymentErrorType } from '@/src/domain/repositories/backend/backend-payment-repository';

export class GetPaymentByIdUseCase implements IUseCase<string, PaymentDTO> {
  constructor(
    private readonly paymentRepository: BackendPaymentRepository
  ) { }

  async execute(id: string): Promise<PaymentDTO> {
    try {
      // Validate input
      if (!id) {
        throw new BackendPaymentError(
          BackendPaymentErrorType.VALIDATION_ERROR,
          'Payment ID is required',
          'GetPaymentByIdUseCase.execute',
          { id }
        );
      }

      // Get payment from repository
      const payment = await this.paymentRepository.getPaymentById(id);

      if (!payment) {
        throw new BackendPaymentError(
          BackendPaymentErrorType.NOT_FOUND,
          `Payment with ID ${id} not found`,
          'GetPaymentByIdUseCase.execute',
          { id }
        );
      }

      // Use mapper to convert entity to DTO
      return PaymentMapper.toDTO(payment);
    } catch (error) {
      if (error instanceof BackendPaymentError) {
        throw error;
      }

      throw new BackendPaymentError(
        BackendPaymentErrorType.UNKNOWN,
        'Failed to get payment by ID',
        'GetPaymentByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
