import { GetFeatureAccessPaginatedInputDTO, PaginatedFeatureAccessDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { FeatureType } from '@/src/domain/entities/backend/backend-subscription.entity';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { BackendFeatureAccessRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for getting paginated feature access data
 * Following SOLID principles and Clean Architecture
 */
export class GetFeatureAccessPaginatedUseCase implements IUseCase<GetFeatureAccessPaginatedInputDTO, PaginatedFeatureAccessDTO> {
  constructor(
    private featureAccessRepository: BackendFeatureAccessRepository
  ) { }

  /**
   * Execute the use case to get paginated feature access data
   * @param input Pagination parameters
   * @returns Paginated feature access data
   */
  async execute(input: GetFeatureAccessPaginatedInputDTO): Promise<PaginatedFeatureAccessDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      // Validate feature type if provided
      if (input.featureType && !Object.values(FeatureType).includes(input.featureType as FeatureType)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid feature type',
          'GetFeatureAccessPaginatedUseCase.execute',
          { input }
        );
      }

      const paginatedFeatureAccess = await this.featureAccessRepository.getPaginatedFeatureAccess(
        paginationParams
      );
      return SubscriptionMapper.toPaginatedFeatureAccessDTO(paginatedFeatureAccess);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to get paginated feature access',
        'GetFeatureAccessPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
