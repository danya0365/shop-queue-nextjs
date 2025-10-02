import type {
  CustomerStatsDTO,
  GetCustomerStatsInputDTO,
} from "@/src/application/dtos/shop/customer/customer-history-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopCustomerHistoryRepository } from "@/src/domain/repositories/shop/customer/customer-history-repository";
import {
  ShopCustomerHistoryError,
  ShopCustomerHistoryErrorType,
} from "@/src/domain/repositories/shop/customer/customer-history-repository";

export class GetCustomerStatsUseCase
  implements IUseCase<GetCustomerStatsInputDTO, CustomerStatsDTO>
{
  constructor(
    private readonly customerHistoryRepository: ShopCustomerHistoryRepository
  ) {}

  async execute(input: GetCustomerStatsInputDTO): Promise<CustomerStatsDTO> {
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

      if (!customerId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetCustomerStatsUseCase.execute",
          { customerId }
        );
      }

      const customerStats =
        await this.customerHistoryRepository.getCustomerStats(
          shopId,
          customerId
        );

      return customerStats;
    } catch (error) {
      return {
        totalQueues: 0,
        completedQueues: 0,
        cancelledQueues: 0,
        totalSpent: 0,
        averageRating: 0,
        favoriteService: "",
        memberSince: "",
      };
    }
  }
}
