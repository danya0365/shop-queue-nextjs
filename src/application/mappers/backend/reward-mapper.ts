import { RewardDTO, RewardStatsDTO, RewardUsageDTO, RewardsDataDTO, CreateRewardDTO, UpdateRewardDTO, RewardTypeStatsDTO } from '@/src/application/dtos/backend/reward-dto';
import { RewardEntity, RewardStatsEntity, RewardUsageEntity, PaginatedRewardsEntity, RewardTypeStatsEntity } from '@/src/domain/entities/backend/backend-reward.entity';

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class RewardMapper {
  /**
   * Map domain entity to DTO
   * @param entity Reward domain entity
   * @returns Reward DTO
   */
  public static toDTO(entity: RewardEntity): RewardDTO {
    return {
      id: entity.id,
      shopId: entity.shopId,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      pointsRequired: entity.pointsRequired,
      value: entity.value,
      isAvailable: entity.isAvailable,
      expiryDays: entity.expiryDays,
      usageLimit: entity.usageLimit,
      icon: entity.icon,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Map reward usage domain entity to DTO
   * @param entity Reward usage domain entity
   * @returns Reward usage DTO
   */
  public static usageToDTO(entity: RewardUsageEntity): RewardUsageDTO {
    return {
      id: entity.id,
      rewardId: entity.rewardId,
      customerId: entity.customerId,
      customerName: entity.customerName,
      pointsUsed: entity.pointsUsed,
      rewardValue: entity.rewardValue,
      usedAt: entity.usedAt,
      queueId: entity.queueId,
      queueNumber: entity.queueNumber
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Reward stats domain entity
   * @returns Reward stats DTO
   */
  public static statsToDTO(entity: RewardStatsEntity): RewardStatsDTO {
    return {
      totalRewards: entity.totalRewards,
      activeRewards: entity.activeRewards,
      totalRedemptions: entity.totalRedemptions,
      totalPointsRedeemed: entity.totalPointsRedeemed,
      averageRedemptionValue: entity.averageRedemptionValue,
      popularRewardType: entity.popularRewardType
    };
  }

  /**
   * Map reward type stats domain entity to DTO
   * @param entity Reward type stats domain entity
   * @returns Reward type stats DTO
   */
  public static typeStatsToDTO(entity: RewardTypeStatsEntity): RewardTypeStatsDTO {
    return {
      discount: {
        count: entity.discount.count,
        percentage: entity.discount.percentage,
        totalValue: entity.discount.totalValue
      },
      freeItem: {
        count: entity.free_item.count,
        percentage: entity.free_item.percentage,
        totalValue: entity.free_item.totalValue
      },
      cashback: {
        count: entity.cashback.count,
        percentage: entity.cashback.percentage,
        totalValue: entity.cashback.totalValue
      },
      specialPrivilege: {
        count: entity.special_privilege.count,
        percentage: entity.special_privilege.percentage,
        totalValue: entity.special_privilege.totalValue
      },
      totalRewards: entity.totalRewards
    };
  }

  /**
   * Map paginated rewards entity to rewards data DTO
   * @param paginatedEntity Paginated rewards entity
   * @param stats Reward stats entity
   * @param recentUsage Recent reward usage entities
   * @returns Rewards data DTO
   */
  public static toRewardsDataDTO(
    paginatedEntity: PaginatedRewardsEntity,
    stats: RewardStatsEntity,
    typeStats: RewardTypeStatsEntity,
    recentUsage: RewardUsageEntity[]
  ): RewardsDataDTO {
    return {
      rewards: paginatedEntity.data.map(reward => this.toDTO(reward)),
      stats: this.statsToDTO(stats),
      typeStats: this.typeStatsToDTO(typeStats),
      recentUsage: recentUsage.map(usage => this.usageToDTO(usage)),
      totalCount: paginatedEntity.pagination.totalItems
    };
  }

  /**
   * Map create DTO to domain entity
   * @param dto Create reward DTO
   * @returns Create reward entity
   */
  public static createDTOToEntity(dto: CreateRewardDTO) {
    return {
      shopId: dto.shopId,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      pointsRequired: dto.pointsRequired,
      value: dto.value,
      isAvailable: dto.isAvailable,
      expiryDays: dto.expiryDays,
      usageLimit: dto.usageLimit,
      icon: dto.icon
    };
  }

  /**
   * Map update DTO to domain entity
   * @param dto Update reward DTO
   * @returns Update reward entity
   */
  public static updateDTOToEntity(dto: UpdateRewardDTO) {
    return {
      name: dto.name,
      description: dto.description,
      type: dto.type,
      pointsRequired: dto.pointsRequired,
      value: dto.value,
      isAvailable: dto.isAvailable,
      expiryDays: dto.expiryDays,
      usageLimit: dto.usageLimit,
      icon: dto.icon
    };
  }
}
