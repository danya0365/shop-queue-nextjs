import type {
  CustomerQueueStatusEntity,
  QueueProgressEntity,
  QueueServiceEntity,
} from "@/src/domain/entities/shop/customer/customer-queue-status.entity";
import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
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
   * Updated to match RPC function return structure
   */
  static toCustomerQueueStatusEntity(data: CustomerQueueStatusSchema): CustomerQueueStatusEntity {
    // Parse services from JSONB if it's an array
    const services = Array.isArray(data.services) ? data.services : [];
    
    // Calculate total price from services
    const totalPrice = services.reduce((sum, service) => {
      return sum + (Number(service.price || 0) * Number(service.quantity || 1));
    }, 0);

    return {
      id: String(data.id || ""),
      queueNumber: String(data.queue_number || ""),
      status: this.mapStatusToEnum(data.status) || QueueStatus.WAITING,
      customerName: String(data.customer_name || ""),
      customerPhone: String(data.customer_phone || ""),
      services: this.toQueueServiceNames(services),
      totalPrice: totalPrice,
      estimatedWaitTime: Number(data.estimated_duration || 0),
      position: 0, // Position is not stored in DB, will be calculated separately if needed
      specialRequests: data.note ? String(data.note) : undefined,
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
   * Updated to match RPC function return structure
   */
  static toQueueServiceEntity(data: CustomerQueueServiceSchema): QueueServiceEntity {
    return {
      id: String(data.service_id || data.id || ""),
      name: String(data.service_name || ""),
      price: Number(data.price || 0),
      duration: 0, // Duration not returned by RPC, default to 0
      category: undefined, // Category not returned by RPC
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
    return data.map(item => String(item.service_name || ""));
  }

  /**
   * Convert domain entity to Supabase schema (for updates/inserts)
   * Note: This is not used for RPC functions, kept for compatibility
   */
  static fromCustomerQueueStatusEntity(entity: CustomerQueueStatusEntity): Partial<CustomerQueueStatusSchema> {
    return {
      id: entity.id,
      shop_id: "", // This should be set by the repository
      customer_id: "", // This should be set by the repository
      queue_number: entity.queueNumber,
      status: this.mapStatusToString(entity.status),
      priority: "normal", // Default priority
      customer_name: entity.customerName,
      customer_phone: entity.customerPhone || null,
      estimated_duration: entity.estimatedWaitTime,
      note: entity.specialRequests || null,
      services: [], // Services handled separately
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

  /**
   * Map status string to QueueStatus enum
   * @param status Status string from database
   * @returns QueueStatus enum value or undefined
   */
  private static mapStatusToEnum(status: string | undefined): QueueStatus | undefined {
    if (!status) return undefined;
    
    switch (status.toLowerCase()) {
      case "waiting":
        return QueueStatus.WAITING;
      case "confirmed":
        return QueueStatus.WAITING; // Map confirmed to waiting for customer view
      case "serving":
        return QueueStatus.SERVING;
      case "completed":
        return QueueStatus.COMPLETED;
      case "cancelled":
        return QueueStatus.CANCELLED;
      case "no_show":
        return QueueStatus.CANCELLED; // Map no_show to cancelled for customer view
      default:
        return QueueStatus.WAITING; // Default to waiting if unknown
    }
  }

  /**
   * Map QueueStatus enum to status string
   * @param status QueueStatus enum value
   * @returns Status string for database
   */
  private static mapStatusToString(status: QueueStatus | undefined): "waiting" | "confirmed" | "serving" | "completed" | "cancelled" | undefined {
    if (!status) return undefined;
    
    switch (status) {
      case QueueStatus.WAITING:
        return "waiting";
      case QueueStatus.SERVING:
        return "serving";
      case QueueStatus.COMPLETED:
        return "completed";
      case QueueStatus.CANCELLED:
        return "cancelled";
      default:
        return "waiting"; // Default to waiting if unknown
    }
  }
}
