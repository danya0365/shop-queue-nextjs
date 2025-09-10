import { SubscriptionPlanDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import type { BackendProfileSubscriptionRepository, BackendSubscriptionPlanRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for getting subscription plan by profile ID
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionByProfileIdUseCase implements IUseCase<string, SubscriptionPlanDTO> {
  constructor(
    private readonly profileSubscriptionRepository: BackendProfileSubscriptionRepository,
    private readonly subscriptionPlanRepository: BackendSubscriptionPlanRepository
  ) { }

  /**
   * Execute the use case to get subscription plan by profile ID
   * @param profileId Profile ID
   * @returns Subscription plan data
   */
  async execute(profileId: string): Promise<SubscriptionPlanDTO> {
    try {
      // Validate input
      if (!profileId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'GetSubscriptionByProfileIdUseCase.execute',
          { profileId }
        );
      }

      // Get active subscription for the profile
      const profileSubscription = await this.profileSubscriptionRepository.getActiveSubscriptionByProfileId(profileId);
      
      if (!profileSubscription) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          'Active subscription not found for profile',
          'GetSubscriptionByProfileIdUseCase.execute',
          { profileId }
        );
      }

      // Get the subscription plan details
      const subscriptionPlan = await this.subscriptionPlanRepository.getPlanById(profileSubscription.planId);
      
      if (!subscriptionPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          'Subscription plan not found',
          'GetSubscriptionByProfileIdUseCase.execute',
          { profileId, planId: profileSubscription.planId }
        );
      }
      
      return SubscriptionMapper.subscriptionPlanToDTO(subscriptionPlan);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to get subscription plan by profile ID',
        'GetSubscriptionByProfileIdUseCase.execute',
        { profileId },
        error
      );
    }
  }
}
