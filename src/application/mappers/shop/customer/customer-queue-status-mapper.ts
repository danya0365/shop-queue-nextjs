import type {
  CustomerQueueStatusDTO,
  QueueProgressDTO,
} from "@/src/application/dtos/shop/customer/customer-queue-status-dto";
import type {
  CustomerQueueStatusEntity,
  QueueProgressEntity,
} from "@/src/domain/entities/shop/customer/customer-queue-status.entity";

/**
 * Mapper for customer queue status data transformation
 * Following Clean Architecture principles
 */
export class CustomerQueueStatusMapper {
  /**
   * Convert customer queue status entity to DTO
   */
  static toDTO(entity: CustomerQueueStatusEntity): CustomerQueueStatusDTO {
    return {
      id: entity.id,
      queueNumber: entity.queueNumber,
      status: entity.status,
      customerName: entity.customerName,
      customerPhone: entity.customerPhone,
      services: entity.services,
      totalPrice: entity.totalPrice,
      estimatedWaitTime: entity.estimatedWaitTime,
      position: entity.position,
      totalAhead: entity.totalAhead,
      specialRequests: entity.specialRequests,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  /**
   * Convert queue progress entity to DTO
   */
  static toProgressDTO(entity: QueueProgressEntity): QueueProgressDTO {
    return {
      currentNumber: entity.currentNumber,
      totalAhead: entity.totalAhead,
      averageServiceTime: entity.averageServiceTime,
      estimatedCallTime: entity.estimatedCallTime.toISOString(),
    };
  }

  /**
   * Convert DTO to customer queue status entity
   */
  static toEntity(dto: CustomerQueueStatusDTO): CustomerQueueStatusEntity {
    return {
      id: dto.id,
      queueNumber: dto.queueNumber,
      status: dto.status,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      services: dto.services,
      totalPrice: dto.totalPrice,
      estimatedWaitTime: dto.estimatedWaitTime,
      position: dto.position,
      totalAhead: dto.totalAhead,
      specialRequests: dto.specialRequests,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  /**
   * Convert DTO to queue progress entity
   */
  static toProgressEntity(dto: QueueProgressDTO): QueueProgressEntity {
    return {
      currentNumber: dto.currentNumber,
      totalAhead: dto.totalAhead,
      averageServiceTime: dto.averageServiceTime,
      estimatedCallTime: new Date(dto.estimatedCallTime),
    };
  }
}
