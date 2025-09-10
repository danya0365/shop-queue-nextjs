import { ProfileSubscriptionDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { SubscriptionMapper } from '@/src/application/mappers/backend/subscription-mapper';
import { ProfileSubscriptionRepository, SubscriptionError, SubscriptionErrorType } from '@/src/domain/repositories/subscription-repository';

/**
 * Use case for getting profile subscription by ID
 * Following SOLID principles and Clean Architecture
 */
export class GetProfileSubscriptionByIdUseCase implements IUseCase<string, ProfileSubscriptionDTO> {
  constructor(
    private readonly profileSubscriptionRepository: ProfileSubscriptionRepository
  ) { }

  /**
   * Execute the use case to get profile subscription by ID
   * @param id Profile subscription ID
   * @returns Profile subscription data
   */
  async execute(id: string): Promise<ProfileSubscriptionDTO> {
    try {
      // Validate input
      if (!id?.trim()) {
        throw new SubscriptionError(
          SubscriptionErrorType.VALIDATION_ERROR,
          'Profile subscription ID is required',
          'GetProfileSubscriptionByIdUseCase.execute',
          { id }
        );
      }

      const profileSubscription = await this.profileSubscriptionRepository.getSubscriptionById(id);
      if (!profileSubscription) {
        throw new SubscriptionError(
          SubscriptionErrorType.NOT_FOUND,
          'Profile subscription not found',
          'GetProfileSubscriptionByIdUseCase.execute',
          { id }
        );
      }
      return SubscriptionMapper.profileSubscriptionToDTO(profileSubscription);
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }

      throw new SubscriptionError(
        SubscriptionErrorType.UNKNOWN,
        'Failed to get profile subscription by ID',
        'GetProfileSubscriptionByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
