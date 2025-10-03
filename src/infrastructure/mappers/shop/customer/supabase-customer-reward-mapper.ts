import type {
  AvailableRewardDTO,
  CustomerPointsDTO,
  CustomerRewardDTO,
  CustomerRewardStatsDTO,
  RewardTransactionDTO,
} from "@/src/application/dtos/shop/customer/customer-reward-dto";
import { MembershipTier } from "@/src/domain/entities/backend/backend-customer.entity";
import { RewardType } from "@/src/domain/entities/shop/backend/backend-reward.entity";
import {
  AvailableRewardEntity,
  CustomerPointsEntity,
  CustomerRewardEntity,
  CustomerRewardStatsEntity,
  RewardTransactionEntity,
  RewardTransactionType,
} from "@/src/domain/entities/shop/customer/customer-reward.entity";
import type {
  CustomerRewardSchema,
  CustomerRewardStatsSchema,
  GetAvailableRewardsSchema,
  GetCustomerPointsSchema,
  RewardTransactionSchema,
  RewardUsageSchema,
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
   * Convert rewards table row to AvailableRewardEntity (limited to existing columns)
   */
  static fromRewardRowToAvailableRewardEntity(
    data: import("@/src/infrastructure/schemas/shop/customer/customer-reward.schema").RewardRowSchema
  ): AvailableRewardEntity {
    return {
      id: data.id,
      name: data.name,
      description: data.description ?? "",
      pointsCost: Number(data.points_required),
      category: "", // not present on rewards table
      imageUrl: undefined, // rewards has icon; keep consistent API and leave undefined or map if desired
      isAvailable: Boolean(data.is_available ?? true),
      stock: undefined, // not present on rewards table
      shopId: data.shop_id,
      type: this.mapRewardTypeToEnum(String(data.type)) ?? RewardType.DISCOUNT,
      value: Number(data.value),
      termsAndConditions: [], // not present on rewards table
      expiryDate: undefined, // rewards has expiry_days; transform to concrete date if business rule defined
      createdAt: data.created_at ?? new Date().toISOString(),
      updatedAt: data.updated_at ?? new Date().toISOString(),
    };
  }

  /**
   * Convert reward_transactions_view row to RewardTransactionEntity
   */
  static fromRewardTransactionsViewToEntity(
    data: import("@/src/infrastructure/schemas/shop/customer/customer-reward.schema").RewardTransactionsViewSchema
  ): RewardTransactionEntity {
    const nowIso = new Date().toISOString();
    return {
      id: String(data.id || ""),
      customerId: data.customer_id || "",
      shopId: data.shop_id || "",
      type: data.type as RewardTransactionType,
      points: Number(data.points ?? 0),
      description: data.description ?? "",
      date: data.transaction_date ?? data.created_at ?? nowIso,
      // Keep domain-specific fields undefined when not present in the view
      relatedOrderId: undefined,
      relatedRewardId: data.reward_id ?? undefined,
      balanceBefore: 0,
      balanceAfter: 0,
      createdAt: data.created_at ?? nowIso,
    };
  }

  /**
   * Convert reward_usages row to domain entity (best-effort mapping from available columns only)
   */
  static fromRewardUsageToCustomerRewardEntity(
    data: RewardUsageSchema
  ): CustomerRewardEntity {
    // Only map columns that exist on reward_usages
    const nowIso = new Date().toISOString();
    return {
      id: String(data.id || ""),
      name: "", // not available on reward_usages
      description: data.source_description ?? "",
      // Reward type is not available on reward_usages; choose a safe default
      // to satisfy the non-optional domain field while keeping mapping minimal
      type: RewardType.DISCOUNT,
      value: Number(data.reward_value ?? 0),
      pointsCost: Number(data.points_used ?? 0),
      category: "", // not available on reward_usages
      imageUrl: undefined, // not available on reward_usages
      expiryDate: data.expires_at ?? undefined,
      termsAndConditions: [], // not available on reward_usages
      isAvailable: false, // usage record implies already issued/used
      isRedeemed: (data.status ?? "").toLowerCase() === "used",
      redeemedAt: data.used_at ?? undefined,
      shopId: data.shop_id,
      customerId: data.customer_id,
      createdAt: data.created_at ?? nowIso,
      updatedAt: data.updated_at ?? nowIso,
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
      type:
        (data.type as RewardTransactionType) || RewardTransactionType.EARNED,
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
    data: GetAvailableRewardsSchema
  ): AvailableRewardEntity {
    return {
      id: data.id || "",
      name: data.name || "",
      description: data.description || "",
      pointsCost: Number(data.points_cost || 0),
      category: data.category || "",
      imageUrl: data.image_url || undefined,
      isAvailable: Boolean(data.is_available),
      stock: data.stock !== undefined ? Number(data.stock) : undefined,
      type: data.type as RewardType,
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
