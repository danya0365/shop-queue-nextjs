import type {
  CustomerHistoryDataDTO,
  GetCustomerHistoryInputDTO,
} from "@/src/application/dtos/shop/customer/customer-history-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerHistoryMapper } from "@/src/application/mappers/shop/customer/customer-history-mapper";
import type { ShopCustomerHistoryRepository } from "@/src/domain/repositories/shop/customer/customer-history-repository";
import {
  ShopCustomerHistoryError,
  ShopCustomerHistoryErrorType,
} from "@/src/domain/repositories/shop/customer/customer-history-repository";

export class GetCustomerHistoryUseCase
  implements IUseCase<GetCustomerHistoryInputDTO, CustomerHistoryDataDTO>
{
  constructor(
    private readonly customerHistoryRepository: ShopCustomerHistoryRepository
  ) {}

  async execute(
    input: GetCustomerHistoryInputDTO
  ): Promise<CustomerHistoryDataDTO> {
    try {
      const {
        shopId,
        customerId,
        currentPage = 1,
        perPage = 10,
        filters,
      } = input;

      if (!shopId) {
        throw new ShopCustomerHistoryError(
          ShopCustomerHistoryErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetCustomerHistoryUseCase.execute",
          { shopId }
        );
      }
      const [queueHistoryResult, customerStats, customerInfo] =
        await Promise.all([
          this.customerHistoryRepository.getCustomerQueueHistory({
            page: currentPage,
            limit: perPage,
            shopId,
            customerId,
            filters: filters
              ? {
                  status: filters.status,
                  dateRange: filters.dateRange,
                  shop: filters.shop,
                  startDate: filters.startDate,
                  endDate: filters.endDate,
                }
              : undefined,
          }),
          this.customerHistoryRepository.getCustomerStats(shopId, customerId),
          this.customerHistoryRepository.getCustomerInfo(shopId, customerId),
        ]);

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
      return CustomerHistoryMapper.toDTO({
        queueHistory: [],
        customerStats: {
          totalQueues: 0,
          completedQueues: 0,
          cancelledQueues: 0,
          totalSpent: 0,
          averageRating: 0,
          favoriteService: "",
          memberSince: "",
        },
        customerInfo: {
          customerName: "",
          memberSince: "",
        },
        filters: {
          status: "all",
          dateRange: "all",
          shop: "all",
        },
        pagination: {
          currentPage: 1,
          perPage: 10,
          totalItems: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    }
  }
}
