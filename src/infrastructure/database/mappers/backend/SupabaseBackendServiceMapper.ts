import type { ServiceEntity, ServiceStatsEntity } from '@/src/domain/entities/backend/ServiceEntity';
import type { ServiceRow, ServiceStatsRow } from '@/src/infrastructure/database/schemas/backend/service-schema';

export class SupabaseBackendServiceMapper {
  static toDomain(row: ServiceRow): ServiceEntity {
    return {
      id: row.id,
      shopId: row.shop_id,
      name: row.name,
      slug: row.slug,
      description: row.description || undefined,
      price: row.price,
      estimatedDuration: row.estimated_duration || undefined,
      category: row.category || undefined,
      isAvailable: row.is_available ?? true,
      icon: row.icon || undefined,
      popularityRank: row.popularity_rank || 0,
      createdAt: row.created_at || undefined,
      updatedAt: row.updated_at || undefined,
    };
  }

  static toDatabase(entity: ServiceEntity): Partial<ServiceRow> {
    return {
      id: entity.id,
      shop_id: entity.shopId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description || null,
      price: entity.price,
      estimated_duration: entity.estimatedDuration || null,
      category: entity.category || null,
      is_available: entity.isAvailable ?? true,
      icon: entity.icon || null,
      popularity_rank: entity.popularityRank || 0,
      created_at: entity.createdAt || null,
      updated_at: entity.updatedAt || null,
    };
  }

  static statsToDomain(row: ServiceStatsRow): ServiceStatsEntity {
    return {
      totalServices: row.total_services,
      availableServices: row.available_services,
      unavailableServices: row.unavailable_services,
      averagePrice: row.average_price,
      totalRevenue: row.total_revenue,
      servicesByCategory: row.services_by_category,
      popularServices: row.popular_services.map(service => ({
        id: service.id,
        name: service.name,
        bookingCount: service.booking_count,
      })),
    };
  }
}
