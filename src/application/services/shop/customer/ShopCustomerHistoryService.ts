import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type {
  CustomerHistoryDataDTO,
  CustomerStatsDTO,
  HistoryFiltersDTO,
} from "@/src/application/dtos/shop/customer/customer-history-dto";
import { GetCustomerHistoryUseCase } from "@/src/application/usecases/shop/customer/history/GetCustomerHistoryUseCase";
import { GetCustomerStatsUseCase } from "@/src/application/usecases/shop/customer/history/GetCustomerStatsUseCase";
import { GetCustomerInfoUseCase } from "@/src/application/usecases/shop/customer/history/GetCustomerInfoUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopCustomerHistoryRepository } from "@/src/domain/repositories/shop/customer/customer-history-repository";

export interface IShopCustomerHistoryService {
  /**
   * Get customer history data with pagination and filters
   * @param shopId The shop ID
   * @param customerId The customer ID (optional)
   * @param currentPage Current page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @param filters History filters (optional)
   * @returns Customer history data
   */
  getCustomerHistory(
    shopId: string,
    customerId?: string,
    currentPage?: number,
    perPage?: number,
    filters?: HistoryFiltersDTO
  ): Promise<CustomerHistoryDataDTO>;

  /**
   * Get customer statistics
   * @param shopId The shop ID
   * @param customerId The customer ID (optional)
   * @returns Customer statistics
   */
  getCustomerStats(shopId: string, customerId?: string): Promise<CustomerStatsDTO>;

  /**
   * Get customer information
   * @param shopId The shop ID
   * @param customerId The customer ID (optional)
   * @returns Customer information
   */
  getCustomerInfo(shopId: string, customerId?: string): Promise<{
    customerName: string;
    memberSince: string;
  }>;
}

export class ShopCustomerHistoryService implements IShopCustomerHistoryService {
  constructor(
    private readonly getCustomerHistoryUseCase: IUseCase<
      {
        shopId: string;
        customerId?: string;
        currentPage?: number;
        perPage?: number;
        filters?: HistoryFiltersDTO;
      },
      CustomerHistoryDataDTO
    >,
    private readonly getCustomerStatsUseCase: IUseCase<
      { shopId: string; customerId?: string },
      CustomerStatsDTO
    >,
    private readonly getCustomerInfoUseCase: IUseCase<
      { shopId: string; customerId?: string },
      { customerName: string; memberSince: string }
    >,
    private readonly logger: Logger
  ) {}

  async getCustomerHistory(
    shopId: string,
    customerId?: string,
    currentPage: number = 1,
    perPage: number = 10,
    filters?: HistoryFiltersDTO
  ): Promise<CustomerHistoryDataDTO> {
    try {
      this.logger.info("Getting customer history", { shopId, customerId, currentPage, perPage, filters });

      const result = await this.getCustomerHistoryUseCase.execute({
        shopId,
        customerId,
        currentPage,
        perPage,
        filters,
      });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer history", { error, shopId, customerId });
      throw error;
    }
  }

  async getCustomerStats(shopId: string, customerId?: string): Promise<CustomerStatsDTO> {
    try {
      this.logger.info("Getting customer stats", { shopId, customerId });

      const result = await this.getCustomerStatsUseCase.execute({ shopId, customerId });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer stats", { error, shopId, customerId });
      throw error;
    }
  }

  async getCustomerInfo(shopId: string, customerId?: string): Promise<{
    customerName: string;
    memberSince: string;
  }> {
    try {
      this.logger.info("Getting customer info", { shopId, customerId });

      const result = await this.getCustomerInfoUseCase.execute({ shopId, customerId });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer info", { error, shopId, customerId });
      throw error;
    }
  }
}

export class ShopCustomerHistoryServiceFactory {
  static create(repository: ShopCustomerHistoryRepository, logger: Logger): ShopCustomerHistoryService {
    const getCustomerHistoryUseCase = new GetCustomerHistoryUseCase(repository);
    const getCustomerStatsUseCase = new GetCustomerStatsUseCase(repository);
    const getCustomerInfoUseCase = new GetCustomerInfoUseCase(repository);
    
    return new ShopCustomerHistoryService(
      getCustomerHistoryUseCase,
      getCustomerStatsUseCase,
      getCustomerInfoUseCase,
      logger
    );
  }
}
