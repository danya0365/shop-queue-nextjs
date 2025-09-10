import { GetSubscriptionPlansPaginatedInputDTO, PaginatedSubscriptionPlansDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import { SubscriptionError, SubscriptionErrorType, SubscriptionPlanRepository } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for getting paginated subscription plans data
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionPlansPaginatedUseCase implements IUseCase<GetSubscriptionPlansPaginatedInputDTO, PaginatedSubscriptionPlansDTO> {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository
  ) { }

  /**
   * Execute the use case to get paginated subscription plans data
   * @param input Pagination parameters
   * @returns Paginated subscription plans data
   */
  async execute(input: GetSubscriptionPlansPaginatedInputDTO): Promise<PaginatedSubscriptionPlansDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      const paginatedSubscriptionPlans = await this.subscriptionPlanRepository.getPaginatedPlans(paginationParams);
      return SubscriptionMapper.toPaginatedSubscriptionPlansDTO(paginatedSubscriptionPlans);
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get paginated subscription plans',
        'GetSubscriptionPlansPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
