import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { PromotionMapper } from "@/src/application/mappers/shop/customer/customer-dashboard-mapper";
import type { ShopCustomerDashboardRepository } from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import {
  ShopCustomerDashboardError,
  ShopCustomerDashboardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import type { PromotionDTO } from "@/src/application/dtos/shop/customer/customer-dashboard-dto";

export class GetPromotionsUseCase implements IUseCase<string, PromotionDTO[]> {
  constructor(
    private readonly customerDashboardRepository: ShopCustomerDashboardRepository
  ) {}

  async execute(shopId: string): Promise<PromotionDTO[]> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetPromotionsUseCase.execute",
          { shopId }
        );
      }

      const promotionEntities = await this.customerDashboardRepository.getPromotions(shopId);

      return promotionEntities.map(promotion => PromotionMapper.toDTO(promotion));
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }

      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.UNKNOWN,
        "Failed to get promotions",
        "GetPromotionsUseCase.execute",
        { shopId },
        error as Error
      );
    }
  }
}
