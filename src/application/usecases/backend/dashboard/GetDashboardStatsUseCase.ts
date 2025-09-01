import type { DashboardStatsDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetDashboardStatsUseCase {
  execute(): Promise<DashboardStatsDTO>;
}

export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
  constructor(private readonly logger: Logger) { }

  async execute(): Promise<DashboardStatsDTO> {
    try {
      this.logger.info('GetDashboardStatsUseCase: Executing dashboard stats retrieval');

      // Mock data - replace with actual repository calls later
      const stats: DashboardStatsDTO = {
        totalShops: 25,
        totalQueues: 1250,
        totalCustomers: 3420,
        totalEmployees: 85,
        activeQueues: 45,
        completedQueuesToday: 120,
        totalRevenue: 125000,
        averageWaitTime: 15.5
      };

      this.logger.info('GetDashboardStatsUseCase: Successfully retrieved dashboard stats');
      return stats;
    } catch (error) {
      this.logger.error('GetDashboardStatsUseCase: Error retrieving dashboard stats', error);
      throw error;
    }
  }
}
