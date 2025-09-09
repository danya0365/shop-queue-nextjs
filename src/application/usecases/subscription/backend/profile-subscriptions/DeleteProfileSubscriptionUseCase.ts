import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendProfileSubscriptionRepository } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';
import { BackendSubscriptionError, BackendSubscriptionErrorType } from '@/src/domain/repositories/subscription/backend/backend-subscription-repository';

/**
 * Use case for deleting profile subscription
 * Following SOLID principles and Clean Architecture
 */
export class DeleteProfileSubscriptionUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly profileSubscriptionRepository: BackendProfileSubscriptionRepository
  ) { }

  /**
   * Execute the use case to delete profile subscription
   * @param id Profile subscription ID to delete
   * @returns Success status
   */
  async execute(id: string): Promise<boolean> {
    try {
      // Validate input
      if (!id?.trim()) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          'Profile subscription ID is required',
          'DeleteProfileSubscriptionUseCase.execute',
          { id }
        );
      }

      // Check if profile subscription exists
      const existingProfileSubscription = await this.profileSubscriptionRepository.getSubscriptionById(id);
      if (!existingProfileSubscription) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          'Profile subscription not found',
          'DeleteProfileSubscriptionUseCase.execute',
          { id }
        );
      }

      const result = await this.profileSubscriptionRepository.deleteSubscription(id);
      return result;
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'Failed to delete profile subscription',
        'DeleteProfileSubscriptionUseCase.execute',
        { id },
        error
      );
    }
  }
}
