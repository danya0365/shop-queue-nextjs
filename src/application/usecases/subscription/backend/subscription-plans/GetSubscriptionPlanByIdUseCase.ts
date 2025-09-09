import { SubscriptionPlanDTO } from '@/src/application/dtos/subscription/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/subscription/backend/subscription-mapper';
import type { BackendSubscriptionPlanRepository } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';

/**
 * Use case for getting subscription plan by ID
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionPlanByIdUseCase implements IUseCase<string, SubscriptionPlanDTO> {
  constructor(
    private readonly subscriptionPlanRepository: BackendSubscriptionPlanRepository
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
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Subscription plan ID is required',
          'GetSubscriptionPlanByIdUseCase.execute',
          { id }
        );
      }

      const subscriptionPlan = await this.subscriptionPlanRepository.getPlanById(id);
      if (!subscriptionPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          'Subscription plan not found',
          'GetSubscriptionPlanByIdUseCase.execute',
          { id }
        );
      }
      return SubscriptionMapper.subscriptionPlanToDTO(subscriptionPlan);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to get subscription plan by ID',
        'GetSubscriptionPlanByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
