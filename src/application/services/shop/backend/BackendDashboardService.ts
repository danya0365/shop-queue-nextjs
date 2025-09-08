import type { DashboardDataDTO } from '@/src/application/dtos/shop/backend/dashboard-stats-dto';
import type { IGetDashboardDataUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetDashboardDataUseCase';
import type { IGetDashboardStatsUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetDashboardStatsUseCase';
import type { IGetPopularServicesUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetPopularServicesUseCase';
import type { IGetQueueDistributionUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetQueueDistributionUseCase';
import type { IGetRecentActivitiesUseCase } from '@/src/application/usecases/shop/backend/dashboard/GetRecentActivitiesUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IShopBackendDashboardService {
  getDashboardData(): Promise<DashboardDataDTO>;
}

export class ShopBackendDashboardService implements IShopBackendDashboardService {
  constructor(
    private readonly getDashboardStatsUseCase: IGetDashboardStatsUseCase,
    private readonly getRecentActivitiesUseCase: IGetRecentActivitiesUseCase,
    private readonly getQueueDistributionUseCase: IGetQueueDistributionUseCase,
    private readonly getPopularServicesUseCase: IGetPopularServicesUseCase,
    private readonly getDashboardDataUseCase: IGetDashboardDataUseCase,
    private readonly logger: Logger
  ) { }

  async getDashboardData(): Promise<DashboardDataDTO> {
    try {
      this.logger.info('ShopBackendDashboardService: Getting dashboard data');

      // Use the combined dashboard data use case
      const dashboardData = await this.getDashboardDataUseCase.execute();

      this.logger.info('ShopBackendDashboardService: Successfully retrieved dashboard data');
      return dashboardData;
    } catch (error) {
      this.logger.error('ShopBackendDashboardService: Error getting dashboard data', error);
      throw error;
    }
  }
}
