import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type {
  CustomerDashboardDataDTO,
  PopularServiceDTO,
  PromotionDTO,
  QueueStatusStatsDTO,
} from "@/src/application/dtos/shop/customer/customer-dashboard-dto";
import { GetCustomerDashboardUseCase } from "@/src/application/usecases/shop/customer/dashboard/GetCustomerDashboardUseCase";
import { GetPopularServicesUseCase } from "@/src/application/usecases/shop/customer/dashboard/GetPopularServicesUseCase";
import { GetPromotionsUseCase } from "@/src/application/usecases/shop/customer/dashboard/GetPromotionsUseCase";
import { GetQueueStatusUseCase } from "@/src/application/usecases/shop/customer/dashboard/GetQueueStatusUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopCustomerDashboardRepository } from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";

export interface IShopCustomerDashboardService {
  /**
   * Get queue status statistics for a shop
   * @param shopId The shop ID
   * @returns Queue status statistics
   */
  getQueueStatus(shopId: string): Promise<QueueStatusStatsDTO>;

  /**
   * Get popular services for a shop
   * @param shopId The shop ID
   * @param limit Maximum number of services to return (default: 10)
   * @returns Array of popular services
   */
  getPopularServices(shopId: string, limit?: number): Promise<PopularServiceDTO[]>;

  /**
   * Get active promotions for a shop
   * @param shopId The shop ID
   * @returns Array of active promotions
   */
  getPromotions(shopId: string): Promise<PromotionDTO[]>;

  /**
   * Get complete customer dashboard data
   * @param shopId The shop ID
   * @returns Complete customer dashboard data
   */
  getCustomerDashboard(shopId: string): Promise<CustomerDashboardDataDTO>;
}

export class ShopCustomerDashboardService implements IShopCustomerDashboardService {
  constructor(
    private readonly getQueueStatusUseCase: IUseCase<string, QueueStatusStatsDTO>,
    private readonly getPopularServicesUseCase: IUseCase<
      { shopId: string; limit?: number },
      PopularServiceDTO[]
    >,
    private readonly getPromotionsUseCase: IUseCase<string, PromotionDTO[]>,
    private readonly getCustomerDashboardUseCase: IUseCase<string, CustomerDashboardDataDTO>,
    private readonly logger: Logger
  ) {}

  async getQueueStatus(shopId: string): Promise<QueueStatusStatsDTO> {
    try {
      this.logger.info("Getting queue status", { shopId });

      const result = await this.getQueueStatusUseCase.execute(shopId);
      return result;
    } catch (error) {
      this.logger.error("Error getting queue status", { error, shopId });
      throw error;
    }
  }

  async getPopularServices(
    shopId: string,
    limit: number = 10
  ): Promise<PopularServiceDTO[]> {
    try {
      this.logger.info("Getting popular services", { shopId, limit });

      const result = await this.getPopularServicesUseCase.execute({ shopId, limit });
      return result;
    } catch (error) {
      this.logger.error("Error getting popular services", { error, shopId, limit });
      throw error;
    }
  }

  async getPromotions(shopId: string): Promise<PromotionDTO[]> {
    try {
      this.logger.info("Getting promotions", { shopId });

      const result = await this.getPromotionsUseCase.execute(shopId);
      return result;
    } catch (error) {
      this.logger.error("Error getting promotions", { error, shopId });
      throw error;
    }
  }

  async getCustomerDashboard(shopId: string): Promise<CustomerDashboardDataDTO> {
    try {
      this.logger.info("Getting customer dashboard data", { shopId });

      const result = await this.getCustomerDashboardUseCase.execute(shopId);
      return result;
    } catch (error) {
      this.logger.error("Error getting customer dashboard data", { error, shopId });
      throw error;
    }
  }
}

export class ShopCustomerDashboardServiceFactory {
  static create(repository: ShopCustomerDashboardRepository, logger: Logger): ShopCustomerDashboardService {
    const getQueueStatusUseCase = new GetQueueStatusUseCase(repository);
    const getPopularServicesUseCase = new GetPopularServicesUseCase(repository);
    const getPromotionsUseCase = new GetPromotionsUseCase(repository);
    const getCustomerDashboardUseCase = new GetCustomerDashboardUseCase(repository);
    
    return new ShopCustomerDashboardService(
      getQueueStatusUseCase,
      getPopularServicesUseCase,
      getPromotionsUseCase,
      getCustomerDashboardUseCase,
      logger
    );
  }
}
