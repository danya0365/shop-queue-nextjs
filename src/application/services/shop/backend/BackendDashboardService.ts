import type { DashboardDataDTO } from '@/src/application/dtos/shop/backend/dashboard-stats-dto';
import { GetDashboardStatsUseCase, type IGetDashboardStatsUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetDashboardStatsUseCase';
import { GetPopularServicesUseCase, type IGetPopularServicesUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetPopularServicesUseCase';
import { GetQueueDistributionUseCase, type IGetQueueDistributionUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetQueueDistributionUseCase';
import { GetRecentActivitiesUseCase, type IGetRecentActivitiesUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetRecentActivitiesUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface IShopBackendDashboardService {
  getDashboardData(): Promise<DashboardDataDTO>;
}

export class ShopBackendDashboardService implements IShopBackendDashboardService {
  constructor(
    private readonly getDashboardStatsUseCase: IGetDashboardStatsUseCase,
    private readonly getRecentActivitiesUseCase: IGetRecentActivitiesUseCase,
    private readonly getQueueDistributionUseCase: IGetQueueDistributionUseCase,
    private readonly getPopularServicesUseCase: IGetPopularServicesUseCase,
    private readonly logger: Logger
  ) { }

  async getDashboardData(): Promise<DashboardDataDTO> {
    try {
      this.logger.info('GetDashboardDataUseCase: Executing dashboard data retrieval');

      // Execute all use cases in parallel for better performance
      const [stats, popularServices, queueDistribution, recentActivities] = await Promise.all([
        this.getDashboardStatsUseCase.execute(),
        this.getPopularServicesUseCase.execute(),
        this.getQueueDistributionUseCase.execute(),
        this.getRecentActivitiesUseCase.execute()
      ]);

      // Combine all data into a single DTO
      const dashboardData: DashboardDataDTO = {
        stats,
        popularServices,
        queueDistribution,
        recentActivities,
        lastUpdated: new Date().toISOString()
      };

      this.logger.info('GetDashboardDataUseCase: Successfully retrieved all dashboard data');
      return dashboardData;
    } catch (error) {
      this.logger.error('GetDashboardDataUseCase: Error retrieving dashboard data', error);
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
    return new ShopBackendDashboardService(getDashboardStatsUseCase, getRecentActivitiesUseCase, getQueueDistributionUseCase, getPopularServicesUseCase, logger);
  }
}

