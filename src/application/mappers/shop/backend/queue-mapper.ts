import { QueueDTO, QueueStatsDTO } from '@/src/application/dtos/shop/backend/queues-dto';
import { QueueEntity, QueueStatsEntity } from '@/src/domain/entities/shop/backend/backend-queue.entity';

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
      queueServices: entity.queueServices.map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        quantity: service.quantity,
        price: service.price,
        total: service.total
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
      completedAt: entity.completedAt
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
      inProgressQueueToday: entity.inProgressQueueToday,
      totalCompletedToday: entity.totalCompletedToday,
      totalCancelledToday: entity.totalCancelledToday,
      
      // All-time statistics
      allQueueTotal: entity.allQueueTotal,
      allWaitingQueue: entity.allWaitingQueue,
      allInProgressQueue: entity.allInProgressQueue,
      allCompletedTotal: entity.allCompletedTotal,
      allCancelledTotal: entity.allCancelledTotal,
      
      // Performance metrics
      avgWaitTimeMinutes: entity.avgWaitTimeMinutes,
      
      // Shop-specific data (optional)
      shopId: entity.shopId
    };
  }
}
