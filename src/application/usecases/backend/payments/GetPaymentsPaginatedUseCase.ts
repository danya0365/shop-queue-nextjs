import { GetPaymentsPaginatedInput, PaginatedPaymentsDTO } from '@/src/application/dtos/backend/payments-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaymentMapper } from '@/src/application/mappers/backend/payment-mapper';
import type { BackendPaymentRepository } from '@/src/domain/repositories/backend/backend-payment-repository';
import { BackendPaymentError, BackendPaymentErrorType } from '@/src/domain/repositories/backend/backend-payment-repository';

export class GetPaymentsPaginatedUseCase implements IUseCase<GetPaymentsPaginatedInput, PaginatedPaymentsDTO> {
  constructor(
    private readonly paymentRepository: BackendPaymentRepository
  ) { }

  async execute(input: GetPaymentsPaginatedInput): Promise<PaginatedPaymentsDTO> {
    try {
      // Validate input
      if (!input.page || input.page < 1) {
        throw new BackendPaymentError(
          BackendPaymentErrorType.VALIDATION_ERROR,
          'Page number must be greater than 0',
          'GetPaymentsPaginatedUseCase.execute',
          { input }
        );
      }

      if (!input.limit || input.limit < 1) {
        throw new BackendPaymentError(
          BackendPaymentErrorType.VALIDATION_ERROR,
          'Limit must be greater than 0',
          'GetPaymentsPaginatedUseCase.execute',
          { input }
        );
      }

      // Get paginated payments from repository
      const paginatedPayments = await this.paymentRepository.getPaginatedPayments({
        page: input.page,
        limit: input.limit
      });

      // Use mapper to convert entity to DTO
      return PaymentMapper.toPaginatedDTO(paginatedPayments);
    } catch (error) {
      if (error instanceof BackendPaymentError) {
        throw error;
      }

      throw new BackendPaymentError(
        BackendPaymentErrorType.UNKNOWN,
        'Failed to get paginated payments',
        'GetPaymentsPaginatedUseCase.execute',
        { input },
        error
      );
    }
  }
}
