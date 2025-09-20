import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerRewardMapper } from "@/src/application/mappers/shop/customer/customer-reward-mapper";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import type { RewardTransactionDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { PaginationDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { GetRewardTransactionsInputDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";

export class GetRewardTransactionsUseCase implements IUseCase<
  GetRewardTransactionsInputDTO,
  {
    data: RewardTransactionDTO[];
    pagination: PaginationDTO;
  }
> {
  constructor(
    private readonly customerRewardRepository: ShopCustomerRewardRepository
  ) {}

  async execute(input: GetRewardTransactionsInputDTO): Promise<{
    data: RewardTransactionDTO[];
    pagination: PaginationDTO;
  }> {
    try {
      const { shopId, customerId, currentPage = 1, perPage = 10, filters } = input;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetRewardTransactionsUseCase.execute",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetRewardTransactionsUseCase.execute",
          { customerId }
        );
      }

      const result = await this.customerRewardRepository.getRewardTransactions({
        shopId,
        customerId,
        currentPage,
        perPage,
        filters: filters ? {
          type: filters.type,
          dateRange: filters.dateRange,
          startDate: filters.startDate,
          endDate: filters.endDate,
        } : undefined,
      });

      const rewardTransactionsDTOs = result.data.map(transaction => 
        CustomerRewardMapper.toRewardTransactionDTO(transaction)
      );

      return {
        data: rewardTransactionsDTOs,
        pagination: result.pagination,
      };
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get reward transactions",
        "GetRewardTransactionsUseCase.execute",
        { input },
        error
      );
    }
  }
}
