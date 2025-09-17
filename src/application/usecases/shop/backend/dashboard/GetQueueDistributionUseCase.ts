import type { QueueStatusDistributionDTO } from '@/src/application/dtos/shop/backend/dashboard-stats-dto';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface IGetQueueDistributionUseCase {
  execute(shopId: string): Promise<QueueStatusDistributionDTO>;
}

export class GetQueueDistributionUseCase implements IGetQueueDistributionUseCase {
  constructor(
    private readonly dashboardRepository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) { }

  async execute(shopId: string): Promise<QueueStatusDistributionDTO> {
    try {
      this.logger.info('GetQueueDistributionUseCase: Executing queue distribution retrieval', { shopId });

      // Get queue distribution from repository
      const queueDistribution = await this.dashboardRepository.getQueueDistribution(shopId);

      // Map domain entity to DTO
      const distribution: QueueStatusDistributionDTO = {
        waiting: queueDistribution.waiting,
        serving: queueDistribution.serving,
        completed: queueDistribution.completed,
        cancelled: queueDistribution.cancelled,
        noShow: queueDistribution.noShow
      };

      this.logger.info('GetQueueDistributionUseCase: Successfully retrieved queue distribution', { shopId });
      return distribution;
    } catch (error) {
      this.logger.error('GetQueueDistributionUseCase: Error retrieving queue distribution', error);
      throw error;
    }
  }
}
