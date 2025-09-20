import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerRewardMapper } from "@/src/application/mappers/shop/customer/customer-reward-mapper";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import type { CustomerRewardStatsDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { GetCustomerRewardStatsInputDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";

export class GetCustomerRewardStatsUseCase implements IUseCase<
  GetCustomerRewardStatsInputDTO,
  CustomerRewardStatsDTO
> {
  constructor(
    private readonly customerRewardRepository: ShopCustomerRewardRepository
  ) {}

  async execute(input: GetCustomerRewardStatsInputDTO): Promise<CustomerRewardStatsDTO> {
    try {
      const { shopId, customerId } = input;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerRewardStatsUseCase.execute",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetCustomerRewardStatsUseCase.execute",
          { customerId }
        );
      }

      const customerRewardStatsEntity = await this.customerRewardRepository.getCustomerRewardStats(shopId, customerId);
      
      return CustomerRewardMapper.toCustomerRewardStatsDTO(customerRewardStatsEntity);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get customer reward statistics",
        "GetCustomerRewardStatsUseCase.execute",
        { input },
        error
      );
    }
  }
}
