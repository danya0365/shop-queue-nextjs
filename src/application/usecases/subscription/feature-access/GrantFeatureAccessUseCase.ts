import { FeatureAccessDTO, GrantFeatureAccessInputDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { FeatureType } from '@/src/domain/entities/backend/backend-subscription.entity';
import type { BackendFeatureAccessRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for granting feature access
 * Following SOLID principles and Clean Architecture
 */
export class GrantFeatureAccessUseCase implements IUseCase<GrantFeatureAccessInputDTO, FeatureAccessDTO> {
  constructor(
    private readonly featureAccessRepository: BackendFeatureAccessRepository
  ) { }

  /**
   * Execute the use case to grant feature access
   * @param params Feature access grant parameters
   * @returns Created feature access data
   */
  async execute(params: GrantFeatureAccessInputDTO): Promise<FeatureAccessDTO> {
    try {
      // Validate required fields
      if (!params.profileId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'GrantFeatureAccessUseCase.execute',
          { params }
        );
      }

      if (!params.featureType) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Feature type is required',
          'GrantFeatureAccessUseCase.execute',
          { params }
        );
      }

      if (!params.featureId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Feature ID is required',
          'GrantFeatureAccessUseCase.execute',
          { params }
        );
      }

      // Validate feature type enum
      if (!Object.values(FeatureType).includes(params.featureType as FeatureType)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid feature type',
          'GrantFeatureAccessUseCase.execute',
          { params }
        );
      }

      // Validate price if provided
      if (params.price !== undefined && params.price < 0) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Price must be non-negative',
          'GrantFeatureAccessUseCase.execute',
          { params }
        );
      }

      // Create entity data
      const featureAccessData = {
        profileId: params.profileId.trim(),
        featureType: params.featureType as FeatureType,
        featureId: params.featureId.trim(),
        purchasedAt: new Date(),
        expiresAt: params.expiresAt ? new Date(params.expiresAt) : null,
        isActive: true,
        price: params.price || null,
        currency: 'THB',
        paymentProvider: params.paymentProvider || null,
        externalPaymentId: params.externalPaymentId || null,
        metadata: params.metadata || {}
      };

      const createdFeatureAccess = await this.featureAccessRepository.grantFeatureAccess(
        featureAccessData.profileId,
        featureAccessData.featureType,
        featureAccessData.featureId
      );
      return SubscriptionMapper.featureAccessToDTO(createdFeatureAccess);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to grant feature access',
        'GrantFeatureAccessUseCase.execute',
        { params },
        error
      );
    }
  }
}
