import type {
  AvailableRewardDTO,
  CustomerPointsDTO,
  CustomerRewardDTO,
  CustomerRewardStatsDTO,
  RewardTransactionDTO,
} from "@/src/application/dtos/shop/customer/customer-reward-dto";
import { MembershipTier } from "@/src/domain/entities/backend/backend-customer.entity";
import { RewardType } from "@/src/domain/entities/shop/backend/backend-reward.entity";
import type {
  AvailableRewardEntity,
  CustomerPointsEntity,
  CustomerRewardEntity,
  CustomerRewardStatsEntity,
  RewardTransactionEntity,
} from "@/src/domain/entities/shop/customer/customer-reward.entity";
import type {
  AvailableRewardSchema,
  CustomerRewardSchema,
  CustomerRewardStatsSchema,
  GetCustomerPointsSchema,
  RewardTransactionSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-reward.schema";

/**
 * Mapper for converting between Supabase data and domain entities
 * Following Clean Architecture principles
 */
export class SupabaseCustomerRewardMapper {
  /**
   * Convert Supabase customer points data to domain entity
   */
  static toCustomerPointsEntity(
    data: GetCustomerPointsSchema
  ): CustomerPointsEntity {
    return {
      id: data.id || "",
      customerId: data.customer_id || "",
      shopId: data.shop_id || "",
      currentPoints: Number(data.current_points || 0),
      totalEarned: Number(data.total_earned || 0),
      totalRedeemed: Number(data.total_redeemed || 0),
      pointsExpiring: 0,
      expiryDate: undefined,
      tier: data.membership_tier as MembershipTier,
      nextTierPoints: 0,
      tierBenefits: data.tier_benefits || [],
      lastUpdated: data.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Convert Supabase customer reward data to domain entity
   */
  static toCustomerRewardEntity(
    data: CustomerRewardSchema
  ): CustomerRewardEntity {
    return {
      id: String(data.id || ""),
      name: data.name || "",
      description: data.description || "",
      type: this.mapRewardTypeToEnum(data.type) || RewardType.DISCOUNT,
      value: Number(data.value || 0),
      pointsCost: Number(data.points_cost || 0),
      category: data.category || "",
      imageUrl: data.image_url || undefined,
      expiryDate: data.expiry_date || undefined,
      termsAndConditions: data.terms_and_conditions || [],
      isAvailable: Boolean(data.is_available),
      isRedeemed: Boolean(data.is_redeemed),
      redeemedAt: data.redeemed_at || undefined,
      customerId: data.customer_id || undefined,
      shopId: data.shop_id || "",
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Convert Supabase reward transaction data to domain entity
   */
  static toRewardTransactionEntity(
    data: RewardTransactionSchema
  ): RewardTransactionEntity {
    return {
      id: String(data.id || ""),
      customerId: data.customer_id || "",
      shopId: data.shop_id || "",
      type: data.type || "earned",
      points: Number(data.points || 0),
      description: data.description || "",
      date: data.date || "",
      relatedOrderId: data.related_order_id || undefined,
      relatedRewardId: undefined, // Not available in schema
      balanceBefore: 0, // Not available in schema
      balanceAfter: 0, // Not available in schema
      createdAt: data.created_at || new Date().toISOString(),
    };
  }

  /**
   * Convert Supabase available reward data to domain entity
   */
  static toAvailableRewardEntity(
    data: AvailableRewardSchema
  ): AvailableRewardEntity {
    return {
      id: String(data.id || ""),
      name: data.name || "",
      description: data.description || "",
      pointsCost: Number(data.points_cost || 0),
      category: data.category || "",
      imageUrl: data.image_url || undefined,
      isAvailable: Boolean(data.is_available),
      stock: data.stock !== undefined ? Number(data.stock) : undefined,
      type: this.mapRewardTypeToEnum(data.type) || RewardType.DISCOUNT,
      value: data.value !== undefined ? Number(data.value) : undefined,
      expiryDate: data.expiry_date || undefined,
      termsAndConditions: data.terms_and_conditions,
      shopId: data.shop_id || "",
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Convert Supabase customer reward stats data to domain entity
   */
  static toCustomerRewardStatsEntity(
    data: CustomerRewardStatsSchema
  ): CustomerRewardStatsEntity {
    return {
      customerId: data.customer_id || "",
      shopId: data.shop_id || "",
      totalRewardsAvailable: Number(data.total_rewards_available || 0),
      totalRewardsRedeemed: Number(data.total_rewards_redeemed || 0),
      totalPointsEarned: Number(data.total_points_earned || 0),
      totalPointsRedeemed: Number(data.total_points_redeemed || 0),
      averagePointsPerTransaction: Number(
        data.average_points_per_transaction || 0
      ),
      mostRedeemedCategory: data.most_redeemed_category || "",
      redemptionRate: Number(data.redemption_rate || 0),
      lastRedemptionDate: data.last_redemption_date || undefined,
      lastEarnDate: data.last_earn_date || undefined,
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

  static toRewardTransactionDTO(
    entity: RewardTransactionEntity
  ): RewardTransactionDTO {
    return {
      id: entity.id,
      type: entity.type,
      points: entity.points,
      description: entity.description,
      date: entity.date,
      relatedOrderId: entity.relatedOrderId,
    };
  }

  static toAvailableRewardDTO(
    entity: AvailableRewardEntity
  ): AvailableRewardDTO {
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

  static toCustomerRewardStatsDTO(
    entity: CustomerRewardStatsEntity
  ): CustomerRewardStatsDTO {
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
  static fromCustomerPointsEntity(
    entity: CustomerPointsEntity
  ): Record<string, unknown> {
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

  static fromCustomerRewardEntity(
    entity: CustomerRewardEntity
  ): Record<string, unknown> {
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

  static fromRewardTransactionEntity(
    entity: RewardTransactionEntity
  ): Record<string, unknown> {
    return {
      id: entity.id,
      type: entity.type,
      points: entity.points,
      description: entity.description,
      date: entity.date,
      related_order_id: entity.relatedOrderId,
    };
  }

  static fromAvailableRewardEntity(
    entity: AvailableRewardEntity
  ): Record<string, unknown> {
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

  static fromCustomerRewardStatsEntity(
    entity: CustomerRewardStatsEntity
  ): Record<string, unknown> {
    return {
      customer_id: entity.customerId,
      shop_id: entity.shopId,
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

  /**
   * Map membership tier string to enum
   */
  private static mapTierToEnum(
    tier: string | undefined
  ): MembershipTier | undefined {
    if (!tier) return undefined;

    const tierLower = tier.toLowerCase();
    switch (tierLower) {
      case "bronze":
        return MembershipTier.BRONZE;
      case "silver":
        return MembershipTier.SILVER;
      case "gold":
        return MembershipTier.GOLD;
      case "platinum":
        return MembershipTier.PLATINUM;
      default:
        return MembershipTier.BRONZE;
    }
  }

  /**
   * Map reward type string to enum
   */
  private static mapRewardTypeToEnum(
    type: string | undefined
  ): RewardType | undefined {
    if (!type) return undefined;

    const typeLower = type.toLowerCase();
    switch (typeLower) {
      case "discount":
        return RewardType.DISCOUNT;
      case "free_item":
        return RewardType.FREE_ITEM;
      case "cashback":
        return RewardType.CASHBACK;
      case "special_privilege":
        return RewardType.SPECIAL_PRIVILEGE;
      default:
        return RewardType.DISCOUNT;
    }
  }
}
