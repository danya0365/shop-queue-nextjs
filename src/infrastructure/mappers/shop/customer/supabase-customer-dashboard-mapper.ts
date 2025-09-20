import {
  QueueStatusStatsEntity,
  PopularServiceEntity,
  PromotionEntity,
} from "@/src/domain/entities/shop/customer/customer-dashboard.entity";
import {
  QueueSchema,
  ServiceSchema,
  PromotionSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-dashboard.schema";

/**
 * Mapper for converting between Supabase database records and domain entities
 * for customer dashboard functionality
 */
export class SupabaseCustomerDashboardMapper {
  /**
   * Convert Supabase queue data to domain entity
   */
  static toQueueStatusStatsEntity(
    queuesData: QueueSchema[]
  ): QueueStatusStatsEntity {
    const waitingQueues = queuesData.filter(
      (queue) => queue.status === "waiting"
    );
    const servingQueues = queuesData.filter(
      (queue) => queue.status === "serving"
    );

    const totalWaiting = waitingQueues.length;
    const currentNumber =
      servingQueues.length > 0
        ? servingQueues[0].queue_number
        : waitingQueues.length > 0
        ? waitingQueues[0].queue_number
        : "A001";
    const estimatedWaitTime = totalWaiting * 5; // 5 minutes per person
    const averageServiceTime = 15; // 15 minutes average

    return {
      totalWaiting,
      currentNumber,
      estimatedWaitTime,
      averageServiceTime,
    };
  }

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
   * Convert Supabase promotion data to domain entity
   */
  static toPromotionEntity(data: PromotionSchema): PromotionEntity {
    return {
      id: String(data.id),
      title: String(data.title),
      description: String(data.description),
      discount: Number(data.discount_value || 0),
      validUntil: String(data.valid_until || ""),
      icon: String(data.icon || ""),
    };
  }

  /**
   * Convert Supabase promotions array to domain entities
   */
  static toPromotionEntities(data: PromotionSchema[]): PromotionEntity[] {
    const now = new Date();
    
    return data
      .filter((promotion) => {
        const startDate = new Date(promotion.start_date || now);
        const endDate = new Date(promotion.end_date || now);
        return (
          promotion.is_active !== false &&
          startDate <= now &&
          endDate >= now
        );
      })
      .map((promotion) => this.toPromotionEntity(promotion));
  }

  /**
   * Convert domain entities to Supabase data (if needed for create/update operations)
   */
  static fromPopularServiceEntity(entity: PopularServiceEntity): Partial<ServiceSchema> {
    return {
      name: entity.name,
      description: entity.description,
      price: entity.price,
      estimated_time: entity.estimatedTime,
      icon: entity.icon,
    };
  }

  static fromPromotionEntity(entity: PromotionEntity): Partial<PromotionSchema> {
    return {
      title: entity.title,
      description: entity.description,
      discount_value: entity.discount,
      valid_until: entity.validUntil,
      icon: entity.icon,
    };
  }
}
