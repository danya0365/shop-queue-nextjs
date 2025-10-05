import type { GlobalDashboardStatsDTO } from '@/src/application/dtos/dashboard/global-dashboard-dto';
import { GlobalDashboardError } from '@/src/domain/errors/global-dashboard-error';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { GlobalDashboardRepository } from '@/src/domain/repositories/dashboard/global-dashboard-repository';

/**
 * Get Global Stats Use Case Interface
 */
export interface IGetGlobalStatsUseCase {
  execute(profileId: string): Promise<GlobalDashboardStatsDTO>;
}

/**
 * Get Global Stats Use Case
 * Retrieves aggregated statistics across all shops owned by a user
 */
export class GetGlobalStatsUseCase implements IGetGlobalStatsUseCase {
  constructor(
    private readonly repository: GlobalDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(profileId: string): Promise<GlobalDashboardStatsDTO> {
    try {
      // Validate input
      if (!profileId || profileId.trim() === '') {
        throw GlobalDashboardError.validationError('Profile ID is required');
      }

      this.logger.info('GetGlobalStatsUseCase: Executing for profile', { profileId });

      // Get stats from repository
      const stats = await this.repository.getGlobalStats(profileId);

      this.logger.info('GetGlobalStatsUseCase: Successfully retrieved global stats', {
        profileId,
        totalShops: stats.totalShops,
        activeQueues: stats.activeQueues,
      });

      // Map entity to DTO
      return {
        totalShops: stats.totalShops,
        activeShops: stats.activeShops,
        inactiveShops: stats.inactiveShops,
        totalQueuesAllTime: stats.totalQueuesAllTime,
        activeQueues: stats.activeQueues,
        waitingQueues: stats.waitingQueues,
        confirmedQueues: stats.confirmedQueues,
        servingQueues: stats.servingQueues,
        completedQueuesToday: stats.completedQueuesToday,
        cancelledQueuesToday: stats.cancelledQueuesToday,
        pendingQueues: stats.pendingQueues,
        todayRevenue: stats.todayRevenue,
        yesterdayRevenue: stats.yesterdayRevenue,
        thisWeekRevenue: stats.thisWeekRevenue,
        thisMonthRevenue: stats.thisMonthRevenue,
        revenueChange: stats.revenueChange,
        revenueChangeType: stats.revenueChangeType,
        servedToday: stats.servedToday,
        servedYesterday: stats.servedYesterday,
        servedChange: stats.servedChange,
        servedChangeType: stats.servedChangeType,
        averageWaitTime: stats.averageWaitTime,
        averageWaitTimeYesterday: stats.averageWaitTimeYesterday,
        waitTimeChange: stats.waitTimeChange,
        waitTimeChangeType: stats.waitTimeChangeType,
        totalEmployees: stats.totalEmployees,
        activeEmployees: stats.activeEmployees,
        onlineEmployees: stats.onlineEmployees,
        servingEmployees: stats.servingEmployees,
        totalCustomers: stats.totalCustomers,
        newCustomersToday: stats.newCustomersToday,
        returningCustomersToday: stats.returningCustomersToday,
        lastUpdated: stats.lastUpdated,
      };
    } catch (error) {
      this.logger.error('GetGlobalStatsUseCase: Error executing use case', error);
      
      if (error instanceof GlobalDashboardError) {
        throw error;
      }
      
      throw GlobalDashboardError.unknown(
        'Failed to get global stats',
        error
      );
    }
  }
}
