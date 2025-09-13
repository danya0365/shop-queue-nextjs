import { GetPaymentsPaginatedInput, PaginatedPaymentsDTO } from '@/src/application/dtos/shop/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/shop/backend/payment-mapper';
import type { ShopBackendPaymentRepository } from '@/src/domain/repositories/shop/backend/backend-payment-repository';
import { ShopBackendPaymentError, ShopBackendPaymentErrorType } from '@/src/domain/repositories/shop/backend/backend-payment-repository';

export class GetPaymentsPaginatedUseCase implements IUseCase<GetPaymentsPaginatedInput, PaginatedPaymentsDTO> {
  constructor(
    private readonly paymentRepository: ShopBackendPaymentRepository
  ) { }

  async execute(input: GetPaymentsPaginatedInput): Promise<PaginatedPaymentsDTO> {
    try {
      // Validate input
      if (!input.page || input.page < 1) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.VALIDATION_ERROR,
          'Page number must be greater than 0',
          'GetPaymentsPaginatedUseCase.execute',
          { input }
        );
      }

      if (!input.limit || input.limit < 1) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.VALIDATION_ERROR,
          'Limit must be greater than 0',
          'GetPaymentsPaginatedUseCase.execute',
          { input }
        );
      }

      // Get paginated payments from repository
      const paginatedPayments = await this.paymentRepository.getPaginatedPayments({
        page: input.page,
        limit: input.limit,
        filters: input.filters
      });

      // Use mapper to convert entity to DTO
      return PaymentMapper.toPaginatedDTO(paginatedPayments);
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'Failed to get paginated payments',
        'GetPaymentsPaginatedUseCase.execute',
        { input },
        error
      );
    }
  }
}
