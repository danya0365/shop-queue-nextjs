import { RecordUsageInputDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendSubscriptionUsageRepository } from '@/src/domain/repositories/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/backend/backend-subscription-repository';

/**
 * Use case for recording subscription usage
 * Following SOLID principles and Clean Architecture
 */
export class RecordUsageUseCase implements IUseCase<RecordUsageInputDTO, boolean> {
  constructor(
    private readonly subscriptionUsageRepository: BackendSubscriptionUsageRepository
  ) { }

  /**
   * Execute the use case to record subscription usage
   * @param params Usage recording parameters
   * @returns Success status
   */
  async execute(params: RecordUsageInputDTO): Promise<boolean> {
    try {
      // Validate required fields
      if (!params.profileId?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'RecordUsageUseCase.execute',
          { params }
        );
      }

      if (!params.usageType?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Usage type is required',
          'RecordUsageUseCase.execute',
          { params }
        );
      }

      if (params.count === undefined || params.count < 0) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Count is required and must be non-negative',
          'RecordUsageUseCase.execute',
          { params }
        );
      }

      await this.subscriptionUsageRepository.recordUsage(
        params.profileId,
        params.shopId || null,
        params.usageType,
        params.count
      );

      return true; // Return success status
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to record usage',
        'RecordUsageUseCase.execute',
        { params },
        error
      );
    }
  }
}
