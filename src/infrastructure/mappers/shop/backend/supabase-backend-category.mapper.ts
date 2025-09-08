import { CategoryEntity, CategoryStatsEntity } from "@/src/domain/entities/shop/backend/backend-category.entity";
import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import { CategorySchema, CategoryStatsSchema } from "@/src/infrastructure/schemas/shop/backend/category.schema";

/**
 * Mapper class for converting between category database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseShopBackendCategoryMapper {
  /**
   * Map database schema to domain entity
   * @param schema Category database schema
   * @returns Category domain entity
   */
  public static toDomain(schema: CategorySchema): CategoryEntity {
    return {
      id: schema.id,
      slug: schema.slug,
      name: schema.name,
      description: schema.description,
      icon: schema.icon,
      color: schema.color,
      isActive: schema.is_active,
      sortOrder: schema.sort_order,
      shopsCount: schema.shops_count || 0,
      servicesCount: schema.services_count || 0,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Category domain entity
   * @returns Category database schema
   */
  public static toSchema(entity: CategoryEntity): CategorySchema {
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      description: entity.description,
      icon: entity.icon,
      color: entity.color,
      is_active: entity.isActive,
      sort_order: entity.sortOrder,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      shops_count: entity.shopsCount,
      services_count: entity.servicesCount
    };
  }

  /**
   * Map category stats schema to domain entity
   * @param schema Category stats database schema
   * @returns Category stats domain entity
   */
  public static statsToEntity(schema: CategoryStatsSchema): CategoryStatsEntity {
    return {
      totalCategories: schema.total_categories,
      activeCategories: schema.active_categories,
      totalShops: schema.total_shops,
      totalServices: schema.total_services,
      mostPopularCategory: schema.most_popular_category,
      leastPopularCategory: schema.least_popular_category
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
