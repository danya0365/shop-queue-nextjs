import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ProfileSubscriptionRepository } from '@/src/domain/repositories/subscription-repository';
import { SubscriptionError, SubscriptionErrorType } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for deleting profile subscription
 * Following SOLID principles and Clean Architecture
 */
export class DeleteProfileSubscriptionUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly profileSubscriptionRepository: ProfileSubscriptionRepository
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
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Profile subscription ID is required',
          'DeleteProfileSubscriptionUseCase.execute',
          { id }
        );
      }

      // Check if profile subscription exists
      const existingProfileSubscription = await this.profileSubscriptionRepository.getSubscriptionById(id);
      if (!existingProfileSubscription) {
        throw new SubscriptionError(
          SubscriptionErrorType.NOT_FOUND,
          'Profile subscription not found',
          'DeleteProfileSubscriptionUseCase.execute',
          { id }
        );
      }

      const result = await this.profileSubscriptionRepository.deleteSubscription(id);
      return result;
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to delete profile subscription',
        'DeleteProfileSubscriptionUseCase.execute',
        { id },
        error
      );
    }
  }
}
