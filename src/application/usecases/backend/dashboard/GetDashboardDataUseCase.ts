import type { DashboardDataDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { IGetDashboardStatsUseCase } from './GetDashboardStatsUseCase';
import type { IGetPopularServicesUseCase } from './GetPopularServicesUseCase';
import type { IGetQueueDistributionUseCase } from './GetQueueDistributionUseCase';
import type { IGetRecentActivitiesUseCase } from './GetRecentActivitiesUseCase';

export interface IGetDashboardDataUseCase {
  execute(): Promise<DashboardDataDTO>;
}

/**
 * Use case for retrieving all dashboard data in a single call
 * Following Clean Architecture principles for use case implementation
 */
export class GetDashboardDataUseCase implements IGetDashboardDataUseCase {
  constructor(
    private readonly getDashboardStatsUseCase: IGetDashboardStatsUseCase,
    private readonly getPopularServicesUseCase: IGetPopularServicesUseCase,
    private readonly getQueueDistributionUseCase: IGetQueueDistributionUseCase,
    private readonly getRecentActivitiesUseCase: IGetRecentActivitiesUseCase,
    private readonly logger: Logger
  ) { }

  async execute(): Promise<DashboardDataDTO> {
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
