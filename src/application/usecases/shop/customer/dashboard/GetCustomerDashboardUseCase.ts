import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerDashboardMapper } from "@/src/application/mappers/shop/customer/customer-dashboard-mapper";
import type { ShopCustomerDashboardRepository } from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import {
  ShopCustomerDashboardError,
  ShopCustomerDashboardErrorType,
} from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import type { CustomerDashboardDataDTO } from "@/src/application/dtos/shop/customer/customer-dashboard-dto";

export class GetCustomerDashboardUseCase implements IUseCase<string, CustomerDashboardDataDTO> {
  constructor(
    private readonly customerDashboardRepository: ShopCustomerDashboardRepository
  ) {}

  async execute(shopId: string): Promise<CustomerDashboardDataDTO> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerDashboardUseCase.execute",
          { shopId }
        );
      }

      const customerDashboardEntity = await this.customerDashboardRepository.getCustomerDashboard(shopId);

      if (!customerDashboardEntity) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.NOT_FOUND,
          `Customer dashboard data not found for shop ${shopId}`,
          "GetCustomerDashboardUseCase.execute",
          { shopId }
        );
      }

      return CustomerDashboardMapper.toDTO(customerDashboardEntity);
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }

      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.UNKNOWN,
        "Failed to get customer dashboard data",
        "GetCustomerDashboardUseCase.execute",
        { shopId },
        error as Error
      );
    }
  }
}
