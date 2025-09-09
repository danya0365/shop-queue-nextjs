import { GetSubscriptionPlansPaginatedInputDTO, PaginatedSubscriptionPlansDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { BackendSubscriptionPlanRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for getting paginated subscription plans data
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionPlansPaginatedUseCase implements IUseCase<GetSubscriptionPlansPaginatedInputDTO, PaginatedSubscriptionPlansDTO> {
  constructor(
    private readonly subscriptionPlanRepository: BackendSubscriptionPlanRepository
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
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to get paginated subscription plans',
        'GetSubscriptionPlansPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
