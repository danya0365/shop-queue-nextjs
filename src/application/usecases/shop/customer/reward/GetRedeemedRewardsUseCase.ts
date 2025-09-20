import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerRewardMapper } from "@/src/application/mappers/shop/customer/customer-reward-mapper";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import type { CustomerRewardDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { PaginationDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { GetRedeemedRewardsInputDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";

export class GetRedeemedRewardsUseCase implements IUseCase<
  GetRedeemedRewardsInputDTO,
  {
    data: CustomerRewardDTO[];
    pagination: PaginationDTO;
  }
> {
  constructor(
    private readonly customerRewardRepository: ShopCustomerRewardRepository
  ) {}

  async execute(input: GetRedeemedRewardsInputDTO): Promise<{
    data: CustomerRewardDTO[];
    pagination: PaginationDTO;
  }> {
    try {
      const { shopId, customerId, currentPage = 1, perPage = 10, filters } = input;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetRedeemedRewardsUseCase.execute",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetRedeemedRewardsUseCase.execute",
          { customerId }
        );
      }

      const result = await this.customerRewardRepository.getRedeemedRewards({
        shopId,
        customerId,
        currentPage,
        perPage,
        filters: filters ? {
          category: filters.category,
          type: filters.type,
          dateRange: filters.dateRange,
          startDate: filters.startDate,
          endDate: filters.endDate,
        } : undefined,
      });

      const redeemedRewardsDTOs = result.data.map(reward => 
        CustomerRewardMapper.toCustomerRewardDTO(reward)
      );

      return {
        data: redeemedRewardsDTOs,
        pagination: result.pagination,
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get redeemed rewards",
        "GetRedeemedRewardsUseCase.execute",
        { input },
        error
      );
    }
  }
}
