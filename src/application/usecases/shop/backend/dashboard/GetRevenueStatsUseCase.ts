import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface RevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth: number;
}

export interface IGetRevenueStatsUseCase {
  execute(shopId: string): Promise<RevenueStats>;
}

export class GetRevenueStatsUseCase implements IGetRevenueStatsUseCase {
  constructor(
    private readonly repository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(shopId: string): Promise<RevenueStats> {
    try {
      this.logger.info('GetRevenueStatsUseCase: Getting revenue stats for shop', { shopId });

      const revenueStats = await this.repository.getRevenueStats(shopId);

      this.logger.info('GetRevenueStatsUseCase: Successfully retrieved revenue stats', { shopId, revenueStats });
      return revenueStats;
    } catch (error) {
      this.logger.error('GetRevenueStatsUseCase: Error getting revenue stats', error);
      throw error;
    }
  }
}
