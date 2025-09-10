import { GetSubscriptionUsagePaginatedInputDTO, PaginatedSubscriptionUsageDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import { SubscriptionUsageRepository } from '@/src/domain/repositories/subscription-repository';
import { SubscriptionError, SubscriptionErrorType } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for getting paginated subscription usage data
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionUsagePaginatedUseCase implements IUseCase<GetSubscriptionUsagePaginatedInputDTO, PaginatedSubscriptionUsageDTO> {
  constructor(
    private subscriptionUsageRepository: SubscriptionUsageRepository
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
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get paginated subscription usage',
        'GetSubscriptionUsagePaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
