import type { DashboardDataDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
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
