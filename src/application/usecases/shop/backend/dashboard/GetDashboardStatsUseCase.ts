import type { DashboardStatsDTO } from '@/src/application/dtos/shop/backend/dashboard-stats-dto';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface IGetDashboardStatsUseCase {
  execute(shopId: string): Promise<DashboardStatsDTO>;
}

export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
  constructor(
    private readonly dashboardRepository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) { }

  async execute(shopId: string): Promise<DashboardStatsDTO> {
    try {
      this.logger.info('GetDashboardStatsUseCase: Executing dashboard stats retrieval', { shopId });

      // Get dashboard stats from repository
      const dashboardStats = await this.dashboardRepository.getDashboardStats(shopId);

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

      this.logger.info('GetDashboardStatsUseCase: Successfully retrieved dashboard stats', { shopId });
      return stats;
    } catch (error) {
      this.logger.error('GetDashboardStatsUseCase: Error retrieving dashboard stats', error);
      throw error;
    }
  }
}
