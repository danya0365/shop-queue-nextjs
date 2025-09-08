import { PaymentEntity, PaymentMethod, PaymentMethodStatsEntity, PaymentStatsEntity, PaymentStatus } from "@/src/domain/entities/shop/backend/backend-payment.entity";
import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import { PaymentSchema, PaymentStatsSchema } from "@/src/infrastructure/schemas/shop/backend/payment.schema";

/**
 * Mapper class for converting between payment database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseShopBackendPaymentMapper {
  /**
   * Map database schema to domain entity
   * @param schema Payment database schema
   * @returns Payment domain entity
   */
  public static toDomain(schema: PaymentSchema): PaymentEntity {
    return {
      id: schema.id,
      queueId: schema.queue_id,
      queueNumber: schema.queue_number,
      customerName: schema.customer_name,
      totalAmount: schema.total_amount,
      paidAmount: schema.paid_amount,
      paymentMethod: schema.payment_method as PaymentMethod | null,
      paymentStatus: schema.payment_status as PaymentStatus,
      paymentDate: schema.payment_date,
      processedByEmployeeId: schema.processed_by_employee_id,
      processedByEmployeeName: schema.processed_by_employee_name,
      shopId: schema.shop_id,
      shopName: schema.shop_name,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Payment domain entity
   * @returns Payment database schema
   */
  public static toSchema(entity: PaymentEntity): PaymentSchema {
    return {
      id: entity.id,
      queue_id: entity.queueId,
      queue_number: entity.queueNumber,
      customer_name: entity.customerName,
      total_amount: entity.totalAmount,
      paid_amount: entity.paidAmount,
      payment_method: entity.paymentMethod,
      payment_status: entity.paymentStatus,
      payment_date: entity.paymentDate,
      processed_by_employee_id: entity.processedByEmployeeId,
      processed_by_employee_name: entity.processedByEmployeeName,
      shop_id: entity.shopId,
      shop_name: entity.shopName,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }

  /**
   * Map payment stats schema to domain entity
   * @param schema Payment stats database schema
   * @returns Payment stats domain entity
   */
  public static statsToEntity(schema: PaymentStatsSchema): PaymentStatsEntity {
    return {
      totalPayments: schema.total_payments,
      totalRevenue: schema.total_revenue,
      paidPayments: schema.paid_payments,
      unpaidPayments: schema.unpaid_payments,
      partialPayments: schema.partial_payments,
      todayRevenue: schema.today_revenue,
      averagePaymentAmount: schema.average_payment_amount,
      mostUsedPaymentMethod: schema.most_used_payment_method
    };
  }

  /**
   * Map payment method stats to domain entity
   * @param stats Payment method stats data
   * @returns Payment method stats domain entity
   */
  public static methodStatsToEntity(stats: PaymentMethodStatsEntity): PaymentMethodStatsEntity {
    return stats;
  }

  /**
   * Create pagination metadata from database results
   * @param page Current page number
   * @param limit Items per page
   * @param totalItems Total number of items
   * @returns Pagination metadata
   */
  public static createPaginationMeta(
    page: number,
    limit: number,
    totalItems: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}
