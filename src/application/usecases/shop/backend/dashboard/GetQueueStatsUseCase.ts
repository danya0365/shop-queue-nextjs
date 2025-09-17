import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface QueueStats {
  waiting: number;
  serving: number;
  completed: number;
  cancelled: number;
}

export interface IGetQueueStatsUseCase {
  execute(shopId: string): Promise<QueueStats>;
}

export class GetQueueStatsUseCase implements IGetQueueStatsUseCase {
  constructor(
    private readonly repository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(shopId: string): Promise<QueueStats> {
    try {
      this.logger.info('GetQueueStatsUseCase: Getting queue stats for shop', { shopId });

      const queueStats = await this.repository.getQueueStats(shopId);

      this.logger.info('GetQueueStatsUseCase: Successfully retrieved queue stats', { shopId, queueStats });
      return queueStats;
    } catch (error) {
      this.logger.error('GetQueueStatsUseCase: Error getting queue stats', error);
      throw error;
    }
  }
}
