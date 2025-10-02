import { PaymentMethod } from "@/src/application/dtos/shop/backend/payments-dto";
import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import type {
  CustomerInfoEntity,
  CustomerQueueHistoryEntity,
  CustomerQueueServiceEntity,
  CustomerStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-history.entity";
import type {
  CustomerInfoSchema,
  CustomerQueueHistorySchema,
  CustomerQueueServiceSchema,
  CustomerStatsSchema,
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
    return {
      id: data.id || "",
      queueNumber: data.queue_number || "",
      shopName: data.shop_name || "",
      services: this.toQueueServiceEntitiesFromRPC(
        (data.services as any) || []
      ),
      totalAmount: 0, // RPC doesn't provide this directly
      status: data.status as QueueStatus,
      queueDate: data.queue_date || "",
      queueTime: "", // RPC doesn't provide this directly
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

  /**
   * Convert Supabase queue history data to domain entity
   */
  static toQueueHistoryEntity(
    data: CustomerQueueHistorySchema
  ): CustomerQueueHistoryEntity {
    return {
      id: data.id || "",
      queueNumber: data.queue_number || "",
      shopName: data.shop_name || "",
      services: this.toQueueServiceEntities(data.services || []),
      totalAmount: Number(data.total_amount || 0),
      status: data.status as QueueStatus,
      queueDate: data.queue_date || "",
      queueTime: data.queue_time || "",
      completedAt: data.completed_at || undefined,
      waitTime: data.wait_time || undefined,
      serviceTime: data.service_time || undefined,
      rating: data.rating || undefined,
      feedback: data.feedback || undefined,
      employeeName: data.employee_name || undefined,
      paymentMethod: data.payment_method as PaymentMethod,
    };
  }

  /**
   * Convert Supabase service data to domain entity
   */
  static toQueueServiceEntity(
    data: CustomerQueueServiceSchema
  ): CustomerQueueServiceEntity {
    return {
      id: data.id || "",
      name: data.name || "",
      price: data.price || 0,
      quantity: data.quantity || 1,
    };
  }

  /**
   * Convert Supabase services array to domain entities
   */
  static toQueueServiceEntities(
    data: CustomerQueueServiceSchema[]
  ): CustomerQueueServiceEntity[] {
    return data.map((service) => this.toQueueServiceEntity(service));
  }

  /**
   * Convert Supabase stats data to domain entity
   */
  static toStatsEntity(data: CustomerStatsSchema): CustomerStatsEntity {
    return {
      totalQueues: data.total_queues || 0,
      completedQueues: data.completed_queues || 0,
      cancelledQueues: data.cancelled_queues || 0,
      totalSpent: data.total_spent || 0,
      averageRating: data.average_rating || 0,
      favoriteService: data.favorite_service || "",
      memberSince: data.member_since || "",
    };
  }

  /**
   * Convert Supabase customer info data to domain entity
   */
  static toCustomerInfoEntity(data: CustomerInfoSchema): CustomerInfoEntity {
    return {
      customerName: data.customer_name || "",
      memberSince: data.member_since || "",
    };
  }

  /**
   * Convert domain entities to Supabase data (if needed for create/update operations)
   */
  static fromQueueHistoryEntity(
    entity: CustomerQueueHistoryEntity
  ): Record<string, unknown> {
    return {
      id: entity.id,
      queue_number: entity.queueNumber,
      shop_name: entity.shopName,
      services: entity.services.map((service) => ({
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

  static fromCustomerInfoEntity(
    entity: CustomerInfoEntity
  ): Record<string, unknown> {
    return {
      customer_name: entity.customerName,
      member_since: entity.memberSince,
    };
  }
}
