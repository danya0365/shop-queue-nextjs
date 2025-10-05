import type { ShopPerformanceSummaryDTO } from '@/src/application/dtos/dashboard/global-dashboard-dto';
import { GlobalDashboardError } from '@/src/domain/errors/global-dashboard-error';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { GlobalDashboardRepository } from '@/src/domain/repositories/dashboard/global-dashboard-repository';

/**
 * Get Shop Performances Use Case Interface
 */
export interface IGetShopPerformancesUseCase {
  execute(profileId: string): Promise<ShopPerformanceSummaryDTO[]>;
}

/**
 * Get Shop Performances Use Case
 * Retrieves performance summary for each shop owned by a user
 */
export class GetShopPerformancesUseCase implements IGetShopPerformancesUseCase {
  constructor(
    private readonly repository: GlobalDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(profileId: string): Promise<ShopPerformanceSummaryDTO[]> {
    try {
      // Validate input
      if (!profileId || profileId.trim() === '') {
        throw GlobalDashboardError.validationError('Profile ID is required');
      }

      this.logger.info('GetShopPerformancesUseCase: Executing for profile', { profileId });

      // Get shop performances from repository
      const performances = await this.repository.getShopPerformances(profileId);

      this.logger.info('GetShopPerformancesUseCase: Successfully retrieved shop performances', {
        profileId,
        count: performances.length,
      });

      // Map entities to DTOs
      return performances.map(perf => ({
        shopId: perf.shopId,
        shopName: perf.shopName,
        todayQueues: perf.todayQueues,
        todayRevenue: perf.todayRevenue,
        todayServed: perf.todayServed,
        averageWaitTime: perf.averageWaitTime,
        activeQueues: perf.activeQueues,
        completionRate: perf.completionRate,
        status: perf.status,
      }));
    } catch (error) {
      this.logger.error('GetShopPerformancesUseCase: Error executing use case', error);
      
      if (error instanceof GlobalDashboardError) {
        throw error;
      }
      
      throw GlobalDashboardError.unknown(
        'Failed to get shop performances',
        error
      );
    }
  }
}
