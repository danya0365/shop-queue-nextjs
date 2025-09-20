import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { PopularServiceMapper } from "@/src/application/mappers/shop/customer/customer-dashboard-mapper";
import type { ShopCustomerDashboardRepository } from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import {
  ShopCustomerDashboardError,
  ShopCustomerDashboardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import type { PopularServiceDTO } from "@/src/application/dtos/shop/customer/customer-dashboard-dto";

export interface GetPopularServicesInput {
  shopId: string;
  limit?: number;
}

export class GetPopularServicesUseCase implements IUseCase<GetPopularServicesInput, PopularServiceDTO[]> {
  constructor(
    private readonly customerDashboardRepository: ShopCustomerDashboardRepository
  ) {}

  async execute(input: GetPopularServicesInput): Promise<PopularServiceDTO[]> {
    try {
      const { shopId, limit = 10 } = input;

      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetPopularServicesUseCase.execute",
          { shopId }
        );
      }

      const popularServiceEntities = await this.customerDashboardRepository.getPopularServices(shopId, limit);

      return popularServiceEntities.map(service => PopularServiceMapper.toDTO(service));
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }

      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.UNKNOWN,
        "Failed to get popular services",
        "GetPopularServicesUseCase.execute",
        { shopId: input.shopId, limit: input.limit },
        error as Error
      );
    }
  }
}
