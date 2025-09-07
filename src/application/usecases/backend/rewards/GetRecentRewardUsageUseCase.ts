import { RewardUsageDTO } from '@/src/application/dtos/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/backend/reward-mapper';
import type { BackendRewardRepository } from '@/src/domain/repositories/backend/backend-reward-repository';
import { BackendRewardError, BackendRewardErrorType } from '@/src/domain/repositories/backend/backend-reward-repository';

export interface GetRecentRewardUsageInput {
  limit?: number;
}

export class GetRecentRewardUsageUseCase implements IUseCase<GetRecentRewardUsageInput, RewardUsageDTO[]> {
  constructor(
    private readonly rewardRepository: BackendRewardRepository
  ) { }

  async execute(input: GetRecentRewardUsageInput = {}): Promise<RewardUsageDTO[]> {
    try {
      const limit = input.limit || 10;

      if (limit < 1 || limit > 100) {
        throw new BackendRewardError(
          BackendRewardErrorType.VALIDATION_ERROR,
          'Limit must be between 1 and 100',
          'GetRecentRewardUsageUseCase.execute',
          { input }
        );
      }

      const recentUsage = await this.rewardRepository.getRecentRewardUsage(limit);
      return recentUsage.map(usage => RewardMapper.usageToDTO(usage));
    } catch (error) {
      if (error instanceof BackendRewardError) {
        throw error;
      }

      throw new BackendRewardError(
        BackendRewardErrorType.UNKNOWN,
        'Failed to get recent reward usage',
        'GetRecentRewardUsageUseCase.execute',
        { input },
        error
      );
    }
  }
}
