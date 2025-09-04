import { PaymentDTO, PaymentStatsDTO, PaginatedPaymentsDTO } from '@/src/application/dtos/backend/payments-dto';
import { PaymentEntity, PaymentStatsEntity, PaginatedPaymentsEntity } from '@/src/domain/entities/backend/backend-payment.entity';

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class PaymentMapper {
  /**
   * Map domain entity to DTO
   * @param entity Payment domain entity
   * @returns Payment DTO
   */
  public static toDTO(entity: PaymentEntity): PaymentDTO {
    return {
      id: entity.id,
      queueId: entity.queueId,
      queueNumber: entity.queueNumber,
      customerName: entity.customerName,
      totalAmount: entity.totalAmount,
      paidAmount: entity.paidAmount,
      paymentMethod: entity.paymentMethod,
      paymentStatus: entity.paymentStatus,
      paymentDate: entity.paymentDate,
      processedByEmployeeId: entity.processedByEmployeeId,
      processedByEmployeeName: entity.processedByEmployeeName || null,
      shopId: entity.shopId,
      shopName: entity.shopName || '',
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Payment stats domain entity
   * @returns Payment stats DTO
   */
  public static statsToDTO(entity: PaymentStatsEntity): PaymentStatsDTO {
    return {
      totalPayments: entity.totalPayments,
      totalRevenue: entity.totalRevenue,
      paidPayments: entity.paidPayments,
      unpaidPayments: entity.unpaidPayments,
      partialPayments: entity.partialPayments,
      todayRevenue: entity.todayRevenue,
      averagePaymentAmount: entity.averagePaymentAmount,
      mostUsedPaymentMethod: entity.mostUsedPaymentMethod
    };
  }

  /**
   * Map paginated payments entity to DTO
   * @param entity Paginated payments entity
   * @returns Paginated payments DTO
   */
  public static toPaginatedDTO(entity: PaginatedPaymentsEntity): PaginatedPaymentsDTO {
    return {
      data: entity.data.map(payment => this.toDTO(payment)),
      pagination: {
        currentPage: entity.pagination.currentPage,
        totalPages: entity.pagination.totalPages,
        totalItems: entity.pagination.totalItems,
        itemsPerPage: entity.pagination.itemsPerPage,
        hasNextPage: entity.pagination.hasNextPage,
        hasPrevPage: entity.pagination.hasPrevPage
      }
    };
  }
}
