import type { DashboardStatsDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
import type { BackendDashboardRepository } from '@/src/domain/repositories/backend/backend-dashboard-repository';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetDashboardStatsUseCase {
  execute(): Promise<DashboardStatsDTO>;
}

export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
  constructor(
    private readonly dashboardRepository: BackendDashboardRepository,
    private readonly logger: Logger
  ) { }

  async execute(): Promise<DashboardStatsDTO> {
    try {
      this.logger.info('GetDashboardStatsUseCase: Executing dashboard stats retrieval');

      // Get dashboard stats from repository
      const dashboardStats = await this.dashboardRepository.getDashboardStats();
      
      // Map domain entity to DTO
      const stats: DashboardStatsDTO = {
        totalShops: dashboardStats.totalShops,
        totalQueues: dashboardStats.totalQueues,
        totalCustomers: dashboardStats.totalCustomers,
        totalEmployees: dashboardStats.totalEmployees,
        activeQueues: dashboardStats.activeQueues,
        completedQueuesToday: dashboardStats.completedQueuesToday,
        totalRevenue: dashboardStats.totalRevenue,
        averageWaitTime: dashboardStats.averageWaitTime
      };

      this.logger.info('GetDashboardStatsUseCase: Successfully retrieved dashboard stats');
      return stats;
    } catch (error) {
      this.logger.error('GetDashboardStatsUseCase: Error retrieving dashboard stats', error);
      throw error;
    }
  }
}
