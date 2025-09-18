import type { DashboardDataDTO, RecentActivityDTO } from '@/src/application/dtos/shop/backend/dashboard-stats-dto';
import { GetDashboardStatsUseCase, type IGetDashboardStatsUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetDashboardStatsUseCase';
import { GetPopularServicesUseCase, type IGetPopularServicesUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetPopularServicesUseCase';
import { GetQueueDistributionUseCase, type IGetQueueDistributionUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetQueueDistributionUseCase';
import { GetRecentActivitiesUseCase, type IGetRecentActivitiesUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetRecentActivitiesUseCase';
import { GetQueueStatsUseCase, type IGetQueueStatsUseCase, type QueueStats } from '@/src/application/usecases/shop/backend/dashboard/GetQueueStatsUseCase';
import { GetRevenueStatsUseCase, type IGetRevenueStatsUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetRevenueStatsUseCase';
import type { RevenueStatsDTO } from '@/src/application/dtos/shop/backend/dashboard-stats-dto';
import { GetEmployeeStatsUseCase, type IGetEmployeeStatsUseCase, type EmployeeStats } from '@/src/application/usecases/shop/backend/dashboard/GetEmployeeStatsUseCase';
import { GetShopNameUseCase, type IGetShopNameUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetShopNameUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface IShopBackendDashboardService {
  getDashboardData(shopId: string): Promise<DashboardDataDTO>;
  getQueueStats(shopId: string): Promise<QueueStats>;
  getRevenueStats(shopId: string): Promise<RevenueStatsDTO>;
  getEmployeeStats(shopId: string): Promise<EmployeeStats>;
  getShopName(shopId: string): Promise<string>;
  getRecentActivities(shopId: string): Promise<RecentActivityDTO[]>;
}

export class ShopBackendDashboardService implements IShopBackendDashboardService {
  constructor(
    private readonly getDashboardStatsUseCase: IGetDashboardStatsUseCase,
    private readonly getRecentActivitiesUseCase: IGetRecentActivitiesUseCase,
    private readonly getQueueDistributionUseCase: IGetQueueDistributionUseCase,
    private readonly getPopularServicesUseCase: IGetPopularServicesUseCase,
    private readonly getQueueStatsUseCase: IGetQueueStatsUseCase,
    private readonly getRevenueStatsUseCase: IGetRevenueStatsUseCase,
    private readonly getEmployeeStatsUseCase: IGetEmployeeStatsUseCase,
    private readonly getShopNameUseCase: IGetShopNameUseCase,
    private readonly logger: Logger
  ) { }

  async getDashboardData(shopId: string): Promise<DashboardDataDTO> {
    try {
      this.logger.info('ShopBackendDashboardService: Executing dashboard data retrieval', { shopId });

      // Execute all use cases in parallel for better performance
      const [stats, popularServices, queueDistribution, recentActivities] = await Promise.all([
        this.getDashboardStatsUseCase.execute(shopId),
        this.getPopularServicesUseCase.execute(shopId),
        this.getQueueDistributionUseCase.execute(shopId),
        this.getRecentActivitiesUseCase.execute(shopId)
      ]);

      // Combine all data into a single DTO
      const dashboardData: DashboardDataDTO = {
        stats,
        popularServices,
        queueDistribution,
        recentActivities,
        lastUpdated: new Date().toISOString()
      };

      this.logger.info('ShopBackendDashboardService: Successfully retrieved all dashboard data', { shopId });
      return dashboardData;
    } catch (error) {
      this.logger.error('ShopBackendDashboardService: Error retrieving dashboard data', error);
      throw error;
    }
  }

  async getQueueStats(shopId: string): Promise<QueueStats> {
    try {
      this.logger.info('ShopBackendDashboardService: Getting queue stats for shop', { shopId });
      const queueStats = await this.getQueueStatsUseCase.execute(shopId);
      this.logger.info('ShopBackendDashboardService: Successfully retrieved queue stats', { shopId, queueStats });
      return queueStats;
    } catch (error) {
      this.logger.error('ShopBackendDashboardService: Error getting queue stats', error);
      throw error;
    }
  }

  async getRevenueStats(shopId: string): Promise<RevenueStatsDTO> {
    try {
      this.logger.info('ShopBackendDashboardService: Getting revenue stats for shop', { shopId });
      const revenueStats = await this.getRevenueStatsUseCase.execute(shopId);
      this.logger.info('ShopBackendDashboardService: Successfully retrieved revenue stats', { shopId, revenueStats });
      return revenueStats;
    } catch (error) {
      this.logger.error('ShopBackendDashboardService: Error getting revenue stats', error);
      throw error;
    }
  }

  async getEmployeeStats(shopId: string): Promise<EmployeeStats> {
    try {
      this.logger.info('ShopBackendDashboardService: Getting employee stats for shop', { shopId });
      const employeeStats = await this.getEmployeeStatsUseCase.execute(shopId);
      this.logger.info('ShopBackendDashboardService: Successfully retrieved employee stats', { shopId, employeeStats });
      return employeeStats;
    } catch (error) {
      this.logger.error('ShopBackendDashboardService: Error getting employee stats', error);
      throw error;
    }
  }

  async getShopName(shopId: string): Promise<string> {
    try {
      this.logger.info('ShopBackendDashboardService: Getting shop name for shop', { shopId });
      const shopName = await this.getShopNameUseCase.execute(shopId);
      this.logger.info('ShopBackendDashboardService: Successfully retrieved shop name', { shopId, shopName });
      return shopName;
    } catch (error) {
      this.logger.error('ShopBackendDashboardService: Error getting shop name', error);
      throw error;
    }
  }

  async getRecentActivities(shopId: string): Promise<RecentActivityDTO[]> {
    try {
      this.logger.info('ShopBackendDashboardService: Getting recent activities for shop', { shopId });
      const recentActivities = await this.getRecentActivitiesUseCase.execute(shopId);
      this.logger.info('ShopBackendDashboardService: Successfully retrieved recent activities', { shopId, count: recentActivities.length });
      return recentActivities;
    } catch (error) {
      this.logger.error('ShopBackendDashboardService: Error getting recent activities', error);
      throw error;
    }
  }
}

export class ShopBackendDashboardServiceFactory {
  static create(repository: ShopBackendDashboardRepository, logger: Logger): ShopBackendDashboardService {
    const getRecentActivitiesUseCase = new GetRecentActivitiesUseCase(repository, logger);
    const getQueueDistributionUseCase = new GetQueueDistributionUseCase(repository, logger);
    const getPopularServicesUseCase = new GetPopularServicesUseCase(repository, logger);
    const getDashboardStatsUseCase = new GetDashboardStatsUseCase(repository, logger);
    const getQueueStatsUseCase = new GetQueueStatsUseCase(repository, logger);
    const getRevenueStatsUseCase = new GetRevenueStatsUseCase(repository, logger);
    const getEmployeeStatsUseCase = new GetEmployeeStatsUseCase(repository, logger);
    const getShopNameUseCase = new GetShopNameUseCase(repository, logger);
    return new ShopBackendDashboardService(
      getDashboardStatsUseCase,
      getRecentActivitiesUseCase,
      getQueueDistributionUseCase,
      getPopularServicesUseCase,
      getQueueStatsUseCase,
      getRevenueStatsUseCase,
      getEmployeeStatsUseCase,
      getShopNameUseCase,
      logger
    );
  }
}

