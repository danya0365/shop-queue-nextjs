import {
  CreatePaymentParams,
  PaymentDTO,
} from "@/src/application/dtos/shop/backend/payments-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { PaymentMapper } from "@/src/application/mappers/shop/backend/payment-mapper";
import { CreatePaymentEntity } from "@/src/domain/entities/shop/backend/backend-payment.entity";
import type { ShopBackendPaymentRepository } from "@/src/domain/repositories/shop/backend/backend-payment-repository";
import {
  ShopBackendPaymentError,
  ShopBackendPaymentErrorType,
} from "@/src/domain/repositories/shop/backend/backend-payment-repository";

export class CreatePaymentUseCase
  implements IUseCase<CreatePaymentParams, PaymentDTO>
{
  constructor(
    private readonly paymentRepository: ShopBackendPaymentRepository
  ) {}

  async execute(input: CreatePaymentParams): Promise<PaymentDTO> {
    try {
      // Validate required fields
      if (!input.queueId || !input.totalAmount || !input.shopId) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.VALIDATION_ERROR,
          "Missing required payment fields",
          "CreatePaymentUseCase.execute",
          { input }
        );
      }

      // map params to entity
      const paymentEntity: Omit<
        CreatePaymentEntity,
        "id" | "createdAt" | "updatedAt"
      > = {
        queueId: input.queueId,
        totalAmount: input.totalAmount,
        paidAmount: input.paidAmount,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus,
        paymentDate: input.paymentDate,
        processedByEmployeeId: input.processedByEmployeeId,
        shopId: input.shopId,
      };

      // Create payment in repository
      const createdPayment = await this.paymentRepository.createPayment(
        paymentEntity
      );

      // Use mapper to convert entity to DTO
      return PaymentMapper.toDTO(createdPayment);
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        "Failed to create payment",
        "CreatePaymentUseCase.execute",
        { input },
        error
      );
    }
  }
}
