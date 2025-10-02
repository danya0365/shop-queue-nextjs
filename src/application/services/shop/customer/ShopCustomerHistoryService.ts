import type {
  CustomerHistoryDataDTO,
  CustomerInfoDTO,
  CustomerStatsDTO,
  GetCustomerHistoryInputDTO,
  GetCustomerInfoInputDTO,
  GetCustomerStatsInputDTO,
  HistoryFiltersDTO,
} from "@/src/application/dtos/shop/customer/customer-history-dto";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { GetCustomerHistoryUseCase } from "@/src/application/usecases/shop/customer/history/GetCustomerHistoryUseCase";
import { GetCustomerInfoUseCase } from "@/src/application/usecases/shop/customer/history/GetCustomerInfoUseCase";
import { GetCustomerStatsUseCase } from "@/src/application/usecases/shop/customer/history/GetCustomerStatsUseCase";
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
    customerId: string,
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
  getCustomerStats(
    shopId: string,
    customerId: string
  ): Promise<CustomerStatsDTO>;

  /**
   * Get customer information
   * @param shopId The shop ID
   * @param customerId The customer ID (optional)
   * @returns Customer information
   */
  getCustomerInfo(shopId: string, customerId: string): Promise<CustomerInfoDTO>;
}

export class ShopCustomerHistoryService implements IShopCustomerHistoryService {
  constructor(
    private readonly getCustomerHistoryUseCase: IUseCase<
      GetCustomerHistoryInputDTO,
      CustomerHistoryDataDTO
    >,
    private readonly getCustomerStatsUseCase: IUseCase<
      GetCustomerStatsInputDTO,
      CustomerStatsDTO
    >,
    private readonly getCustomerInfoUseCase: IUseCase<
      GetCustomerInfoInputDTO,
      CustomerInfoDTO
    >,
    private readonly logger: Logger
  ) {}

  async getCustomerHistory(
    shopId: string,
    customerId: string,
    currentPage: number = 1,
    perPage: number = 10,
    filters?: HistoryFiltersDTO
  ): Promise<CustomerHistoryDataDTO> {
    try {
      const result = await this.getCustomerHistoryUseCase.execute({
        shopId,
        customerId,
        currentPage,
        perPage,
        filters,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerStats(
    shopId: string,
    customerId: string
  ): Promise<CustomerStatsDTO> {
    try {
      const result = await this.getCustomerStatsUseCase.execute({
        shopId,
        customerId,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerInfo(
    shopId: string,
    customerId: string
  ): Promise<CustomerInfoDTO> {
    try {
      const result = await this.getCustomerInfoUseCase.execute({
        shopId,
        customerId,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export class ShopCustomerHistoryServiceFactory {
  static create(
    repository: ShopCustomerHistoryRepository,
    logger: Logger
  ): ShopCustomerHistoryService {
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
