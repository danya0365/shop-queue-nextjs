import { ShopEntity, ShopStatsEntity, ShopStatus } from "../../../domain/entities/backend/backend-shop.entity";
import { PaginationMeta } from "../../../domain/interfaces/pagination-types";
import { ShopSchema, ShopStatsSchema } from "../../schemas/backend/shop.schema";

/**
 * Mapper class for converting between shop database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseBackendShopMapper {
  /**
   * Map database schema to domain entity
   * @param schema Shop database schema
   * @returns Shop domain entity
   */
  public static toDomain(schema: ShopSchema): ShopEntity {
    return {
      id: schema.id,
      name: schema.name,
      description: schema.description,
      address: schema.address,
      phone: schema.phone,
      email: schema.email,
      website: schema.website,
      logo: schema.logo,
      qrCodeUrl: schema.qr_code_url,
      timezone: schema.timezone,
      currency: schema.currency,
      language: schema.language,
      status: schema.status as ShopStatus,
      ownerId: schema.owner_id,
      ownerName: schema.owner_name,
      queueCount: schema.queue_count || 0,
      totalServices: schema.total_services || 0,
      rating: schema.rating || 0,
      totalReviews: schema.total_reviews || 0,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
      categories: schema.categories ? schema.categories.map(cat => ({
        id: cat.id,
        name: cat.name
      })) : [],
      openingHours: schema.opening_hours ? schema.opening_hours.map(hour => ({
        dayOfWeek: hour.day_of_week,
        openTime: hour.open_time,
        closeTime: hour.close_time,
        isOpen: hour.is_open
      })) : []
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Shop domain entity
   * @returns Shop database schema
   */
  public static toSchema(entity: ShopEntity): ShopSchema {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      phone: entity.phone,
      email: entity.email,
      website: entity.website,
      logo: entity.logo,
      qr_code_url: entity.qrCodeUrl,
      timezone: entity.timezone,
      currency: entity.currency,
      language: entity.language,
      status: entity.status,
      owner_id: entity.ownerId,
      owner_name: entity.ownerName,
      queue_count: entity.queueCount,
      total_services: entity.totalServices,
      rating: entity.rating,
      total_reviews: entity.totalReviews,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      categories: entity.categories,
      opening_hours: entity.openingHours.map(hour => ({
        day_of_week: hour.dayOfWeek,
        open_time: hour.openTime,
        close_time: hour.closeTime,
        is_open: hour.isOpen
      }))
    };
  }

  /**
   * Map shop stats schema to domain entity
   * @param schema Shop stats database schema
   * @returns Shop stats domain entity
   */
  public static statsToEntity(schema: ShopStatsSchema): ShopStatsEntity {
    return {
      totalShops: schema.total_shops,
      activeShops: schema.active_shops,
      pendingApproval: schema.pending_approval,
      newThisMonth: schema.new_this_month
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
