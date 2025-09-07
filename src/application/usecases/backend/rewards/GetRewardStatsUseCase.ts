import { RewardStatsDTO } from '@/src/application/dtos/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/backend/reward-mapper';
import type { BackendRewardRepository } from '@/src/domain/repositories/backend/backend-reward-repository';
import { BackendRewardError, BackendRewardErrorType } from '@/src/domain/repositories/backend/backend-reward-repository';

export class GetRewardStatsUseCase implements IUseCase<void, RewardStatsDTO> {
  constructor(
    private readonly rewardRepository: BackendRewardRepository
  ) { }

  async execute(): Promise<RewardStatsDTO> {
    try {
      const stats = await this.rewardRepository.getRewardStats();
      return RewardMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof BackendRewardError) {
        throw error;
      }

      throw new BackendRewardError(
        BackendRewardErrorType.UNKNOWN,
        'Failed to get reward statistics',
        'GetRewardStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
