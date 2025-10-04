import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { PromotionMapper } from "@/src/application/mappers/shop/customer/customer-dashboard-mapper";
import type { ShopCustomerDashboardRepository } from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import {
  ShopCustomerDashboardError,
  ShopCustomerDashboardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import type { PromotionDTO } from "@/src/application/dtos/shop/customer/customer-dashboard-dto";

export interface GetPromotionsInput {
  shopId: string;
  page?: number;
  limit?: number;
}

export class GetPromotionsUseCase implements IUseCase<GetPromotionsInput, PromotionDTO[]> {
  constructor(
    private readonly customerDashboardRepository: ShopCustomerDashboardRepository
  ) {}

  async execute(input: GetPromotionsInput): Promise<PromotionDTO[]> {
    try {
      const { shopId, page = 1, limit = 10 } = input || ({} as GetPromotionsInput);

      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetPromotionsUseCase.execute",
          { shopId, page, limit }
        );
      }

      const promotionEntities = await this.customerDashboardRepository.getPromotions(
        shopId,
        page,
        limit
      );

      return promotionEntities.map(promotion => PromotionMapper.toDTO(promotion));
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }

      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.UNKNOWN,
        "Failed to get promotions",
        "GetPromotionsUseCase.execute",
        { ...(input || {} as GetPromotionsInput) },
        error as Error
      );
    }
  }
}
