import { RewardEntity, RewardStatsEntity, RewardType, RewardUsageEntity, RewardTypeStatsEntity } from "../../../domain/entities/backend/backend-reward.entity";
import { PaginationMeta } from "../../../domain/interfaces/pagination-types";
import { RewardSchema, RewardStatsSchema, RewardUsageSchema, RewardTypeStatsSchema } from "../../schemas/backend/reward.schema";

/**
 * Mapper class for converting between reward database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseBackendRewardMapper {
  /**
   * Map database schema to domain entity
   * @param schema Reward database schema
   * @returns Reward domain entity
   */
  public static toDomain(schema: RewardSchema): RewardEntity {
    return {
      id: schema.id,
      shopId: schema.shop_id,
      shopName: schema.shop_name,
      name: schema.name,
      description: schema.description,
      type: schema.type as RewardType,
      pointsRequired: schema.points_required,
      value: schema.value,
      isAvailable: schema.is_available,
      expiryDays: schema.expiry_days,
      usageLimit: schema.usage_limit,
      icon: schema.icon,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Reward domain entity
   * @returns Reward database schema
   */
  public static toSchema(entity: RewardEntity): RewardSchema {
    return {
      id: entity.id,
      shop_id: entity.shopId,
      shop_name: entity.shopName,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      points_required: entity.pointsRequired,
      value: entity.value,
      is_available: entity.isAvailable,
      expiry_days: entity.expiryDays,
      usage_limit: entity.usageLimit,
      icon: entity.icon,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }

  /**
   * Map reward usage schema to domain entity
   * @param schema Reward usage database schema
   * @returns Reward usage domain entity
   */
  public static usageToDomain(schema: RewardUsageSchema): RewardUsageEntity {
    return {
      id: schema.id,
      rewardId: schema.reward_id,
      customerId: schema.customer_id,
      customerName: schema.customer_name,
      pointsUsed: schema.points_used,
      rewardValue: schema.reward_value,
      usedAt: schema.used_at,
      queueId: schema.queue_id,
      queueNumber: schema.queue_number
    };
  }

  /**
   * Map reward stats schema to domain entity
   * @param schema Reward stats database schema
   * @returns Reward stats domain entity
   */
  public static statsToEntity(schema: RewardStatsSchema): RewardStatsEntity {
    return {
      totalRewards: schema.total_rewards,
      activeRewards: schema.active_rewards,
      totalRedemptions: schema.total_redemptions,
      totalPointsRedeemed: schema.total_points_redeemed,
      averageRedemptionValue: schema.average_redemption_value,
      popularRewardType: schema.popular_reward_type as RewardType | null
    };
  }

  /**
   * Map reward type stats schema to domain entity
   * @param schema Reward type stats database schema
   * @returns Reward type stats domain entity
   */
  public static typeStatsToEntity(schema: RewardTypeStatsSchema): RewardTypeStatsEntity {
    return {
      discount: {
        count: schema.discount_count,
        percentage: schema.discount_percentage,
        totalValue: schema.discount_total_value
      },
      free_item: {
        count: schema.free_item_count,
        percentage: schema.free_item_percentage,
        totalValue: schema.free_item_total_value
      },
      cashback: {
        count: schema.cashback_count,
        percentage: schema.cashback_percentage,
        totalValue: schema.cashback_total_value
      },
      special_privilege: {
        count: schema.special_privilege_count,
        percentage: schema.special_privilege_percentage,
        totalValue: schema.special_privilege_total_value
      },
      totalRewards: schema.total_rewards
    };
  }

  /**
   * Create pagination metadata from database results
   * @param page Current page number
   * @param limit Items per page
   * @param totalItems Total number of items
   * @returns Pagination metadata
   */
  public static createPaginationMeta(
    page: number,
    limit: number,
    totalItems: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}
