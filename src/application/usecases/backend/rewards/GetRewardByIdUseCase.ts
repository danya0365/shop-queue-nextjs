import { RewardDTO } from '@/src/application/dtos/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/backend/reward-mapper';
import type { BackendRewardRepository } from '@/src/domain/repositories/backend/backend-reward-repository';
import { BackendRewardError, BackendRewardErrorType } from '@/src/domain/repositories/backend/backend-reward-repository';

export class GetRewardByIdUseCase implements IUseCase<string, RewardDTO> {
  constructor(
    private readonly rewardRepository: BackendRewardRepository
  ) { }

  async execute(id: string): Promise<RewardDTO> {
    try {
      if (!id) {
        throw new BackendRewardError(
          BackendRewardErrorType.VALIDATION_ERROR,
          'Reward ID is required',
          'GetRewardByIdUseCase.execute',
          { id }
        );
      }

      const reward = await this.rewardRepository.getRewardById(id);
      
      if (!reward) {
        throw new BackendRewardError(
          BackendRewardErrorType.NOT_FOUND,
          `Reward with ID ${id} not found`,
          'GetRewardByIdUseCase.execute',
          { id }
        );
      }

      return RewardMapper.toDTO(reward);
    } catch (error) {
      if (error instanceof BackendRewardError) {
        throw error;
      }

      throw new BackendRewardError(
        BackendRewardErrorType.UNKNOWN,
        'Failed to get reward by ID',
        'GetRewardByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
