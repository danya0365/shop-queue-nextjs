import type {
  CustomerRewardEntity,
  CustomerPointsEntity,
  RewardTransactionEntity,
  AvailableRewardEntity,
  CustomerRewardStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-reward.entity";
import type {
  CustomerPointsSchema,
  CustomerRewardSchema,
  RewardTransactionSchema,
  AvailableRewardSchema,
  CustomerRewardStatsSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-reward.schema";
import type {
  CustomerPointsDTO,
  CustomerRewardDTO,
  RewardTransactionDTO,
  AvailableRewardDTO,
  CustomerRewardStatsDTO,
} from "@/src/application/dtos/shop/customer/customer-reward-dto";

/**
 * Mapper for converting between Supabase data and domain entities
 * Following Clean Architecture principles
 */
export class SupabaseCustomerRewardMapper {
  /**
   * Convert Supabase customer points data to domain entity
   */
  static toCustomerPointsEntity(data: CustomerPointsSchema): CustomerPointsEntity {
    return {
      id: String(data.id || ""),
      currentPoints: Number(data.current_points || 0),
      totalEarned: Number(data.total_earned || 0),
      totalRedeemed: Number(data.total_redeemed || 0),
      pointsExpiring: Number(data.points_expiring || 0),
      expiryDate: data.expiry_date ? String(data.expiry_date) : undefined,
      tier: (data.tier as "Bronze" | "Silver" | "Gold" | "Platinum") || "Bronze",
      nextTierPoints: Number(data.next_tier_points || 0),
      tierBenefits: Array.isArray(data.tier_benefits) ? data.tier_benefits.map(String) : [],
    };
  }

  /**
   * Convert Supabase customer reward data to domain entity
   */
  static toCustomerRewardEntity(data: CustomerRewardSchema): CustomerRewardEntity {
    return {
      id: String(data.id || ""),
      name: String(data.name || ""),
      description: String(data.description || ""),
      type: (data.type as "discount" | "free_item" | "cashback" | "points") || "discount",
      value: Number(data.value || 0),
      pointsCost: Number(data.points_cost || 0),
      category: String(data.category || ""),
      imageUrl: data.image_url ? String(data.image_url) : undefined,
      expiryDate: data.expiry_date ? String(data.expiry_date) : undefined,
      termsAndConditions: Array.isArray(data.terms_and_conditions) ? data.terms_and_conditions.map(String) : [],
      isAvailable: Boolean(data.is_available),
      isRedeemed: Boolean(data.is_redeemed),
      redeemedAt: data.redeemed_at ? String(data.redeemed_at) : undefined,
    };
  }

  /**
   * Convert Supabase reward transaction data to domain entity
   */
  static toRewardTransactionEntity(data: RewardTransactionSchema): RewardTransactionEntity {
    return {
      id: String(data.id || ""),
      type: (data.type as "earned" | "redeemed" | "expired") || "earned",
      points: Number(data.points || 0),
      description: String(data.description || ""),
      date: String(data.date || ""),
      relatedOrderId: data.related_order_id ? String(data.related_order_id) : undefined,
    };
  }

  /**
   * Convert Supabase available reward data to domain entity
   */
  static toAvailableRewardEntity(data: AvailableRewardSchema): AvailableRewardEntity {
    return {
      id: String(data.id || ""),
      name: String(data.name || ""),
      description: String(data.description || ""),
      pointsCost: Number(data.points_cost || 0),
      category: String(data.category || ""),
      imageUrl: data.image_url ? String(data.image_url) : undefined,
      isAvailable: Boolean(data.is_available),
      stock: data.stock ? Number(data.stock) : undefined,
    };
  }

  /**
   * Convert Supabase customer reward stats data to domain entity
   */
  static toCustomerRewardStatsEntity(data: CustomerRewardStatsSchema): CustomerRewardStatsEntity {
    return {
      id: String(data.id || ""),
      totalRewardsAvailable: Number(data.total_rewards_available || 0),
      totalRewardsRedeemed: Number(data.total_rewards_redeemed || 0),
      totalPointsEarned: Number(data.total_points_earned || 0),
      totalPointsRedeemed: Number(data.total_points_redeemed || 0),
      averagePointsPerTransaction: Number(data.average_points_per_transaction || 0),
      mostRedeemedCategory: String(data.most_redeemed_category || ""),
      redemptionRate: Number(data.redemption_rate || 0),
      lastRedemptionDate: data.last_redemption_date ? String(data.last_redemption_date) : undefined,
      lastEarnDate: data.last_earn_date ? String(data.last_earn_date) : undefined,
    };
  }

  /**
   * Convert domain entities to DTOs for presentation layer
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
   * Convert domain entities to Supabase data (if needed for create/update operations)
   */
  static fromCustomerPointsEntity(entity: CustomerPointsEntity): Record<string, unknown> {
    return {
      id: entity.id,
      current_points: entity.currentPoints,
      total_earned: entity.totalEarned,
      total_redeemed: entity.totalRedeemed,
      points_expiring: entity.pointsExpiring,
      expiry_date: entity.expiryDate,
      tier: entity.tier,
      next_tier_points: entity.nextTierPoints,
      tier_benefits: entity.tierBenefits,
    };
  }

  static fromCustomerRewardEntity(entity: CustomerRewardEntity): Record<string, unknown> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      value: entity.value,
      points_cost: entity.pointsCost,
      category: entity.category,
      image_url: entity.imageUrl,
      expiry_date: entity.expiryDate,
      terms_and_conditions: entity.termsAndConditions,
      is_available: entity.isAvailable,
      is_redeemed: entity.isRedeemed,
      redeemed_at: entity.redeemedAt,
    };
  }

  static fromRewardTransactionEntity(entity: RewardTransactionEntity): Record<string, unknown> {
    return {
      id: entity.id,
      type: entity.type,
      points: entity.points,
      description: entity.description,
      date: entity.date,
      related_order_id: entity.relatedOrderId,
    };
  }

  static fromAvailableRewardEntity(entity: AvailableRewardEntity): Record<string, unknown> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      points_cost: entity.pointsCost,
      category: entity.category,
      image_url: entity.imageUrl,
      is_available: entity.isAvailable,
      stock: entity.stock,
    };
  }

  static fromCustomerRewardStatsEntity(entity: CustomerRewardStatsEntity): Record<string, unknown> {
    return {
      id: entity.id,
      total_rewards_available: entity.totalRewardsAvailable,
      total_rewards_redeemed: entity.totalRewardsRedeemed,
      total_points_earned: entity.totalPointsEarned,
      total_points_redeemed: entity.totalPointsRedeemed,
      average_points_per_transaction: entity.averagePointsPerTransaction,
      most_redeemed_category: entity.mostRedeemedCategory,
      redemption_rate: entity.redemptionRate,
      last_redemption_date: entity.lastRedemptionDate,
      last_earn_date: entity.lastEarnDate,
    };
  }
}
