import type {
  AvailableRewardDTO,
  GetRewardDetailsInputDTO,
} from "@/src/application/dtos/shop/customer/customer-reward-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerRewardMapper } from "@/src/application/mappers/shop/customer/customer-reward-mapper";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";

export class GetRewardDetailsUseCase
  implements IUseCase<GetRewardDetailsInputDTO, AvailableRewardDTO>
{
  constructor(
    private readonly customerRewardRepository: ShopCustomerRewardRepository
  ) {}

  async execute(input: GetRewardDetailsInputDTO): Promise<AvailableRewardDTO> {
    try {
      const { shopId, rewardId } = input;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetRewardDetailsUseCase.execute",
          { shopId }
        );
      }

      if (!rewardId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Reward ID is required",
          "GetRewardDetailsUseCase.execute",
          { rewardId }
        );
      }

      const rewardEntity = await this.customerRewardRepository.getRewardById(
        shopId,
        rewardId
      );

      if (!rewardEntity) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.NOT_FOUND,
          "Reward not found",
          "GetRewardDetailsUseCase.execute",
          { rewardId }
        );
      }

      return CustomerRewardMapper.toAvailableRewardDTO(rewardEntity);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get reward details",
        "GetRewardDetailsUseCase.execute",
        { input },
        error
      );
    }
  }
}
