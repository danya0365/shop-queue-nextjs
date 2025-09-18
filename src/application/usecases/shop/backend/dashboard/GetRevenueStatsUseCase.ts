import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendDashboardRepository } from "@/src/domain/repositories/shop/backend/backend-dashboard-repository";

export interface RevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
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
      const revenueStats = await this.repository.getRevenueStats(shopId);
      return revenueStats;
    } catch (error) {
      this.logger.error(
        "GetRevenueStatsUseCase: Error getting revenue stats",
        error
      );
      throw error;
    }
  }
}
