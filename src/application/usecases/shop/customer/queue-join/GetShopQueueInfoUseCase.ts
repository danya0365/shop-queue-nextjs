import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { QueueJoinMapper } from "@/src/application/mappers/shop/customer/queue-join-mapper";
import type { ShopCustomerQueueJoinRepository } from "@/src/domain/repositories/shop/customer/queue-join-repository";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import type { ShopQueueInfoDTO } from "@/src/application/dtos/shop/customer/queue-join-dto";

export class GetShopQueueInfoUseCase implements IUseCase<{
  shopId: string;
}, ShopQueueInfoDTO> {
  constructor(
    private readonly customerQueueJoinRepository: ShopCustomerQueueJoinRepository
  ) {}

  async execute(input: {
    shopId: string;
  }): Promise<ShopQueueInfoDTO> {
    const shopId = input.shopId;
    
    try {

      if (!shopId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetShopQueueInfoUseCase.execute",
          { shopId }
        );
      }

      // Get shop queue info from repository
      const queueInfoEntity = await this.customerQueueJoinRepository.getShopQueueInfo(shopId);

      // Map entity to DTO
      return QueueJoinMapper.toShopQueueInfoDTO(queueInfoEntity);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        "Failed to get shop queue info",
        "GetShopQueueInfoUseCase.execute",
        { shopId, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
