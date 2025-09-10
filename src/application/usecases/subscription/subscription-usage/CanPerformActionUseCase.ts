import { CanPerformActionInputDTO } from '@/src/application/dtos/backend/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionError, SubscriptionErrorType, SubscriptionUsageRepository } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for checking if a profile can perform an action
 * Following SOLID principles and Clean Architecture
 */
export class CanPerformActionUseCase implements IUseCase<CanPerformActionInputDTO, boolean> {
  constructor(
    private subscriptionUsageRepository: SubscriptionUsageRepository,
  ) { }

  /**
   * Execute the use case to check if profile can perform action
   * @param params Action check parameters
   * @returns Whether the action can be performed
   */
  async execute(params: CanPerformActionInputDTO): Promise<boolean> {
    try {
      // Validate required fields
      if (!params.profileId?.trim()) {
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Profile ID is required',
          'CanPerformActionUseCase.execute',
          { params }
        );
      }

      if (!params.action?.trim()) {
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Action is required',
          'CanPerformActionUseCase.execute',
          { params }
        );
      }

      const canPerform = await this.subscriptionUsageRepository.canPerformAction(
        params.profileId,
        params.action,
        params.shopId
      );

      return canPerform;
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to check if action can be performed',
        'CanPerformActionUseCase.execute',
        { params },
        error
      );
    }
  }
}
