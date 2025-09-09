import { RevokeFeatureAccessInputDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { FeatureType } from '@/src/domain/entities/backend/backend-subscription.entity';
import type { BackendFeatureAccessRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for revoking feature access
 * Following SOLID principles and Clean Architecture
 */
export class RevokeFeatureAccessUseCase implements IUseCase<RevokeFeatureAccessInputDTO, boolean> {
  constructor(
    private readonly featureAccessRepository: BackendFeatureAccessRepository
  ) { }

  /**
   * Execute the use case to revoke feature access
   * @param params Feature access revoke parameters
   * @returns Success status
   */
  async execute(params: RevokeFeatureAccessInputDTO): Promise<boolean> {
    try {
      // Validate required fields
      if (!params.profileId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'RevokeFeatureAccessUseCase.execute',
          { params }
        );
      }

      if (!params.featureType) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Feature type is required',
          'RevokeFeatureAccessUseCase.execute',
          { params }
        );
      }

      if (!params.featureId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Feature ID is required',
          'RevokeFeatureAccessUseCase.execute',
          { params }
        );
      }

      // Validate feature type enum
      if (!Object.values(FeatureType).includes(params.featureType as FeatureType)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid feature type',
          'RevokeFeatureAccessUseCase.execute',
          { params }
        );
      }

      const result = await this.featureAccessRepository.revokeFeatureAccess(
        params.profileId,
        params.featureType as FeatureType,
        params.featureId
      );

      return result;
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to revoke feature access',
        'RevokeFeatureAccessUseCase.execute',
        { params },
        error
      );
    }
  }
}
