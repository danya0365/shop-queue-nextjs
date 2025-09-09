import { GetSubscriptionUsagePaginatedInputDTO, PaginatedSubscriptionUsageDTO } from '@/src/application/dtos/subscription/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/subscription/backend/subscription-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { BackendSubscriptionUsageRepository } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';

/**
 * Use case for getting paginated subscription usage data
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionUsagePaginatedUseCase implements IUseCase<GetSubscriptionUsagePaginatedInputDTO, PaginatedSubscriptionUsageDTO> {
  constructor(
    private subscriptionUsageRepository: BackendSubscriptionUsageRepository
  ) { }

  /**
   * Execute the use case to get paginated subscription usage data
   * @param input Pagination parameters
   * @returns Paginated subscription usage data
   */
  async execute(input: GetSubscriptionUsagePaginatedInputDTO): Promise<PaginatedSubscriptionUsageDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      // Use profile-specific method if profileId is provided, otherwise get all usage
      const paginatedSubscriptionUsage = input.profileId 
        ? await this.subscriptionUsageRepository.getUsageByProfileId(input.profileId, paginationParams)
        : await this.subscriptionUsageRepository.getPaginatedUsage(paginationParams);
      return SubscriptionMapper.toPaginatedSubscriptionUsageDTO(paginatedSubscriptionUsage);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to get paginated subscription usage',
        'GetSubscriptionUsagePaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
