import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerRewardMapper } from "@/src/application/mappers/shop/customer/customer-reward-mapper";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import type { CustomerPointsDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { GetCustomerPointsInputDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";

export class GetCustomerPointsUseCase implements IUseCase<
  GetCustomerPointsInputDTO,
  CustomerPointsDTO
> {
  constructor(
    private readonly customerRewardRepository: ShopCustomerRewardRepository
  ) {}

  async execute(input: GetCustomerPointsInputDTO): Promise<CustomerPointsDTO> {
    try {
      const { shopId, customerId } = input;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerPointsUseCase.execute",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetCustomerPointsUseCase.execute",
          { customerId }
        );
      }

      const customerPointsEntity = await this.customerRewardRepository.getCustomerPoints(shopId, customerId);
      
      return CustomerRewardMapper.toCustomerPointsDTO(customerPointsEntity);
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get customer points",
        "GetCustomerPointsUseCase.execute",
        { input },
        error
      );
    }
  }
}
