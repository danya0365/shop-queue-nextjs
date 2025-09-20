import type {
  CustomerQueueHistoryEntity,
  CustomerQueueServiceEntity,
  CustomerStatsEntity,
  CustomerInfoEntity,
} from "@/src/domain/entities/shop/customer/customer-history.entity";
import type {
  CustomerQueueHistorySchema,
  CustomerQueueServiceSchema,
  CustomerStatsSchema,
  CustomerInfoSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-history.schema";

/**
 * Mapper for converting between Supabase data and domain entities
 * Following Clean Architecture principles
 */
export class SupabaseCustomerHistoryMapper {
  /**
   * Convert Supabase queue history data to domain entity
   */
  static toQueueHistoryEntity(data: CustomerQueueHistorySchema): CustomerQueueHistoryEntity {
    return {
      id: String(data.id || ""),
      queueNumber: String(data.queue_number || ""),
      shopName: String(data.shop_name || ""),
      services: this.toQueueServiceEntities(data.services || []),
      totalAmount: Number(data.total_amount || 0),
      status: (data.status as "completed" | "cancelled" | "no_show") || "completed",
      queueDate: String(data.queue_date || ""),
      queueTime: String(data.queue_time || ""),
      completedAt: data.completed_at ? String(data.completed_at) : undefined,
      waitTime: data.wait_time ? Number(data.wait_time) : undefined,
      serviceTime: data.service_time ? Number(data.service_time) : undefined,
      rating: data.rating ? Number(data.rating) : undefined,
      feedback: data.feedback ? String(data.feedback) : undefined,
      employeeName: data.employee_name ? String(data.employee_name) : undefined,
      paymentMethod: data.payment_method as "cash" | "card" | "qr" | "transfer" || undefined,
    };
  }

  /**
   * Convert Supabase service data to domain entity
   */
  static toQueueServiceEntity(data: CustomerQueueServiceSchema): CustomerQueueServiceEntity {
    return {
      id: String(data.id || ""),
      name: String(data.name || ""),
      price: Number(data.price || 0),
      quantity: Number(data.quantity || 1),
    };
  }

  /**
   * Convert Supabase services array to domain entities
   */
  static toQueueServiceEntities(data: CustomerQueueServiceSchema[]): CustomerQueueServiceEntity[] {
    return data.map(service => this.toQueueServiceEntity(service));
  }

  /**
   * Convert Supabase stats data to domain entity
   */
  static toStatsEntity(data: CustomerStatsSchema): CustomerStatsEntity {
    return {
      totalQueues: Number(data.total_queues || 0),
      completedQueues: Number(data.completed_queues || 0),
      cancelledQueues: Number(data.cancelled_queues || 0),
      totalSpent: Number(data.total_spent || 0),
      averageRating: Number(data.average_rating || 0),
      favoriteService: String(data.favorite_service || ""),
      memberSince: String(data.member_since || ""),
    };
  }

  /**
   * Convert Supabase customer info data to domain entity
   */
  static toCustomerInfoEntity(data: CustomerInfoSchema): CustomerInfoEntity {
    return {
      customerName: String(data.customer_name || ""),
      memberSince: String(data.member_since || ""),
    };
  }

  /**
   * Convert domain entities to Supabase data (if needed for create/update operations)
   */
  static fromQueueHistoryEntity(entity: CustomerQueueHistoryEntity): Record<string, unknown> {
    return {
      id: entity.id,
      queue_number: entity.queueNumber,
      shop_name: entity.shopName,
      services: entity.services.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: service.quantity,
      })),
      total_amount: entity.totalAmount,
      status: entity.status,
      queue_date: entity.queueDate,
      queue_time: entity.queueTime,
      completed_at: entity.completedAt,
      wait_time: entity.waitTime,
      service_time: entity.serviceTime,
      rating: entity.rating,
      feedback: entity.feedback,
      employee_name: entity.employeeName,
      payment_method: entity.paymentMethod,
    };
  }

  static fromStatsEntity(entity: CustomerStatsEntity): Record<string, unknown> {
    return {
      total_queues: entity.totalQueues,
      completed_queues: entity.completedQueues,
      cancelled_queues: entity.cancelledQueues,
      total_spent: entity.totalSpent,
      average_rating: entity.averageRating,
      favorite_service: entity.favoriteService,
      member_since: entity.memberSince,
    };
  }

  static fromCustomerInfoEntity(entity: CustomerInfoEntity): Record<string, unknown> {
    return {
      customer_name: entity.customerName,
      member_since: entity.memberSince,
    };
  }
}
