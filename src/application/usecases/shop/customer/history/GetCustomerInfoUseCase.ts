import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopCustomerHistoryRepository } from "@/src/domain/repositories/shop/customer/customer-history-repository";
import {
  ShopCustomerHistoryError,
  ShopCustomerHistoryErrorType,
} from "@/src/domain/repositories/shop/customer/customer-history-repository";

export class GetCustomerInfoUseCase implements IUseCase<{
  shopId: string;
  customerId?: string;
}, {
  customerName: string;
  memberSince: string;
}> {
  constructor(
    private readonly customerHistoryRepository: ShopCustomerHistoryRepository
  ) {}

  async execute(input: {
    shopId: string;
    customerId?: string;
  }): Promise<{
    customerName: string;
    memberSince: string;
  }> {
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

      const customerInfo = await this.customerHistoryRepository.getCustomerInfo(shopId, customerId);

      return customerInfo;
    } catch (error) {
      if (error instanceof ShopCustomerHistoryError) {
        throw error;
      }

      throw new ShopCustomerHistoryError(
        ShopCustomerHistoryErrorType.UNKNOWN,
        "Failed to get customer info",
        "GetCustomerInfoUseCase.execute",
        { input },
        error as Error
      );
    }
  }
}
