import {
  QueueDTO,
  QueueStatsDTO,
} from "@/src/application/dtos/backend/queues-dto";
import { PaymentDTO } from "@/src/application/dtos/backend/payments-dto";
import {
  QueueEntity,
  QueueStatsEntity,
} from "@/src/domain/entities/backend/backend-queue.entity";

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class QueueMapper {
  /**
   * Map domain entity to DTO
   * @param entity Queue domain entity
   * @returns Queue DTO
   */
  public static toDTO(entity: QueueEntity): QueueDTO {
    return {
      id: entity.id,
      customerId: entity.customerId,
      customerName: entity.customerName,
      customerPhone: entity.customerPhone,
      shopId: entity.shopId,
      shopName: entity.shopName,
      queueServices: entity.queueServices.map((service) => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        quantity: service.quantity,
        price: service.price,
        total: service.total,
      })),
      queueNumber: entity.queueNumber,
      status: entity.status,
      priority: entity.priority,
      estimatedWaitTime: entity.estimatedWaitTime,
      actualWaitTime: entity.actualWaitTime,
      notes: entity.notes,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      calledAt: entity.calledAt,
      completedAt: entity.completedAt,
      payments: entity.payments?.map(payment => ({
        id: payment.id,
        queueId: payment.queueId,
        queueNumber: payment.queueNumber,
        customerName: payment.customerName,
        totalAmount: payment.totalAmount,
        paidAmount: payment.paidAmount,
        paymentMethod: payment.paymentMethod as 'cash' | 'card' | 'qr' | 'transfer' | null,
        paymentStatus: payment.paymentStatus as 'unpaid' | 'partial' | 'paid',
        paymentDate: payment.paymentDate,
        processedByEmployeeId: payment.processedByEmployeeId,
        processedByEmployeeName: payment.processedByEmployeeName || null,
        shopId: payment.shopId,
        shopName: payment.shopName || "",
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })) || [],
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Queue stats domain entity
   * @returns Queue stats DTO
   */
  public static statsToDTO(entity: QueueStatsEntity): QueueStatsDTO {
    return {
      // Today's statistics
      totalQueueToday: entity.totalQueueToday,
      waitingQueueToday: entity.waitingQueueToday,
      confirmedQueueToday: entity.confirmedQueueToday,
      servingQueueToday: entity.servingQueueToday,
      inProgressQueueToday: entity.inProgressQueueToday,
      totalCompletedToday: entity.totalCompletedToday,
      totalCancelledToday: entity.totalCancelledToday,

      // All-time statistics
      allQueueTotal: entity.allQueueTotal,
      allWaitingQueue: entity.allWaitingQueue,
      allConfirmedQueue: entity.allConfirmedQueue,
      allServingQueue: entity.allServingQueue,
      allInProgressQueue: entity.allInProgressQueue,
      allCompletedTotal: entity.allCompletedTotal,
      allCancelledTotal: entity.allCancelledTotal,

      // Performance metrics
      avgWaitTimeMinutes: entity.avgWaitTimeMinutes,

      // Shop-specific data (optional)
      shopId: entity.shopId,
    };
  }
}
