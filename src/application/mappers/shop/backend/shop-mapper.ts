import { PaginatedShopsDTO, ShopCategoryDTO, ShopDTO, ShopStatsDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { PaginatedShopsEntity, ShopEntity, ShopStatsEntity } from '@/src/domain/entities/shop/backend/backend-shop.entity';

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class ShopMapper {
  /**
   * Map domain entity to DTO
   * @param entity Shop domain entity
   * @returns Shop DTO
   */
  public static toDTO(entity: ShopEntity): ShopDTO {
    const categories = this.mapShopCategories(entity);
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      phone: entity.phone,
      email: entity.email,
      categories,
      ownerId: entity.ownerId,
      ownerName: entity.ownerName || '',
      status: this.mapShopStatus(entity.status),
      openingHours: entity.openingHours.map(hour => ({
        id: `${entity.id}-${hour.dayOfWeek}`,
        shopId: entity.id,
        dayOfWeek: this.mapDayOfWeekToString(hour.dayOfWeek),
        isOpen: hour.isOpen,
        openTime: hour.openTime,
        closeTime: hour.closeTime,
        breakStart: null,
        breakEnd: null,
        createdAt: new Date(entity.createdAt),
        updatedAt: new Date(entity.updatedAt)
      })),
      queueCount: entity.queueCount,
      totalServices: entity.totalServices,
      rating: entity.rating,
      totalReviews: entity.totalReviews,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Shop stats domain entity
   * @returns Shop stats DTO
   */
  public static statsToDTO(entity: ShopStatsEntity): ShopStatsDTO {
    return {
      totalShops: entity.totalShops,
      activeShops: entity.activeShops,
      pendingApproval: entity.pendingApproval,
      newThisMonth: entity.newThisMonth
    };
  }

  /**
   * Map paginated shops entity to DTO
   * @param entity Paginated shops entity
   * @returns Paginated shops DTO
   */
  public static toPaginatedDTO(entity: PaginatedShopsEntity): PaginatedShopsDTO {
    return {
      data: entity.data.map(shop => this.toDTO(shop)),
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

  /**
   * Map shop status from domain enum to DTO string
   * @param status Shop status from domain entity
   * @returns Shop status string for DTO
   */
  private static mapShopStatus(status: string): 'active' | 'inactive' | 'pending' {
    switch (status) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      default:
        return 'pending';
    }
  }

  /**
   * Map day of week number to string
   * @param dayOfWeek Day of week number (0-6)
   * @returns Day of week string
   */
  private static mapDayOfWeekToString(dayOfWeek: number): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayOfWeek] || 'sunday';
  }

  private static mapShopCategories(entity: ShopEntity): ShopCategoryDTO[] {
    return entity.categories.map(category => ({
      id: category.id,
      name: category.name
    }));
  }
}
