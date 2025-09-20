import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { QueueStatusStatsMapper } from "@/src/application/mappers/shop/customer/customer-dashboard-mapper";
import type { ShopCustomerDashboardRepository } from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import {
  ShopCustomerDashboardError,
  ShopCustomerDashboardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import type { QueueStatusStatsDTO } from "@/src/application/dtos/shop/customer/customer-dashboard-dto";

export class GetQueueStatusUseCase implements IUseCase<string, QueueStatusStatsDTO> {
  constructor(
    private readonly customerDashboardRepository: ShopCustomerDashboardRepository
  ) {}

  async execute(shopId: string): Promise<QueueStatusStatsDTO> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetQueueStatusUseCase.execute",
          { shopId }
        );
      }

      const queueStatusEntity = await this.customerDashboardRepository.getQueueStatus(shopId);

      if (!queueStatusEntity) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.NOT_FOUND,
          `Queue status not found for shop ${shopId}`,
          "GetQueueStatusUseCase.execute",
          { shopId }
        );
      }

      return QueueStatusStatsMapper.toDTO(queueStatusEntity);
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }

      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.UNKNOWN,
        "Failed to get queue status",
        "GetQueueStatusUseCase.execute",
        { shopId },
        error as Error
      );
    }
  }
}
