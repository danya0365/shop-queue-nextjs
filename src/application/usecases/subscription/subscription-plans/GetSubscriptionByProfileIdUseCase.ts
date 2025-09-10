import { SubscriptionPlanDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { ProfileSubscriptionRepository, SubscriptionError, SubscriptionErrorType, SubscriptionPlanRepository } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for getting subscription plan by profile ID
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionByProfileIdUseCase implements IUseCase<string, SubscriptionPlanDTO> {
  constructor(
    private readonly profileSubscriptionRepository: ProfileSubscriptionRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository
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
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'GetSubscriptionByProfileIdUseCase.execute',
          { profileId }
        );
      }

      // Get active subscription for the profile
      const profileSubscription = await this.profileSubscriptionRepository.getActiveSubscriptionByProfileId(profileId);

      if (!profileSubscription) {
        throw new SubscriptionError(
          SubscriptionErrorType.NOT_FOUND,
          'Active subscription not found for profile',
          'GetSubscriptionByProfileIdUseCase.execute',
          { profileId }
        );
      }

      // Get the subscription plan details
      const subscriptionPlan = await this.subscriptionPlanRepository.getPlanById(profileSubscription.planId);

      if (!subscriptionPlan) {
        throw new SubscriptionError(
          SubscriptionErrorType.NOT_FOUND,
          'Subscription plan not found',
          'GetSubscriptionByProfileIdUseCase.execute',
          { profileId, planId: profileSubscription.planId }
        );
      }

      return SubscriptionMapper.subscriptionPlanToDTO(subscriptionPlan);
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get subscription plan by profile ID',
        'GetSubscriptionByProfileIdUseCase.execute',
        { profileId },
        error
      );
    }
  }
}
