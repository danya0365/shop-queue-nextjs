import type { CreateServiceInputDTO, ServiceDTO, ServiceStatsDTO } from '@/src/application/dtos/shop/backend/services-dto';
import type { ServiceEntity, ServiceStatsEntity } from '@/src/domain/entities/shop/backend/backend-service.entity';

export class ServiceMapper {
  static toDTO(entity: ServiceEntity): ServiceDTO {
    return {
      id: entity.id,
      shopId: entity.shopId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      price: entity.price,
      estimatedDuration: entity.estimatedDuration,
      category: entity.category,
      isAvailable: entity.isAvailable,
      icon: entity.icon,
      popularityRank: entity.popularityRank,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toEntity(dto: ServiceDTO): ServiceEntity {
    return {
      id: dto.id,
      shopId: dto.shopId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      price: dto.price,
      estimatedDuration: dto.estimatedDuration,
      category: dto.category,
      isAvailable: dto.isAvailable,
      icon: dto.icon,
      popularityRank: dto.popularityRank,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static fromCreateDTO(dto: CreateServiceInputDTO): Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      shopId: dto.shopId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      price: dto.price,
      estimatedDuration: dto.estimatedDuration || 15, // Default 15 minutes
      category: dto.category,
      isAvailable: dto.isAvailable ?? true, // Default true
      icon: dto.icon,
      popularityRank: dto.popularityRank || 0, // Default 0
    };
  }

  static statsToDTO(entity: ServiceStatsEntity): ServiceStatsDTO {
    return {
      totalServices: entity.totalServices,
      availableServices: entity.availableServices,
      unavailableServices: entity.unavailableServices,
      averagePrice: entity.averagePrice,
      totalRevenue: entity.totalRevenue,
      servicesByCategory: entity.servicesByCategory,
      popularServices: entity.popularServices,
    };
  }

  static statsToEntity(dto: ServiceStatsDTO): ServiceStatsEntity {
    return {
      totalServices: dto.totalServices,
      availableServices: dto.availableServices,
      unavailableServices: dto.unavailableServices,
      averagePrice: dto.averagePrice,
      totalRevenue: dto.totalRevenue,
      servicesByCategory: dto.servicesByCategory,
      popularServices: dto.popularServices,
    };
  }
}
