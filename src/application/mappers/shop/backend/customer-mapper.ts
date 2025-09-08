import { CustomerDTO, CustomerStatsDTO } from '@/src/application/dtos/shop/backend/customers-dto';
import { CustomerEntity, CustomerStatsEntity } from '@/src/domain/entities/shop/backend/backend-customer.entity';

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class CustomerMapper {
  /**
   * Map domain entity to DTO
   * @param entity Customer domain entity
   * @returns Customer DTO
   */
  public static toDTO(entity: CustomerEntity): CustomerDTO {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone || undefined,
      email: entity.email || undefined,
      dateOfBirth: entity.dateOfBirth || undefined,
      gender: entity.gender || undefined,
      address: entity.address || undefined,
      totalQueues: entity.totalQueues,
      totalPoints: entity.totalPoints,
      membershipTier: entity.membershipTier,
      lastVisit: entity.lastVisit || undefined,
      notes: entity.notes || undefined,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Customer stats domain entity
   * @returns Customer stats DTO
   */
  public static statsToDTO(entity: CustomerStatsEntity): CustomerStatsDTO {
    return {
      totalCustomers: entity.totalCustomers,
      newCustomersThisMonth: entity.newCustomersThisMonth,
      activeCustomersToday: entity.activeCustomersToday,
      goldMembers: entity.goldMembers,
      silverMembers: entity.silverMembers,
      bronzeMembers: entity.bronzeMembers,
      regularMembers: entity.regularMembers
    };
  }
}
