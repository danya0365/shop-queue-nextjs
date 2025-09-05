import { PromotionDTO, PromotionStatsDTO, PaginatedPromotionsDTO } from '@/src/application/dtos/backend/promotions-dto';
import { PromotionEntity, PromotionStatsEntity, PaginatedPromotionsEntity } from '@/src/domain/entities/backend/backend-promotion.entity';

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class PromotionMapper {
  /**
   * Map domain entity to DTO
   * @param entity Promotion domain entity
   * @returns Promotion DTO
   */
  public static toDTO(entity: PromotionEntity): PromotionDTO {
    return {
      id: entity.id,
      shopId: entity.shopId,
      shopName: entity.shopName || '',
      name: entity.name,
      description: entity.description,
      type: entity.type,
      value: entity.value,
      minPurchaseAmount: entity.minPurchaseAmount,
      maxDiscountAmount: entity.maxDiscountAmount,
      startAt: entity.startAt,
      endAt: entity.endAt,
      usageLimit: entity.usageLimit,
      status: entity.status,
      conditions: entity.conditions,
      createdBy: entity.createdBy,
      createdByName: entity.createdByName || null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Promotion stats domain entity
   * @returns Promotion stats DTO
   */
  public static statsToDTO(entity: PromotionStatsEntity): PromotionStatsDTO {
    return {
      totalPromotions: entity.totalPromotions,
      activePromotions: entity.activePromotions,
      inactivePromotions: entity.inactivePromotions,
      expiredPromotions: entity.expiredPromotions,
      scheduledPromotions: entity.scheduledPromotions,
      totalUsage: entity.totalUsage,
      totalDiscountGiven: entity.totalDiscountGiven,
      averageDiscountAmount: entity.averageDiscountAmount,
      mostUsedPromotionType: entity.mostUsedPromotionType
    };
  }

  /**
   * Map paginated promotions entity to DTO
   * @param entity Paginated promotions entity
   * @returns Paginated promotions DTO
   */
  public static toPaginatedDTO(entity: PaginatedPromotionsEntity): PaginatedPromotionsDTO {
    return {
      data: entity.data.map(promotion => this.toDTO(promotion)),
      pagination: {
        currentPage: entity.pagination.currentPage,
        totalPages: entity.pagination.totalPages,
        totalItems: entity.pagination.totalItems,
        itemsPerPage: entity.pagination.itemsPerPage,
        hasNextPage: entity.pagination.hasNextPage,
        hasPrevPage: entity.pagination.hasPrevPage
      }
    };
  }
}
