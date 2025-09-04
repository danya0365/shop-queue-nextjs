import { CreatePaymentParams, PaymentDTO } from '@/src/application/dtos/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/backend/payment-mapper';
import { CreatePaymentEntity } from '@/src/domain/entities/backend/backend-payment.entity';
import type { BackendPaymentRepository } from '@/src/domain/repositories/backend/backend-payment-repository';
import { BackendPaymentError, BackendPaymentErrorType } from '@/src/domain/repositories/backend/backend-payment-repository';


export class CreatePaymentUseCase implements IUseCase<CreatePaymentParams, PaymentDTO> {
  constructor(
    private readonly paymentRepository: BackendPaymentRepository
  ) { }

  async execute(input: CreatePaymentParams): Promise<PaymentDTO> {
    try {
      // Validate required fields
      if (!input.queueId || !input.queueNumber || !input.customerName || !input.totalAmount || !input.shopId) {
        throw new BackendPaymentError(
          BackendPaymentErrorType.VALIDATION_ERROR,
          'Missing required payment fields',
          'CreatePaymentUseCase.execute',
          { input }
        );
      }

      // map params to entity
      const paymentEntity: Omit<CreatePaymentEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        queueId: input.queueId,
        queueNumber: input.queueNumber,
        customerName: input.customerName,
        totalAmount: input.totalAmount,
        paidAmount: input.paidAmount,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus,
        paymentDate: input.paymentDate,
        processedByEmployeeId: input.processedByEmployeeId,
        shopId: input.shopId
      };

      // Create payment in repository
      const createdPayment = await this.paymentRepository.createPayment(paymentEntity);

      // Use mapper to convert entity to DTO
      return PaymentMapper.toDTO(createdPayment);
    } catch (error) {
      if (error instanceof BackendPaymentError) {
        throw error;
      }

      throw new BackendPaymentError(
        BackendPaymentErrorType.UNKNOWN,
        'Failed to create payment',
        'CreatePaymentUseCase.execute',
        { input },
        error
      );
    }
  }
}
