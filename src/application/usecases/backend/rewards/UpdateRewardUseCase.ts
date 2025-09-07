import { UpdateRewardDTO, RewardDTO } from '@/src/application/dtos/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/backend/reward-mapper';
import type { BackendRewardRepository } from '@/src/domain/repositories/backend/backend-reward-repository';
import { BackendRewardError, BackendRewardErrorType } from '@/src/domain/repositories/backend/backend-reward-repository';

export class UpdateRewardUseCase implements IUseCase<UpdateRewardDTO, RewardDTO> {
  constructor(
    private readonly rewardRepository: BackendRewardRepository
  ) { }

  async execute(input: UpdateRewardDTO): Promise<RewardDTO> {
    try {
      // Validate required ID
      if (!input.id) {
        throw new BackendRewardError(
          BackendRewardErrorType.VALIDATION_ERROR,
          'Reward ID is required for update',
          'UpdateRewardUseCase.execute',
          { input }
        );
      }

      // Validate positive values if provided
      if (input.pointsRequired !== undefined && input.pointsRequired < 0) {
        throw new BackendRewardError(
          BackendRewardErrorType.VALIDATION_ERROR,
          'Points required must be a positive number',
          'UpdateRewardUseCase.execute',
          { input }
        );
      }

      if (input.value !== undefined && input.value < 0) {
        throw new BackendRewardError(
          BackendRewardErrorType.VALIDATION_ERROR,
          'Value must be a positive number',
          'UpdateRewardUseCase.execute',
          { input }
        );
      }

      // Map DTO to entity (excluding id)
      const updateData = {
        name: input.name,
        description: input.description,
        type: input.type,
        pointsRequired: input.pointsRequired,
        value: input.value,
        isAvailable: input.isAvailable,
        expiryDays: input.expiryDays,
        usageLimit: input.usageLimit,
        icon: input.icon
      };

      // Update reward in repository
      const updatedReward = await this.rewardRepository.updateReward(input.id, updateData);

      // Use mapper to convert entity to DTO
      return RewardMapper.toDTO(updatedReward);
    } catch (error) {
      if (error instanceof BackendRewardError) {
        throw error;
      }

      throw new BackendRewardError(
        BackendRewardErrorType.UNKNOWN,
        'Failed to update reward',
        'UpdateRewardUseCase.execute',
        { input },
        error
      );
    }
  }
}
