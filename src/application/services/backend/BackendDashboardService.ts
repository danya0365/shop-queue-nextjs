import type { DashboardDataDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
import { DashboardMapper } from '@/src/application/mappers/backend/DashboardMapper';
import type { IGetDashboardStatsUseCase } from '@/src/application/usecases/backend/dashboard/GetDashboardStatsUseCase';
import type { IGetPopularServicesUseCase } from '@/src/application/usecases/backend/dashboard/GetPopularServicesUseCase';
import type { IGetQueueDistributionUseCase } from '@/src/application/usecases/backend/dashboard/GetQueueDistributionUseCase';
import type { IGetRecentActivitiesUseCase } from '@/src/application/usecases/backend/dashboard/GetRecentActivitiesUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendDashboardService {
  getDashboardData(): Promise<DashboardDataDTO>;
}

export class BackendDashboardService implements IBackendDashboardService {
  constructor(
    private readonly getDashboardStatsUseCase: IGetDashboardStatsUseCase,
    private readonly getRecentActivitiesUseCase: IGetRecentActivitiesUseCase,
    private readonly getQueueDistributionUseCase: IGetQueueDistributionUseCase,
    private readonly getPopularServicesUseCase: IGetPopularServicesUseCase,
    private readonly logger: Logger
  ) { }

  async getDashboardData(): Promise<DashboardDataDTO> {
    try {
      this.logger.info('BackendDashboardService: Getting dashboard data');

      // Execute all use cases in parallel for better performance
      const [stats, recentActivities, queueDistribution, popularServices] = await Promise.all([
        this.getDashboardStatsUseCase.execute(),
        this.getRecentActivitiesUseCase.execute(),
        this.getQueueDistributionUseCase.execute(),
        this.getPopularServicesUseCase.execute()
      ]);

      // Map the data using the mapper
      const dashboardData = DashboardMapper.toDashboardData(
        stats,
        recentActivities,
        queueDistribution,
        popularServices
      );

      this.logger.info('BackendDashboardService: Successfully retrieved dashboard data');
      return dashboardData;
    } catch (error) {
      this.logger.error('BackendDashboardService: Error getting dashboard data', error);
      throw error;
    }
  }
}
