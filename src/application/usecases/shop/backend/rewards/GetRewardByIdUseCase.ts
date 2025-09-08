import { RewardDTO } from '@/src/application/dtos/shop/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/shop/backend/reward-mapper';
import type { ShopBackendRewardRepository } from '@/src/domain/repositories/shop/backend/backend-reward-repository';
import { ShopBackendRewardError, ShopBackendRewardErrorType } from '@/src/domain/repositories/shop/backend/backend-reward-repository';

export class GetRewardByIdUseCase implements IUseCase<string, RewardDTO> {
  constructor(
    private readonly rewardRepository: ShopBackendRewardRepository
  ) { }

  async execute(id: string): Promise<RewardDTO> {
    try {
      if (!id) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.VALIDATION_ERROR,
          'Reward ID is required',
          'GetRewardByIdUseCase.execute',
          { id }
        );
      }

      const reward = await this.rewardRepository.getRewardById(id);

      if (!reward) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.NOT_FOUND,
          `Reward with ID ${id} not found`,
          'GetRewardByIdUseCase.execute',
          { id }
        );
      }

      return RewardMapper.toDTO(reward);
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'Failed to get reward by ID',
        'GetRewardByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
