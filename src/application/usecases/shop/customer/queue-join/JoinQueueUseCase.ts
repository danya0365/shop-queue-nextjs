import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { QueueJoinMapper } from "@/src/application/mappers/shop/customer/queue-join-mapper";
import type { ShopCustomerQueueJoinRepository } from "@/src/domain/repositories/shop/customer/queue-join-repository";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import type { JoinQueueResultDTO } from "@/src/application/dtos/shop/customer/queue-join-dto";
import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";

export class JoinQueueUseCase implements IUseCase<{
  shopId: string;
  customerName: string;
  customerPhone: string;
  customerId?: string;
  services: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    estimatedTime: number;
  }[];
  specialRequests?: string;
  priority: QueuePriority;
}, JoinQueueResultDTO> {
  constructor(
    private readonly customerQueueJoinRepository: ShopCustomerQueueJoinRepository
  ) {}

  async execute(input: {
    shopId: string;
    customerName: string;
    customerPhone: string;
    customerId?: string;
    services: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      estimatedTime: number;
    }[];
    specialRequests?: string;
    priority: QueuePriority;
  }): Promise<JoinQueueResultDTO> {
    try {
      const { shopId, customerName, customerPhone, customerId, services, specialRequests, priority } = input;

      // Validate required fields
      if (!shopId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "JoinQueueUseCase.execute",
          { shopId }
        );
      }

      if (!customerName?.trim()) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Customer name is required",
          "JoinQueueUseCase.execute",
          { customerName }
        );
      }

      if (!customerPhone?.trim()) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Customer phone is required",
          "JoinQueueUseCase.execute",
          { customerPhone }
        );
      }

      if (!services || services.length === 0) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "At least one service must be selected",
          "JoinQueueUseCase.execute",
          { services }
        );
      }

      // Validate services
      for (const service of services) {
        if (!service.id || !service.name || service.price <= 0 || service.quantity <= 0) {
          throw new ShopCustomerQueueJoinError(
            ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
            "Invalid service data",
            "JoinQueueUseCase.execute",
            { service }
          );
        }
      }

      // Map input to domain entity
      const queueJoinEntity = QueueJoinMapper.toQueueJoinEntity(input);

      // Join queue through repository
      const resultEntity = await this.customerQueueJoinRepository.joinQueue(queueJoinEntity);

      // Map result to DTO
      return QueueJoinMapper.toJoinQueueResultDTO(resultEntity);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        "Failed to join queue",
        "JoinQueueUseCase.execute",
        { 
          shopId: input.shopId, 
          customerName: input.customerName,
          error: error instanceof Error ? error.message : String(error) 
        },
        error
      );
    }
  }
}
