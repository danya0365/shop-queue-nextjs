import { CreateRewardDTO, RewardDTO } from '@/src/application/dtos/shop/backend/reward-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { RewardMapper } from '@/src/application/mappers/shop/backend/reward-mapper';
import { CreateRewardEntity } from '@/src/domain/entities/shop/backend/backend-reward.entity';
import type { ShopBackendRewardRepository } from '@/src/domain/repositories/shop/backend/backend-reward-repository';
import { ShopBackendRewardError, ShopBackendRewardErrorType } from '@/src/domain/repositories/shop/backend/backend-reward-repository';

export class CreateRewardUseCase implements IUseCase<CreateRewardDTO, RewardDTO> {
  constructor(
    private readonly rewardRepository: ShopBackendRewardRepository
  ) { }

  async execute(input: CreateRewardDTO): Promise<RewardDTO> {
    try {
      // Validate required fields
      if (!input.shopId || !input.name || !input.type || input.pointsRequired === undefined || input.value === undefined) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.VALIDATION_ERROR,
          'Missing required reward fields',
          'CreateRewardUseCase.execute',
          { input }
        );
      }

      // Validate positive values
      if (input.pointsRequired < 0 || input.value < 0) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.VALIDATION_ERROR,
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
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'Failed to create reward',
        'CreateRewardUseCase.execute',
        { input },
        error
      );
    }
  }
}
