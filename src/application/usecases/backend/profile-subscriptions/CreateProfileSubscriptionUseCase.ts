import { CreateProfileSubscriptionInputDTO, ProfileSubscriptionDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { BillingPeriod, CreateProfileSubscriptionEntity, SubscriptionStatus } from '@/src/domain/entities/backend/backend-subscription.entity';
import type { BackendProfileSubscriptionRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for creating profile subscription
 * Following SOLID principles and Clean Architecture
 */
export class CreateProfileSubscriptionUseCase implements IUseCase<CreateProfileSubscriptionInputDTO, ProfileSubscriptionDTO> {
  constructor(
    private readonly profileSubscriptionRepository: BackendProfileSubscriptionRepository
  ) { }

  /**
   * Execute the use case to create profile subscription
   * @param params Profile subscription creation parameters
   * @returns Created profile subscription data
   */
  async execute(params: CreateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO> {
    try {
      // Validate required fields
      if (!params.profileId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'CreateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      if (!params.planId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Plan ID is required',
          'CreateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      if (!params.billingPeriod) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Billing period is required',
          'CreateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      if (params.pricePerPeriod === undefined || params.pricePerPeriod < 0) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Price per period is required and must be non-negative',
          'CreateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      // Validate enums
      if (!Object.values(BillingPeriod).includes(params.billingPeriod as BillingPeriod)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid billing period',
          'CreateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      if (params.status && !Object.values(SubscriptionStatus).includes(params.status as SubscriptionStatus)) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Invalid subscription status',
          'CreateProfileSubscriptionUseCase.execute',
          { params }
        );
      }

      // Create entity
      const createProfileSubscriptionEntity: Omit<CreateProfileSubscriptionEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        profileId: params.profileId.trim(),
        planId: params.planId.trim(),

        // Subscription details
        status: (params.status as SubscriptionStatus) || SubscriptionStatus.ACTIVE,
        billingPeriod: params.billingPeriod as BillingPeriod,

        // Dates
        startDate: params.startDate || new Date().toISOString(),
        endDate: params.endDate || undefined,
        trialEndDate: params.trialEndDate || undefined,

        // Payment
        pricePerPeriod: params.pricePerPeriod,
        currency: params.currency || 'THB',
        autoRenew: params.autoRenew !== undefined ? params.autoRenew : true,

        // Metadata
        paymentProvider: params.paymentProvider || undefined,
        externalSubscriptionId: params.externalSubscriptionId || undefined,
        metadata: params.metadata || {}
      };

      const createdProfileSubscription = await this.profileSubscriptionRepository.createSubscription(createProfileSubscriptionEntity);
      return SubscriptionMapper.profileSubscriptionToDTO(createdProfileSubscription);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to create profile subscription',
        'CreateProfileSubscriptionUseCase.execute',
        { params },
        error
      );
    }
  }
}
