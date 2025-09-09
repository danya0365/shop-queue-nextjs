import { ProfileSubscriptionDTO, UpdateProfileSubscriptionInputDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { BillingPeriod, SubscriptionStatus, UpdateProfileSubscriptionEntity } from '@/src/domain/entities/backend/backend-subscription.entity';
import type { BackendProfileSubscriptionRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for updating profile subscription
 * Following SOLID principles and Clean Architecture
 */
export class UpdateProfileSubscriptionUseCase implements IUseCase<UpdateProfileSubscriptionInputDTO, ProfileSubscriptionDTO> {
  constructor(
    private readonly profileSubscriptionRepository: BackendProfileSubscriptionRepository
  ) { }

  /**
   * Execute the use case to update profile subscription
   * @param params Profile subscription update parameters
   * @returns Updated profile subscription data
   */
  async execute(params: UpdateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO> {
    try {
      // Validate required fields
      if (!params.id?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile subscription ID is required',
          'UpdateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      // Check if profile subscription exists
      const existingProfileSubscription = await this.profileSubscriptionRepository.getSubscriptionById(params.id);
      if (!existingProfileSubscription) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          'Profile subscription not found',
          'UpdateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      // Validate enums if provided
      if (params.status && !Object.values(SubscriptionStatus).includes(params.status as SubscriptionStatus)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid subscription status',
          'UpdateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      if (params.billingPeriod && !Object.values(BillingPeriod).includes(params.billingPeriod as BillingPeriod)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid billing period',
          'UpdateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      // Validate price if provided
      if (params.pricePerPeriod !== undefined && params.pricePerPeriod < 0) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Price per period must be non-negative',
          'UpdateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      // Create update entity with only provided fields
      const updateProfileSubscriptionEntity: UpdateProfileSubscriptionEntity = {};

      // Only include fields that are provided in the update
      if (params.planId !== undefined) {
        if (!params.planId.trim()) {
          throw new BackendSubscriptionError(
            BackendSubscriptionErrorType.VALIDATION_ERROR,
            'Plan ID cannot be empty',
            'UpdateProfileSubscriptionUseCase.execute',
            { params }
          );
        }
        updateProfileSubscriptionEntity.planId = params.planId.trim();
      }

      if (params.status !== undefined) {
        updateProfileSubscriptionEntity.status = params.status as SubscriptionStatus;
      }

      if (params.billingPeriod !== undefined) {
        updateProfileSubscriptionEntity.billingPeriod = params.billingPeriod as BillingPeriod;
      }

      if (params.endDate !== undefined) {
        updateProfileSubscriptionEntity.endDate = params.endDate || undefined;
      }

      if (params.trialEndDate !== undefined) {
        updateProfileSubscriptionEntity.trialEndDate = params.trialEndDate || undefined;
      }

      if (params.cancelledAt !== undefined) {
        updateProfileSubscriptionEntity.cancelledAt = params.cancelledAt || undefined;
      }

      if (params.pricePerPeriod !== undefined) {
        updateProfileSubscriptionEntity.pricePerPeriod = params.pricePerPeriod;
      }

      if (params.currency !== undefined) {
        updateProfileSubscriptionEntity.currency = params.currency;
      }

      if (params.autoRenew !== undefined) {
        updateProfileSubscriptionEntity.autoRenew = params.autoRenew;
      }

      if (params.paymentProvider !== undefined) {
        updateProfileSubscriptionEntity.paymentProvider = params.paymentProvider;
      }

      if (params.externalSubscriptionId !== undefined) {
        updateProfileSubscriptionEntity.externalSubscriptionId = params.externalSubscriptionId;
      }

      if (params.metadata !== undefined) {
        updateProfileSubscriptionEntity.metadata = params.metadata;
      }

      const updatedProfileSubscription = await this.profileSubscriptionRepository.updateSubscription(params.id, updateProfileSubscriptionEntity);
      return SubscriptionMapper.profileSubscriptionToDTO(updatedProfileSubscription);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to update profile subscription',
        'UpdateProfileSubscriptionUseCase.execute',
        { params },
        error
      );
    }
  }
}
