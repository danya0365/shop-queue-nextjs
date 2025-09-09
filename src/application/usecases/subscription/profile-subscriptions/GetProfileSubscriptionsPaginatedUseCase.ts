import { GetProfileSubscriptionsPaginatedInputDTO, PaginatedProfileSubscriptionsDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { BackendProfileSubscriptionRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for getting paginated profile subscriptions data
 * Following SOLID principles and Clean Architecture
 */
export class GetProfileSubscriptionsPaginatedUseCase implements IUseCase<GetProfileSubscriptionsPaginatedInputDTO, PaginatedProfileSubscriptionsDTO> {
  constructor(
    private profileSubscriptionRepository: BackendProfileSubscriptionRepository
  ) { }

  /**
   * Execute the use case to get paginated profile subscriptions data
   * @param input Pagination parameters
   * @returns Paginated profile subscriptions data
   */
  async execute(input: GetProfileSubscriptionsPaginatedInputDTO): Promise<PaginatedProfileSubscriptionsDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      const paginatedProfileSubscriptions = await this.profileSubscriptionRepository.getPaginatedSubscriptions(
        paginationParams
      );
      return SubscriptionMapper.toPaginatedProfileSubscriptionsDTO(paginatedProfileSubscriptions);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to get paginated profile subscriptions',
        'GetProfileSubscriptionsPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
