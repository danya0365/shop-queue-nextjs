import { RevokeFeatureAccessInputDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { FeatureType } from '@/src/domain/entities/backend/backend-subscription.entity';
import { FeatureAccessRepository, SubscriptionError, SubscriptionErrorType } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for revoking feature access
 * Following SOLID principles and Clean Architecture
 */
export class RevokeFeatureAccessUseCase implements IUseCase<RevokeFeatureAccessInputDTO, boolean> {
  constructor(
    private readonly featureAccessRepository: FeatureAccessRepository
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
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'RevokeFeatureAccessUseCase.execute',
          { params }
        );
      }

      if (!params.featureType) {
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Feature type is required',
          'RevokeFeatureAccessUseCase.execute',
          { params }
        );
      }

      if (!params.featureId?.trim()) {
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Feature ID is required',
          'RevokeFeatureAccessUseCase.execute',
          { params }
        );
      }

      // Validate feature type enum
      if (!Object.values(FeatureType).includes(params.featureType as FeatureType)) {
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
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
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to revoke feature access',
        'RevokeFeatureAccessUseCase.execute',
        { params },
        error
      );
    }
  }
}
