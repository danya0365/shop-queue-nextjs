import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendRewardRepository } from '@/src/domain/repositories/backend/backend-reward-repository';
import { BackendRewardError, BackendRewardErrorType } from '@/src/domain/repositories/backend/backend-reward-repository';

export class DeleteRewardUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly rewardRepository: BackendRewardRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      // Validate required ID
      if (!id) {
        throw new BackendRewardError(
          BackendRewardErrorType.VALIDATION_ERROR,
          'Reward ID is required for deletion',
          'DeleteRewardUseCase.execute',
          { id }
        );
      }

      // Delete reward from repository
      const result = await this.rewardRepository.deleteReward(id);
      return result;
    } catch (error) {
      if (error instanceof BackendRewardError) {
        throw error;
      }

      throw new BackendRewardError(
        BackendRewardErrorType.UNKNOWN,
        'Failed to delete reward',
        'DeleteRewardUseCase.execute',
        { id },
        error
      );
    }
  }
}
