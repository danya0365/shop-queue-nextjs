import { ShopDTO, ShopStatsDTO } from '@/src/application/dtos/backend/shops-dto';
import { ShopEntity, ShopStatsEntity } from '@/src/domain/entities/backend/backend-shop.entity';

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
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description || '',
      address: entity.address || '',
      phone: entity.phone || '',
      email: entity.email || '',
      categoryId: '', // These fields are not in the entity, consider updating the entity or DTO
      categoryName: '',
      ownerId: entity.ownerId,
      ownerName: entity.ownerName || '',
      status: this.mapShopStatus(entity.status),
      openingHours: [], // Not in entity, consider updating
      queueCount: 0, // Not in entity, consider updating
      totalServices: 0, // Not in entity, consider updating
      rating: 0, // Not in entity, consider updating
      totalReviews: 0, // Not in entity, consider updating
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt || ''
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
}
