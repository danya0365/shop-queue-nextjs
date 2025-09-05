import { PromotionEntity, PromotionStatsEntity, PromotionStatus, PromotionType } from "../../../domain/entities/backend/backend-promotion.entity";
import { PaginationMeta } from "../../../domain/interfaces/pagination-types";
import { PromotionSchema, PromotionStatsSchema } from "../../schemas/backend/promotion.schema";

/**
 * Mapper class for converting between promotion database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseBackendPromotionMapper {
  /**
   * Map database schema to domain entity
   * @param schema Promotion database schema
   * @returns Promotion domain entity
   */
  public static toDomain(schema: PromotionSchema): PromotionEntity {
    return {
      id: schema.id,
      shopId: schema.shop_id,
      shopName: schema.shop_name,
      name: schema.name,
      description: schema.description,
      type: schema.type as PromotionType,
      value: schema.value,
      minPurchaseAmount: schema.min_purchase_amount,
      maxDiscountAmount: schema.max_discount_amount,
      startAt: schema.start_at,
      endAt: schema.end_at,
      usageLimit: schema.usage_limit,
      status: schema.status as PromotionStatus,
      conditions: schema.conditions as Record<string, string>[] | null,
      createdBy: schema.created_by,
      createdByName: schema.created_by_name,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Promotion domain entity
   * @returns Promotion database schema
   */
  public static toSchema(entity: PromotionEntity): PromotionSchema {
    return {
      id: entity.id,
      shop_id: entity.shopId,
      shop_name: entity.shopName,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      value: entity.value,
      min_purchase_amount: entity.minPurchaseAmount,
      max_discount_amount: entity.maxDiscountAmount,
      start_at: entity.startAt,
      end_at: entity.endAt,
      usage_limit: entity.usageLimit,
      status: entity.status,
      conditions: entity.conditions as Record<string, unknown>[] | null,
      created_by: entity.createdBy,
      created_by_name: entity.createdByName,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }

  /**
   * Map promotion stats schema to domain entity
   * @param schema Promotion stats database schema
   * @returns Promotion stats domain entity
   */
  public static statsToEntity(schema: PromotionStatsSchema): PromotionStatsEntity {
    return {
      totalPromotions: schema.total_promotions,
      activePromotions: schema.active_promotions,
      inactivePromotions: schema.inactive_promotions,
      expiredPromotions: schema.expired_promotions,
      scheduledPromotions: schema.scheduled_promotions,
      totalUsage: schema.total_usage,
      totalDiscountGiven: schema.total_discount_given,
      averageDiscountAmount: schema.average_discount_amount,
      mostUsedPromotionType: schema.most_used_promotion_type
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
