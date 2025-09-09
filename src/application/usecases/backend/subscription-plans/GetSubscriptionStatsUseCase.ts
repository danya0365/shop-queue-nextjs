import { SubscriptionStatsDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import type { BackendSubscriptionPlanRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for getting subscription statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetSubscriptionStatsUseCase implements IUseCase<void, SubscriptionStatsDTO> {
  constructor(
    private readonly subscriptionPlanRepository: BackendSubscriptionPlanRepository
  ) { }

  /**
   * Execute the use case to get subscription statistics
   * @returns Subscription statistics
   */
  async execute(): Promise<SubscriptionStatsDTO> {
    try {
      const subscriptionStats = await this.subscriptionPlanRepository.getSubscriptionStats();
      return SubscriptionMapper.subscriptionStatsToDTO(subscriptionStats);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to get subscription statistics',
        'GetSubscriptionStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
