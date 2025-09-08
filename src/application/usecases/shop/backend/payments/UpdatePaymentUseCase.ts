import { PaymentDTO, UpdatePaymentParams } from '@/src/application/dtos/shop/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/shop/backend/payment-mapper';
import type { ShopBackendPaymentRepository } from '@/src/domain/repositories/shop/backend/backend-payment-repository';
import { ShopBackendPaymentError, ShopBackendPaymentErrorType } from '@/src/domain/repositories/shop/backend/backend-payment-repository';

export class UpdatePaymentUseCase implements IUseCase<UpdatePaymentParams, PaymentDTO> {
  constructor(
    private readonly paymentRepository: ShopBackendPaymentRepository
  ) { }

  async execute(input: UpdatePaymentParams): Promise<PaymentDTO> {
    try {
      // Validate required fields
      if (!input.id) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.VALIDATION_ERROR,
          'Payment ID is required',
          'UpdatePaymentUseCase.execute',
          { input }
        );
      }

      // Extract ID and create update data
      const { id, ...updateData } = input;

      // Convert params to partial entity (excluding system fields)
      const paymentUpdateData = {
        queueId: updateData.queueId,
        queueNumber: updateData.queueNumber,
        customerName: updateData.customerName,
        totalAmount: updateData.totalAmount,
        paidAmount: updateData.paidAmount,
        paymentMethod: updateData.paymentMethod,
        paymentStatus: updateData.paymentStatus,
        paymentDate: updateData.paymentDate,
        processedByEmployeeId: updateData.processedByEmployeeId,
        shopId: updateData.shopId
      };

      // Remove undefined values to avoid overwriting with undefined
      const cleanUpdateData = Object.fromEntries(
        Object.entries(paymentUpdateData).filter(([, value]) => value !== undefined)
      );

      // Update payment in repository
      const updatedPayment = await this.paymentRepository.updatePayment(id, cleanUpdateData);

      // Use mapper to convert entity to DTO
      return PaymentMapper.toDTO(updatedPayment);
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'Failed to update payment',
        'UpdatePaymentUseCase.execute',
        { input },
        error
      );
    }
  }
}
