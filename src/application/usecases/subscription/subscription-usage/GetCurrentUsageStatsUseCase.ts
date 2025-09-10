import { CurrentUsageStatsDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { SubscriptionError, SubscriptionErrorType, SubscriptionUsageRepository } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for getting current usage statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetCurrentUsageStatsUseCase implements IUseCase<string, CurrentUsageStatsDTO> {
  constructor(
    private readonly subscriptionUsageRepository: SubscriptionUsageRepository
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
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'GetCurrentUsageStatsUseCase.execute',
          { profileId }
        );
      }

      const currentUsageStats = await this.subscriptionUsageRepository.getCurrentUsageStats(profileId);
      return SubscriptionMapper.currentUsageStatsToDTO(currentUsageStats);
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get current usage statistics',
        'GetCurrentUsageStatsUseCase.execute',
        { profileId },
        error
      );
    }
  }
}
