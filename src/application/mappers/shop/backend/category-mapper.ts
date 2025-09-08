import { CategoryDTO, CategoryStatsDTO } from "@/src/application/dtos/shop/backend/categories-dto";
import { CategoryEntity, CategoryStatsEntity } from "@/src/domain/entities/shop/backend/backend-category.entity";

/**
 * Mapper for converting between category domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class CategoryMapper {
  /**
   * Convert category entity to DTO
   * @param entity Category entity
   * @returns Category DTO
   */
  public static toDTO(entity: CategoryEntity): CategoryDTO {
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      description: entity.description,
      icon: entity.icon,
      color: entity.color,
      shopsCount: entity.shopsCount,
      servicesCount: entity.servicesCount,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Convert category stats entity to DTO
   * @param entity Category stats entity
   * @returns Category stats DTO
   */
  public static statsToDTO(entity: CategoryStatsEntity): CategoryStatsDTO {
    return {
      totalCategories: entity.totalCategories,
      activeCategories: entity.activeCategories,
      totalShops: entity.totalShops,
      totalServices: entity.totalServices,
      mostPopularCategory: entity.mostPopularCategory,
      leastPopularCategory: entity.leastPopularCategory
    };
  }
}
