import { CreateRewardDTO, RewardDTO } from '@/src/application/dtos/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/backend/reward-mapper';
import { CreateRewardEntity } from '@/src/domain/entities/backend/backend-reward.entity';
import type { BackendRewardRepository } from '@/src/domain/repositories/backend/backend-reward-repository';
import { BackendRewardError, BackendRewardErrorType } from '@/src/domain/repositories/backend/backend-reward-repository';

export class CreateRewardUseCase implements IUseCase<CreateRewardDTO, RewardDTO> {
  constructor(
    private readonly rewardRepository: BackendRewardRepository
  ) { }

  async execute(input: CreateRewardDTO): Promise<RewardDTO> {
    try {
      // Validate required fields
      if (!input.shopId || !input.name || !input.type || input.pointsRequired === undefined || input.value === undefined) {
        throw new BackendRewardError(
          BackendRewardErrorType.VALIDATION_ERROR,
          'Missing required reward fields',
          'CreateRewardUseCase.execute',
          { input }
        );
      }

      // Validate positive values
      if (input.pointsRequired < 0 || input.value < 0) {
        throw new BackendRewardError(
          BackendRewardErrorType.VALIDATION_ERROR,
          'Points required and value must be positive numbers',
          'CreateRewardUseCase.execute',
          { input }
        );
      }

      // Map DTO to entity
      const rewardEntity: Omit<CreateRewardEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        shopId: input.shopId,
        name: input.name,
        description: input.description,
        type: input.type,
        pointsRequired: input.pointsRequired,
        value: input.value,
        isAvailable: input.isAvailable ?? true,
        expiryDays: input.expiryDays,
        usageLimit: input.usageLimit,
        icon: input.icon
      };

      // Create reward in repository
      const createdReward = await this.rewardRepository.createReward(rewardEntity);

      // Use mapper to convert entity to DTO
      return RewardMapper.toDTO(createdReward);
    } catch (error) {
      if (error instanceof BackendRewardError) {
        throw error;
      }

      throw new BackendRewardError(
        BackendRewardErrorType.UNKNOWN,
        'Failed to create reward',
        'CreateRewardUseCase.execute',
        { input },
        error
      );
    }
  }
}
