import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopCustomerHistoryRepository } from "@/src/domain/repositories/shop/customer/customer-history-repository";
import {
  ShopCustomerHistoryError,
  ShopCustomerHistoryErrorType,
} from "@/src/domain/repositories/shop/customer/customer-history-repository";
import type { CustomerStatsDTO } from "@/src/application/dtos/shop/customer/customer-history-dto";

export class GetCustomerStatsUseCase implements IUseCase<{
  shopId: string;
  customerId?: string;
}, CustomerStatsDTO> {
  constructor(
    private readonly customerHistoryRepository: ShopCustomerHistoryRepository
  ) {}

  async execute(input: {
    shopId: string;
    customerId?: string;
  }): Promise<CustomerStatsDTO> {
    try {
      const { shopId, customerId } = input;

      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerStatsUseCase.execute",
          { shopId }
        );
      }

      const customerStats = await this.customerHistoryRepository.getCustomerStats(shopId, customerId);

      return customerStats;
    } catch (error) {
      if (error instanceof ShopCustomerHistoryError) {
        throw error;
      }

      throw new ShopCustomerHistoryError(
        ShopCustomerHistoryErrorType.UNKNOWN,
        "Failed to get customer stats",
        "GetCustomerStatsUseCase.execute",
        { input },
        error as Error
      );
    }
  }
}
