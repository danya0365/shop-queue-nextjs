import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import type {
  CustomerInfoEntity,
  CustomerQueueHistoryEntity,
  CustomerQueueServiceEntity,
  CustomerStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-history.entity";
import type {
  GetCustomerInfoByCustomerSchema,
  GetCustomerQueueHistoryByCustomerSchema,
  GetCustomerStatsByCustomerSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-history.schema";

/**
 * Mapper for converting between Supabase data and domain entities
 * Following Clean Architecture principles
 */
export class SupabaseCustomerHistoryMapper {
  /**
   * Convert RPC queue history data to domain entity
   */
  static toQueueHistoryEntityFromRPC(
    data: GetCustomerQueueHistoryByCustomerSchema
  ): CustomerQueueHistoryEntity {
    const services = this.toQueueServiceEntitiesFromRPC(
      (data.services as Array<{
        id?: string;
        name?: string;
        price?: number;
        quantity?: number;
      }>) || []
    );

    // Calculate total amount from services
    const totalAmount = services.reduce(
      (sum, service) => sum + service.price * service.quantity,
      0
    );

    return {
      id: data.id || "",
      queueNumber: data.queue_number || "",
      shopName: data.shop_name || "",
      services,
      totalAmount,
      status: data.status as QueueStatus,
      queueDateTime: data.created_at,
      completedAt: data.completed_at || undefined,
      waitTime: data.actual_wait_time
        ? Number(data.actual_wait_time)
        : undefined,
      serviceTime: undefined, // RPC doesn't provide this directly
      rating: data.rating || undefined,
      feedback: data.feedback || undefined,
      employeeName: undefined, // RPC doesn't provide this directly
      paymentMethod: undefined, // RPC doesn't provide this directly
    };
  }

  /**
   * Convert RPC service data to domain entity
   */
  static toQueueServiceEntityFromRPC(service: {
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
  }): CustomerQueueServiceEntity {
    return {
      id: service.id || "",
      name: service.name || "",
      price: Number(service.price || 0),
      quantity: Number(service.quantity || 1),
    };
  }

  /**
   * Convert RPC services array to domain entities
   */
  static toQueueServiceEntitiesFromRPC(
    services: {
      id?: string;
      name?: string;
      price?: number;
      quantity?: number;
    }[]
  ): CustomerQueueServiceEntity[] {
    return services.map((service) => this.toQueueServiceEntityFromRPC(service));
  }

  /**
   * Convert RPC stats data to domain entity
   */
  static toStatsEntityFromRPC(
    data: GetCustomerStatsByCustomerSchema
  ): CustomerStatsEntity {
    return {
      totalQueues: data.total_queues || 0,
      completedQueues: data.completed_queues || 0,
      cancelledQueues: data.cancelled_queues || 0,
      totalSpent: data.total_spent || 0,
      averageRating: data.average_rating || 0,
      favoriteService: data.favorite_service_name || "",
      memberSince: data.member_since || "",
    };
  }

  /**
   * Convert RPC customer info data to domain entity
   */
  static toCustomerInfoEntityFromRPC(
    data: GetCustomerInfoByCustomerSchema
  ): CustomerInfoEntity {
    return {
      customerName: data.customer_name || "",
      memberSince: data.member_since || "",
    };
  }
}
