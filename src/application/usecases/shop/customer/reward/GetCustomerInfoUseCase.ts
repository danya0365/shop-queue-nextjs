import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import {
  ShopCustomerRewardError,
  ShopCustomerRewardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-reward-repository";
import type { CustomerInfoDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";
import type { GetCustomerInfoInputDTO } from "@/src/application/dtos/shop/customer/customer-reward-dto";

export class GetCustomerInfoUseCase implements IUseCase<
  GetCustomerInfoInputDTO,
  CustomerInfoDTO
> {
  constructor(
    private readonly customerRewardRepository: ShopCustomerRewardRepository
  ) {}

  async execute(input: GetCustomerInfoInputDTO): Promise<CustomerInfoDTO> {
    try {
      const { shopId, customerId } = input;

      if (!shopId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerInfoUseCase.execute",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerRewardError(
          ShopCustomerRewardErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetCustomerInfoUseCase.execute",
          { customerId }
        );
      }

      const customerInfo = await this.customerRewardRepository.getCustomerInfo(shopId, customerId);
      
      return customerInfo;
    } catch (error) {
      if (error instanceof ShopCustomerRewardError) {
        throw error;
      }

      throw new ShopCustomerRewardError(
        ShopCustomerRewardErrorType.OPERATION_FAILED,
        "Failed to get customer information",
        "GetCustomerInfoUseCase.execute",
        { input },
        error
      );
    }
  }
}
