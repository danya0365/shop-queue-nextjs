import type {
  CustomerInfoDTO,
  GetCustomerInfoInputDTO,
} from "@/src/application/dtos/shop/customer/customer-history-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopCustomerHistoryRepository } from "@/src/domain/repositories/shop/customer/customer-history-repository";
import {
  ShopCustomerHistoryError,
  ShopCustomerHistoryErrorType,
} from "@/src/domain/repositories/shop/customer/customer-history-repository";

export class GetCustomerInfoUseCase
  implements IUseCase<GetCustomerInfoInputDTO, CustomerInfoDTO>
{
  constructor(
    private readonly customerHistoryRepository: ShopCustomerHistoryRepository
  ) {}

  async execute(input: GetCustomerInfoInputDTO): Promise<CustomerInfoDTO> {
    try {
      const { shopId, customerId } = input;

      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerInfoUseCase.execute",
          { shopId }
        );
      }

      if (!customerId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetCustomerInfoUseCase.execute",
          { customerId }
        );
      }

      const customerInfo = await this.customerHistoryRepository.getCustomerInfo(
        shopId,
        customerId
      );

      return customerInfo;
    } catch (error) {
      return {
        customerName: "",
        memberSince: "",
      };
    }
  }
}
