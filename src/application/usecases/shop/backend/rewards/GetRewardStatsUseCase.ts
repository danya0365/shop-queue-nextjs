import { RewardStatsDTO } from '@/src/application/dtos/shop/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/shop/backend/reward-mapper';
import type { ShopBackendRewardRepository } from '@/src/domain/repositories/shop/backend/backend-reward-repository';
import { ShopBackendRewardError, ShopBackendRewardErrorType } from '@/src/domain/repositories/shop/backend/backend-reward-repository';

export class GetRewardStatsUseCase implements IUseCase<void, RewardStatsDTO> {
  constructor(
    private readonly rewardRepository: ShopBackendRewardRepository
  ) { }

  async execute(): Promise<RewardStatsDTO> {
    try {
      const stats = await this.rewardRepository.getRewardStats();
      return RewardMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'Failed to get reward statistics',
        'GetRewardStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
