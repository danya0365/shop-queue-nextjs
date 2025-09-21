import type {
  CustomerQueueStatusEntity,
  QueueProgressEntity,
  QueueServiceEntity,
} from "@/src/domain/entities/shop/customer/customer-queue-status.entity";
import type {
  CustomerQueueStatusSchema,
  QueueProgressSchema,
  CustomerQueueServiceSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-queue-status.schema";

/**
 * Mapper for converting between Supabase data and domain entities
 * Following Clean Architecture principles
 */
export class SupabaseCustomerQueueStatusMapper {
  /**
   * Convert Supabase customer queue status data to domain entity
   */
  static toCustomerQueueStatusEntity(data: CustomerQueueStatusSchema): CustomerQueueStatusEntity {
    return {
      id: String(data.id || ""),
      queueNumber: String(data.queue_number || ""),
      status: (data.status as "waiting" | "confirmed" | "serving" | "completed" | "cancelled") || "waiting",
      customerName: String(data.customer_name || ""),
      customerPhone: String(data.customer_phone || ""),
      services: this.toQueueServiceNames(data.services || []),
      totalPrice: Number(data.total_price || 0),
      estimatedWaitTime: Number(data.estimated_wait_time || 0),
      position: Number(data.position || 0),
      specialRequests: data.special_requests ? String(data.special_requests) : undefined,
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
    };
  }

  /**
   * Convert Supabase queue progress data to domain entity
   */
  static toQueueProgressEntity(data: QueueProgressSchema): QueueProgressEntity {
    return {
      currentNumber: String(data.current_number || ""),
      totalAhead: Number(data.total_ahead || 0),
      averageServiceTime: Number(data.average_service_time || 0),
      estimatedCallTime: new Date(data.estimated_call_time || Date.now()),
    };
  }

  /**
   * Convert Supabase service data to domain entity
   */
  static toQueueServiceEntity(data: CustomerQueueServiceSchema): QueueServiceEntity {
    return {
      id: String(data.id || ""),
      name: String(data.name || ""),
      price: Number(data.price || 0),
      duration: Number(data.duration || 0),
      category: data.category ? String(data.category) : undefined,
    };
  }

  /**
   * Convert array of Supabase service data to domain entities
   */
  static toQueueServiceEntities(data: CustomerQueueServiceSchema[]): QueueServiceEntity[] {
    return data.map(item => this.toQueueServiceEntity(item));
  }

  /**
   * Convert array of Supabase service data to service names (string array)
   */
  static toQueueServiceNames(data: CustomerQueueServiceSchema[]): string[] {
    return data.map(item => String(item.name || ""));
  }

  /**
   * Convert domain entity to Supabase schema (for updates/inserts)
   */
  static fromCustomerQueueStatusEntity(entity: CustomerQueueStatusEntity): Partial<CustomerQueueStatusSchema> {
    return {
      id: entity.id,
      shop_id: "", // This should be set by the repository
      customer_id: "", // This should be set by the repository
      queue_number: entity.queueNumber,
      status: entity.status,
      customer_name: entity.customerName,
      customer_phone: entity.customerPhone,
      estimated_wait_time: entity.estimatedWaitTime,
      position: entity.position,
      special_requests: entity.specialRequests || null,
      total_price: entity.totalPrice,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }

  /**
   * Convert domain entity to Supabase schema for queue progress
   */
  static fromQueueProgressEntity(entity: QueueProgressEntity): Partial<QueueProgressSchema> {
    return {
      shop_id: "", // This should be set by the repository
      current_number: entity.currentNumber,
      total_ahead: entity.totalAhead,
      average_service_time: entity.averageServiceTime,
      estimated_call_time: entity.estimatedCallTime.toISOString(),
    };
  }
}
