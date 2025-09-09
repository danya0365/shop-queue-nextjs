import { HasFeatureAccessInputDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { FeatureType } from '@/src/domain/entities/backend/backend-subscription.entity';
import type { BackendFeatureAccessRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for checking if profile has feature access
 * Following SOLID principles and Clean Architecture
 */
export class HasFeatureAccessUseCase implements IUseCase<HasFeatureAccessInputDTO, boolean> {
  constructor(
    private readonly featureAccessRepository: BackendFeatureAccessRepository
  ) { }

  /**
   * Execute the use case to check if profile has feature access
   * @param params Feature access check parameters
   * @returns Whether the profile has access to the feature
   */
  async execute(params: HasFeatureAccessInputDTO): Promise<boolean> {
    try {
      // Validate required fields
      if (!params.profileId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'HasFeatureAccessUseCase.execute',
          { params }
        );
      }

      if (!params.featureType) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Feature type is required',
          'HasFeatureAccessUseCase.execute',
          { params }
        );
      }

      if (!params.featureId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Feature ID is required',
          'HasFeatureAccessUseCase.execute',
          { params }
        );
      }

      // Validate feature type enum
      if (!Object.values(FeatureType).includes(params.featureType as FeatureType)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid feature type',
          'HasFeatureAccessUseCase.execute',
          { params }
        );
      }

      const hasAccess = await this.featureAccessRepository.hasFeatureAccess(
        params.profileId,
        params.featureType as FeatureType,
        params.featureId
      );

      return hasAccess;
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to check feature access',
        'HasFeatureAccessUseCase.execute',
        { params },
        error
      );
    }
  }
}
