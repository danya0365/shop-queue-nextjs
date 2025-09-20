import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerRewardMapper } from "@/src/application/mappers/shop/customer/customer-reward-mapper";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import type { AvailableRewardDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { PaginationDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { GetAvailableRewardsInputDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";

export class GetAvailableRewardsUseCase implements IUseCase<
  GetAvailableRewardsInputDTO,
  {
    data: AvailableRewardDTO[];
    pagination: PaginationDTO;
  }
> {
  constructor(
    private readonly customerRewardRepository: ShopCustomerRewardRepository
  ) {}

  async execute(input: GetAvailableRewardsInputDTO): Promise<{
    data: AvailableRewardDTO[];
    pagination: PaginationDTO;
  }> {
    try {
      const { shopId, customerId, currentPage = 1, perPage = 10, filters } = input;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetAvailableRewardsUseCase.execute",
          { shopId }
        );
      }

      const result = await this.customerRewardRepository.getAvailableRewards({
        shopId,
        customerId,
        currentPage,
        perPage,
        filters: filters ? {
          category: filters.category,
          type: filters.type,
          isAvailable: filters.isAvailable,
          minPointsCost: filters.minPointsCost,
          maxPointsCost: filters.maxPointsCost,
        } : undefined,
      });

      const availableRewardsDTOs = result.data.map(reward => 
        CustomerRewardMapper.toAvailableRewardDTO(reward)
      );

      return {
        data: availableRewardsDTOs,
        pagination: result.pagination,
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get available rewards",
        "GetAvailableRewardsUseCase.execute",
        { input },
        error
      );
    }
  }
}
