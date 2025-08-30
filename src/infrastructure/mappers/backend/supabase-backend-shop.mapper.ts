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
      logo: schema.logo_url,
      qrCodeUrl: schema.qr_code_url,
      timezone: schema.timezone,
      currency: schema.currency,
      language: schema.language,
      status: schema.status as ShopStatus,
      ownerId: schema.owner_id,
      ownerName: schema.owner_name,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
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
      logo_url: entity.logo,
      qr_code_url: entity.qrCodeUrl,
      timezone: entity.timezone,
      currency: entity.currency,
      language: entity.language,
      status: entity.status,
      owner_id: entity.ownerId,
      owner_name: entity.ownerName,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
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
