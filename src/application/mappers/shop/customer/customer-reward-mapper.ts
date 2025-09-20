import type {
  CustomerRewardDTO,
  CustomerPointsDTO,
  RewardTransactionDTO,
  AvailableRewardDTO,
  CustomerRewardStatsDTO,
  CustomerInfoDTO,
  PaginationDTO,
  PaginatedDataDTO,
} from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type {
  CustomerRewardEntity,
  CustomerPointsEntity,
  RewardTransactionEntity,
  AvailableRewardEntity,
  CustomerRewardStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-reward.entity";

/**
 * Mapper for converting between customer reward domain entities and DTOs
 * Following Clean Architecture principles
 */
export class CustomerRewardMapper {
  /**
   * Convert CustomerRewardEntity to CustomerRewardDTO
   */
  static toCustomerRewardDTO(entity: CustomerRewardEntity): CustomerRewardDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      value: entity.value,
      pointsCost: entity.pointsCost,
      category: entity.category,
      imageUrl: entity.imageUrl,
      expiryDate: entity.expiryDate,
      termsAndConditions: entity.termsAndConditions,
      isAvailable: entity.isAvailable,
      isRedeemed: entity.isRedeemed,
      redeemedAt: entity.redeemedAt,
    };
  }

  /**
   * Convert CustomerPointsEntity to CustomerPointsDTO
   */
  static toCustomerPointsDTO(entity: CustomerPointsEntity): CustomerPointsDTO {
    return {
      currentPoints: entity.currentPoints,
      totalEarned: entity.totalEarned,
      totalRedeemed: entity.totalRedeemed,
      pointsExpiring: entity.pointsExpiring,
      expiryDate: entity.expiryDate,
      tier: entity.tier,
      nextTierPoints: entity.nextTierPoints,
      tierBenefits: entity.tierBenefits,
    };
  }

  /**
   * Convert RewardTransactionEntity to RewardTransactionDTO
   */
  static toRewardTransactionDTO(entity: RewardTransactionEntity): RewardTransactionDTO {
    return {
      id: entity.id,
      type: entity.type,
      points: entity.points,
      description: entity.description,
      date: entity.date,
      relatedOrderId: entity.relatedOrderId,
    };
  }

  /**
   * Convert AvailableRewardEntity to AvailableRewardDTO
   */
  static toAvailableRewardDTO(entity: AvailableRewardEntity): AvailableRewardDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      pointsCost: entity.pointsCost,
      category: entity.category,
      imageUrl: entity.imageUrl,
      isAvailable: entity.isAvailable,
      stock: entity.stock,
    };
  }

  /**
   * Convert CustomerRewardStatsEntity to CustomerRewardStatsDTO
   */
  static toCustomerRewardStatsDTO(entity: CustomerRewardStatsEntity): CustomerRewardStatsDTO {
    return {
      totalRewardsAvailable: entity.totalRewardsAvailable,
      totalRewardsRedeemed: entity.totalRewardsRedeemed,
      totalPointsEarned: entity.totalPointsEarned,
      totalPointsRedeemed: entity.totalPointsRedeemed,
      averagePointsPerTransaction: entity.averagePointsPerTransaction,
      mostRedeemedCategory: entity.mostRedeemedCategory,
      redemptionRate: entity.redemptionRate,
      lastRedemptionDate: entity.lastRedemptionDate,
      lastEarnDate: entity.lastEarnDate,
    };
  }

  /**
   * Convert arrays of CustomerRewardEntity to CustomerRewardDTO[]
   */
  static toCustomerRewardDTOs(entities: CustomerRewardEntity[]): CustomerRewardDTO[] {
    return entities.map(entity => this.toCustomerRewardDTO(entity));
  }

  /**
   * Convert arrays of RewardTransactionEntity to RewardTransactionDTO[]
   */
  static toRewardTransactionDTOs(entities: RewardTransactionEntity[]): RewardTransactionDTO[] {
    return entities.map(entity => this.toRewardTransactionDTO(entity));
  }

  /**
   * Convert arrays of AvailableRewardEntity to AvailableRewardDTO[]
   */
  static toAvailableRewardDTOs(entities: AvailableRewardEntity[]): AvailableRewardDTO[] {
    return entities.map(entity => this.toAvailableRewardDTO(entity));
  }

  /**
   * Convert paginated entities to PaginatedDataDTO
   */
  static toPaginatedDataDTO<T extends AvailableRewardEntity | CustomerRewardEntity | RewardTransactionEntity, U extends AvailableRewardDTO | CustomerRewardDTO | RewardTransactionDTO>(
    entities: T[],
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    },
    mapper: (entity: T) => U
  ): PaginatedDataDTO<U> {
    const paginationDTO: PaginationDTO = {
      currentPage: pagination.currentPage,
      perPage: pagination.perPage,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
    };

    return {
      data: entities.map(mapper),
      pagination: paginationDTO,
    };
  }

  /**
   * Convert complete customer rewards data to CustomerRewardsDataDTO
   */
  static toCustomerRewardsDataDTO(data: {
    customerPoints: CustomerPointsEntity;
    customerInfo: {
      customerName: string;
      memberSince: string;
    };
    availableRewards: {
      entities: AvailableRewardEntity[];
      pagination: {
        currentPage: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
    redeemedRewards: {
      entities: CustomerRewardEntity[];
      pagination: {
        currentPage: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
    rewardTransactions: {
      entities: RewardTransactionEntity[];
      pagination: {
        currentPage: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
    customerStats?: CustomerRewardStatsEntity;
  }): {
    customerPoints: CustomerPointsDTO;
    customerInfo: CustomerInfoDTO;
    availableRewards: PaginatedDataDTO<AvailableRewardDTO>;
    redeemedRewards: PaginatedDataDTO<CustomerRewardDTO>;
    rewardTransactions: PaginatedDataDTO<RewardTransactionDTO>;
    customerStats?: CustomerRewardStatsDTO;
  } {
    const customerPoints = this.toCustomerPointsDTO(data.customerPoints);
    
    const customerInfo: CustomerInfoDTO = {
      customerName: data.customerInfo.customerName,
      memberSince: data.customerInfo.memberSince,
    };

    const availableRewards = this.toPaginatedDataDTO(
      data.availableRewards.entities,
      data.availableRewards.pagination,
      this.toAvailableRewardDTO
    );

    const redeemedRewards = this.toPaginatedDataDTO(
      data.redeemedRewards.entities,
      data.redeemedRewards.pagination,
      this.toCustomerRewardDTO
    );

    const rewardTransactions = this.toPaginatedDataDTO(
      data.rewardTransactions.entities,
      data.rewardTransactions.pagination,
      this.toRewardTransactionDTO
    );

    const customerStats = data.customerStats 
      ? this.toCustomerRewardStatsDTO(data.customerStats)
      : undefined;

    return {
      customerPoints,
      customerInfo,
      availableRewards,
      redeemedRewards,
      rewardTransactions,
      customerStats,
    };
  }
}
