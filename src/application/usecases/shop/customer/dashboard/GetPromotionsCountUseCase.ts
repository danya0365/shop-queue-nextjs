import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopCustomerDashboardRepository } from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import {
  ShopCustomerDashboardError,
  ShopCustomerDashboardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";

export class GetPromotionsCountUseCase implements IUseCase<string, number> {
  constructor(
    private readonly customerDashboardRepository: ShopCustomerDashboardRepository
  ) {}

  async execute(shopId: string): Promise<number> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetPromotionsCountUseCase.execute",
          { shopId }
        );
      }

      const count = await this.customerDashboardRepository.getPromotionsCount(shopId);
      return Number(count) || 0;
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }

      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.UNKNOWN,
        "Failed to get promotions count",
        "GetPromotionsCountUseCase.execute",
        { shopId },
        error as Error
      );
    }
  }
}
