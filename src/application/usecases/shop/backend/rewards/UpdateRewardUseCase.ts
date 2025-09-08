import { RewardDTO, UpdateRewardDTO } from '@/src/application/dtos/shop/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/shop/backend/reward-mapper';
import type { ShopBackendRewardRepository } from '@/src/domain/repositories/shop/backend/backend-reward-repository';
import { ShopBackendRewardError, ShopBackendRewardErrorType } from '@/src/domain/repositories/shop/backend/backend-reward-repository';

export class UpdateRewardUseCase implements IUseCase<UpdateRewardDTO, RewardDTO> {
  constructor(
    private readonly rewardRepository: ShopBackendRewardRepository
  ) { }

  async execute(input: UpdateRewardDTO): Promise<RewardDTO> {
    try {
      // Validate required ID
      if (!input.id) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.VALIDATION_ERROR,
          'Reward ID is required for update',
          'UpdateRewardUseCase.execute',
          { input }
        );
      }

      // Validate positive values if provided
      if (input.pointsRequired !== undefined && input.pointsRequired < 0) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.VALIDATION_ERROR,
          'Points required must be a positive number',
          'UpdateRewardUseCase.execute',
          { input }
        );
      }

      if (input.value !== undefined && input.value < 0) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.VALIDATION_ERROR,
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
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'Failed to update reward',
        'UpdateRewardUseCase.execute',
        { input },
        error
      );
    }
  }
}
