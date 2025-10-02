import {
  PopularServiceEntity,
  PromotionEntity,
} from "@/src/domain/entities/shop/customer/customer-dashboard.entity";
import {
  PopularServiceViewRecord,
  PromotionSchema,
  ServiceSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-dashboard.schema";

/**
 * Mapper for converting between Supabase database records and domain entities
 * for customer dashboard functionality
 */
export class SupabaseCustomerDashboardMapper {
  /**
   * Convert Supabase service data to domain entity
   */
  static toPopularServiceEntity(data: ServiceSchema): PopularServiceEntity {
    return {
      id: String(data.id),
      name: String(data.name),
      price: Number(data.price || 0),
      description: String(data.description || ""),
      estimatedTime: Number(data.estimated_time || 5),
      icon: String(data.icon || ""),
    };
  }

  /**
   * Convert Supabase services array to domain entities
   */
  static toPopularServiceEntities(
    data: ServiceSchema[]
  ): PopularServiceEntity[] {
    return data
      .filter((service) => (service.queue_count || 0) > 0)
      .map((service) => this.toPopularServiceEntity(service));
  }

  /**
   * Convert Supabase popular services view data to domain entity
   */
  static toPopularServiceEntityFromView(
    data: PopularServiceViewRecord
  ): PopularServiceEntity {
    return {
      id: String(data.id || ""),
      name: String(data.name || ""),
      price: 0, // View doesn't have price info
      description: String(data.category || ""),
      estimatedTime: 5, // Default time
      icon: String(""), // No icon in view
    };
  }

  /**
   * Convert Supabase popular services view array to domain entities
   */
  static toPopularServiceEntitiesFromView(
    data: PopularServiceViewRecord[]
  ): PopularServiceEntity[] {
    return data
      .filter(
        (service) =>
          service.id && service.name && (service.queue_count || 0) > 0
      )
      .map((service) => this.toPopularServiceEntityFromView(service));
  }

  /**
   * Convert Supabase promotion data to domain entity
   */
  static toPromotionEntity(data: PromotionSchema): PromotionEntity {
    return {
      id: String(data.id),
      title: String(data.name),
      description: String(data.description || ""),
      discount: Number(data.value || 0),
      validUntil: String(data.end_at || ""),
      icon: String(""), // No icon field in promotion schema
    };
  }

  /**
   * Convert Supabase promotions array to domain entities
   */
  static toPromotionEntities(data: PromotionSchema[]): PromotionEntity[] {
    const now = new Date();

    return data
      .filter((promotion) => {
        const startDate = new Date(promotion.start_at || now);
        const endDate = new Date(promotion.end_at || now);
        return (
          promotion.status === "active" && startDate <= now && endDate >= now
        );
      })
      .map((promotion) => this.toPromotionEntity(promotion));
  }

  /**
   * Convert domain entities to Supabase data (if needed for create/update operations)
   */
  static fromPopularServiceEntity(
    entity: PopularServiceEntity
  ): Partial<ServiceSchema> {
    return {
      name: entity.name,
      description: entity.description,
      price: entity.price,
      estimated_time: entity.estimatedTime,
      icon: entity.icon,
    };
  }

  static fromPromotionEntity(
    entity: PromotionEntity
  ): Partial<PromotionSchema> {
    return {
      name: entity.title,
      description: entity.description,
      value: entity.discount,
      // Note: end_at maps to validUntil
      // No icon field in PromotionSchema
    };
  }
}
