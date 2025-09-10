import { SubscriptionPlanDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { SubscriptionError, SubscriptionErrorType, SubscriptionPlanRepository } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for getting subscription plan by ID
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionPlanByIdUseCase implements IUseCase<string, SubscriptionPlanDTO> {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository
  ) { }

  /**
   * Execute the use case to get subscription plan by ID
   * @param id Subscription plan ID
   * @returns Subscription plan data
   */
  async execute(id: string): Promise<SubscriptionPlanDTO> {
    try {
      // Validate input
      if (!id?.trim()) {
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Subscription plan ID is required',
          'GetSubscriptionPlanByIdUseCase.execute',
          { id }
        );
      }

      const subscriptionPlan = await this.subscriptionPlanRepository.getPlanById(id);
      if (!subscriptionPlan) {
        throw new SubscriptionError(
          SubscriptionErrorType.NOT_FOUND,
          'Subscription plan not found',
          'GetSubscriptionPlanByIdUseCase.execute',
          { id }
        );
      }
      return SubscriptionMapper.subscriptionPlanToDTO(subscriptionPlan);
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get subscription plan by ID',
        'GetSubscriptionPlanByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
