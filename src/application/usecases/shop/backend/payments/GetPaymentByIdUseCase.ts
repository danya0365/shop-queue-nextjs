import { PaymentDTO } from '@/src/application/dtos/shop/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/shop/backend/payment-mapper';
import type { ShopBackendPaymentRepository } from '@/src/domain/repositories/shop/backend/backend-payment-repository';
import { ShopBackendPaymentError, ShopBackendPaymentErrorType } from '@/src/domain/repositories/shop/backend/backend-payment-repository';

export class GetPaymentByIdUseCase implements IUseCase<string, PaymentDTO> {
  constructor(
    private readonly paymentRepository: ShopBackendPaymentRepository
  ) { }

  async execute(id: string): Promise<PaymentDTO> {
    try {
      // Validate input
      if (!id) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.VALIDATION_ERROR,
          'Payment ID is required',
          'GetPaymentByIdUseCase.execute',
          { id }
        );
      }

      // Get payment from repository
      const payment = await this.paymentRepository.getPaymentById(id);

      if (!payment) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.NOT_FOUND,
          `Payment with ID ${id} not found`,
          'GetPaymentByIdUseCase.execute',
          { id }
        );
      }

      // Use mapper to convert entity to DTO
      return PaymentMapper.toDTO(payment);
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'Failed to get payment by ID',
        'GetPaymentByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
