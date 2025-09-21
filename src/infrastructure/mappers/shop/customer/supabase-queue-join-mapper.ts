import type {
  ServiceOptionEntity,
  QueueServiceEntity,
  ShopQueueInfoEntity,
  QueueJoinEntity,
  JoinQueueResultEntity,
} from "@/src/domain/entities/shop/customer/queue-join.entity";
import type {
  ServiceOptionSchema,
  ShopQueueInfoSchema,
  QueueJoinSchema,
  QueueServiceSchema,
  JoinQueueResultSchema,
} from "@/src/infrastructure/schemas/shop/customer/queue-join.schema";
import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";

/**
 * Mapper for converting between Supabase data and domain entities
 * Following Clean Architecture principles
 */
export class SupabaseQueueJoinMapper {
  /**
   * Convert Supabase service option data to domain entity
   */
  static toServiceOptionEntity(data: ServiceOptionSchema): ServiceOptionEntity {
    return {
      id: String(data.id || ""),
      name: String(data.name || ""),
      description: String(data.description || ""),
      price: Number(data.price || 0),
      estimatedTime: Number(data.estimated_duration || 0),
      category: String(data.category || ""),
      available: Boolean(data.is_available),
      icon: String(data.icon || ""),
    };
  }

  /**
   * Convert Supabase shop queue info data to domain entity
   */
  static toShopQueueInfoEntity(data: ShopQueueInfoSchema): ShopQueueInfoEntity {
    return {
      estimatedWaitTime: Number(data.estimated_wait_time || 0),
      currentQueueLength: Number(data.current_queue_length || 0),
      shopName: String(data.shop_name || ""),
      isAcceptingQueues: Boolean(data.is_accepting_queues),
      maxQueueLength: Number(data.max_queue_length || 0),
    };
  }

  /**
   * Convert Supabase queue join data to domain entity
   */
  static toQueueJoinEntity(data: QueueJoinSchema): QueueJoinEntity {
    return {
      id: data.id ? String(data.id) : undefined,
      shopId: String(data.shop_id || ""),
      customerName: String(data.customer_id || ""), // Using customer_id as customerName for now
      customerPhone: "", // Not available in queues table
      customerId: data.customer_id ? String(data.customer_id) : undefined,
      services: [], // Services will be joined separately
      specialRequests: data.note ? String(data.note) : undefined,
      priority: (data.priority as QueuePriority) || QueuePriority.NORMAL,
      status: (data.status as "waiting" | "serving" | "completed" | "cancelled") || "waiting",
      queueNumber: data.queue_number ? String(data.queue_number) : undefined,
      createdAt: data.created_at ? String(data.created_at) : undefined,
      updatedAt: data.updated_at ? String(data.updated_at) : undefined,
    };
  }

  /**
   * Convert Supabase queue service data to domain entity
   */
  static toQueueServiceEntity(data: QueueServiceSchema): QueueServiceEntity {
    return {
      id: String(data.id || ""),
      name: String(data.service_id || ""), // Using service_id as name for now
      price: Number(data.price || 0),
      quantity: Number(data.quantity || 1),
      estimatedTime: 0, // Not available in queue_services table
    };
  }

  /**
   * Convert Supabase join queue result data to domain entity
   */
  static toJoinQueueResultEntity(data: JoinQueueResultSchema): JoinQueueResultEntity {
    return {
      success: Boolean(data.success),
      queueNumber: data.queue_number ? String(data.queue_number) : undefined,
      estimatedWaitTime: data.estimated_wait_time ? Number(data.estimated_wait_time) : undefined,
      message: data.message ? String(data.message) : undefined,
      error: data.error ? String(data.error) : undefined,
    };
  }

  /**
   * Convert domain entity to Supabase queue join schema for creation
   */
  static fromQueueJoinEntityToCreateSchema(entity: Omit<QueueJoinEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Omit<QueueJoinSchema, 'id' | 'status' | 'created_at' | 'updated_at'> {
    return {
      shop_id: entity.shopId,
      customer_id: entity.customerId || entity.customerName, // Use customerId if available, otherwise fallback to customerName
      priority: entity.priority,
      queue_number: entity.queueNumber || "",
      note: entity.specialRequests,
    };
  }

  /**
   * Convert domain service to Supabase queue service schema
   */
  static fromQueueServiceEntityToSchema(entity: QueueServiceEntity, queueId: string): Omit<QueueServiceSchema, 'id'> {
    return {
      queue_id: queueId,
      service_id: entity.id,
      price: entity.price,
      quantity: entity.quantity,
      created_at: new Date().toISOString(), // Add required created_at field
    };
  }

  /**
   * Convert array of Supabase service option data to domain entities
   */
  static toServiceOptionEntities(data: ServiceOptionSchema[]): ServiceOptionEntity[] {
    return data.map(item => this.toServiceOptionEntity(item));
  }

  /**
   * Convert array of Supabase queue service data to domain entities
   */
  static toQueueServiceEntities(data: QueueServiceSchema[]): QueueServiceEntity[] {
    return data.map(item => this.toQueueServiceEntity(item));
  }
}
