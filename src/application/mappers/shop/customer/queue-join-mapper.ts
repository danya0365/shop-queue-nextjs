import type {
  ServiceOptionDTO,
  QueueServiceDTO,
  ShopQueueInfoDTO,
  JoinQueueResultDTO,
} from "@/src/application/dtos/shop/customer/queue-join-dto";
import type {
  ServiceOptionEntity,
  QueueServiceEntity,
  ShopQueueInfoEntity,
  QueueJoinEntity,
  JoinQueueResultEntity,
} from "@/src/domain/entities/shop/customer/queue-join.entity";

/**
 * Mapper for converting between queue join domain entities and DTOs
 * Following Clean Architecture principles
 */
export class QueueJoinMapper {
  /**
   * Convert ServiceOptionEntity to ServiceOptionDTO
   */
  static toServiceOptionDTO(entity: ServiceOptionEntity): ServiceOptionDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      estimatedTime: entity.estimatedTime,
      category: entity.category,
      available: entity.available,
      icon: entity.icon,
    };
  }

  /**
   * Convert ShopQueueInfoEntity to ShopQueueInfoDTO
   */
  static toShopQueueInfoDTO(entity: ShopQueueInfoEntity): ShopQueueInfoDTO {
    return {
      estimatedWaitTime: entity.estimatedWaitTime,
      currentQueueLength: entity.currentQueueLength,
      shopName: entity.shopName,
      isAcceptingQueues: entity.isAcceptingQueues,
      maxQueueLength: entity.maxQueueLength,
    };
  }

  /**
   * Convert JoinQueueResultEntity to JoinQueueResultDTO
   */
  static toJoinQueueResultDTO(entity: JoinQueueResultEntity): JoinQueueResultDTO {
    return {
      success: entity.success,
      queueNumber: entity.queueNumber,
      estimatedWaitTime: entity.estimatedWaitTime,
      message: entity.message,
      error: entity.error,
    };
  }

  /**
   * Convert join queue input to QueueJoinEntity
   */
  static toQueueJoinEntity(input: {
    shopId: string;
    customerName: string;
    customerPhone: string;
    services: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      estimatedTime: number;
    }[];
    specialRequests?: string;
    priority: "normal" | "urgent";
  }): Omit<QueueJoinEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
    return {
      shopId: input.shopId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      services: input.services.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: service.quantity,
        estimatedTime: service.estimatedTime,
      })),
      specialRequests: input.specialRequests,
      priority: input.priority,
    };
  }

  /**
   * Convert QueueServiceEntity to QueueServiceDTO
   */
  static toQueueServiceDTO(entity: QueueServiceEntity): QueueServiceDTO {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      quantity: entity.quantity,
      estimatedTime: entity.estimatedTime,
    };
  }

  /**
   * Convert QueueServiceDTO to QueueServiceEntity
   */
  static toQueueServiceEntity(dto: QueueServiceDTO): QueueServiceEntity {
    return {
      id: dto.id,
      name: dto.name,
      price: dto.price,
      quantity: dto.quantity,
      estimatedTime: dto.estimatedTime,
    };
  }
}
