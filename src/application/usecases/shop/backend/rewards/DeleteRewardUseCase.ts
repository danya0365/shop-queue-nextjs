import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendRewardRepository } from '@/src/domain/repositories/shop/backend/backend-reward-repository';
import { ShopBackendRewardError, ShopBackendRewardErrorType } from '@/src/domain/repositories/shop/backend/backend-reward-repository';

export class DeleteRewardUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly rewardRepository: ShopBackendRewardRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      // Validate required ID
      if (!id) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.VALIDATION_ERROR,
          'Reward ID is required for deletion',
          'DeleteRewardUseCase.execute',
          { id }
        );
      }

      // Delete reward from repository
      const result = await this.rewardRepository.deleteReward(id);
      return result;
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'Failed to delete reward',
        'DeleteRewardUseCase.execute',
        { id },
        error
      );
    }
  }
}
