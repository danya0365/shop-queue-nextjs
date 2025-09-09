import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendSubscriptionPlanRepository } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';

/**
 * Use case for deleting subscription plan
 * Following SOLID principles and Clean Architecture
 */
export class DeleteSubscriptionPlanUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly subscriptionPlanRepository: BackendSubscriptionPlanRepository
  ) { }

  /**
   * Execute the use case to delete subscription plan
   * @param id Subscription plan ID to delete
   * @returns Success status
   */
  async execute(id: string): Promise<boolean> {
    try {
      // Validate input
      if (!id?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Subscription plan ID is required',
          'DeleteSubscriptionPlanUseCase.execute',
          { id }
        );
      }

      // Check if subscription plan exists
      const existingSubscriptionPlan = await this.subscriptionPlanRepository.getPlanById(id);
      if (!existingSubscriptionPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          'Subscription plan not found',
          'DeleteSubscriptionPlanUseCase.execute',
          { id }
        );
      }

      const result = await this.subscriptionPlanRepository.deletePlan(id);
      return result;
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to delete subscription plan',
        'DeleteSubscriptionPlanUseCase.execute',
        { id },
        error
      );
    }
  }
}
