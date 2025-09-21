import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { QueueJoinMapper } from "@/src/application/mappers/shop/customer/queue-join-mapper";
import type { ShopCustomerQueueJoinRepository } from "@/src/domain/repositories/shop/customer/queue-join-repository";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import type { ServiceOptionDTO } from "@/src/application/dtos/shop/customer/queue-join-dto";

export class GetAvailableServicesUseCase implements IUseCase<{
  shopId: string;
}, ServiceOptionDTO[]> {
  constructor(
    private readonly customerQueueJoinRepository: ShopCustomerQueueJoinRepository
  ) {}

  async execute(input: {
    shopId: string;
  }): Promise<ServiceOptionDTO[]> {
    const shopId = input.shopId;

    try {
      // Validate input
      if (!shopId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetAvailableServicesUseCase.execute",
          { shopId }
        );
      }

      // Get available services from repository
      const serviceEntities = await this.customerQueueJoinRepository.getAvailableServices(shopId);

      // Map entities to DTOs
      return serviceEntities.map(service => QueueJoinMapper.toServiceOptionDTO(service));
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        "Failed to get available services",
        "GetAvailableServicesUseCase.execute",
        { shopId, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
