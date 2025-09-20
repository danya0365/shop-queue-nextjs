import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerHistoryMapper } from "@/src/application/mappers/shop/customer/customer-history-mapper";
import type { ShopCustomerHistoryRepository } from "@/src/domain/repositories/shop/customer/customer-history-repository";
import {
  ShopCustomerHistoryError,
  ShopCustomerHistoryErrorType,
} from "@/src/domain/repositories/shop/customer/customer-history-repository";
import type { CustomerHistoryDataDTO } from "@/src/application/dtos/shop/customer/customer-history-dto";

export class GetCustomerHistoryUseCase implements IUseCase<{
  shopId: string;
  customerId?: string;
  currentPage?: number;
  perPage?: number;
  filters?: {
    status: "all" | "completed" | "cancelled" | "no_show";
    dateRange: "all" | "month" | "quarter" | "year";
    shop: string;
    startDate?: string;
    endDate?: string;
  };
}, CustomerHistoryDataDTO> {
  constructor(
    private readonly customerHistoryRepository: ShopCustomerHistoryRepository
  ) {}

  async execute(input: {
    shopId: string;
    customerId?: string;
    currentPage?: number;
    perPage?: number;
    filters?: {
      status: "all" | "completed" | "cancelled" | "no_show";
      dateRange: "all" | "month" | "quarter" | "year";
      shop: string;
      startDate?: string;
      endDate?: string;
    };
  }): Promise<CustomerHistoryDataDTO> {
    try {
      const { shopId, customerId, currentPage = 1, perPage = 10, filters } = input;

      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerHistoryUseCase.execute",
          { shopId }
        );
      }

      const queueHistoryResult = await this.customerHistoryRepository.getCustomerQueueHistory({
        shopId,
        customerId,
        page: currentPage,
        limit: perPage,
        filters: filters ? {
          status: filters.status,
          dateRange: filters.dateRange,
          shop: filters.shop,
          startDate: filters.startDate,
          endDate: filters.endDate,
        } : undefined,
      });

      const customerStats = await this.customerHistoryRepository.getCustomerStats(shopId, customerId);
      const customerInfo = await this.customerHistoryRepository.getCustomerInfo(shopId, customerId);

      return CustomerHistoryMapper.toDTO({
        queueHistory: queueHistoryResult.data,
        customerStats,
        customerInfo,
        filters: filters || {
          status: "all",
          dateRange: "all",
          shop: "all",
        },
        pagination: queueHistoryResult.pagination,
      });
    } catch (error) {
      if (error instanceof ShopCustomerHistoryError) {
        throw error;
      }

      throw new ShopCustomerHistoryError(
        ShopCustomerHistoryErrorType.UNKNOWN,
        "Failed to get customer history data",
        "GetCustomerHistoryUseCase.execute",
        { input },
        error as Error
      );
    }
  }
}
