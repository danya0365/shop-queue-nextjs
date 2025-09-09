import { CurrentUsageStatsDTO } from '@/src/application/dtos/subscription/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/subscription/backend/subscription-mapper';
import type { BackendSubscriptionUsageRepository } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';

/**
 * Use case for getting current usage statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetCurrentUsageStatsUseCase implements IUseCase<string, CurrentUsageStatsDTO> {
  constructor(
    private readonly subscriptionUsageRepository: BackendSubscriptionUsageRepository
  ) { }

  /**
   * Execute the use case to get current usage statistics
   * @param profileId Profile ID to get usage stats for
   * @returns Current usage statistics
   */
  async execute(profileId: string): Promise<CurrentUsageStatsDTO> {
    try {
      // Validate input
      if (!profileId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'GetCurrentUsageStatsUseCase.execute',
          { profileId }
        );
      }

      const currentUsageStats = await this.subscriptionUsageRepository.getCurrentUsageStats(profileId);
      return SubscriptionMapper.currentUsageStatsToDTO(currentUsageStats);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to get current usage statistics',
        'GetCurrentUsageStatsUseCase.execute',
        { profileId },
        error
      );
    }
  }
}
