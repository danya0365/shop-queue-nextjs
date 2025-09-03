import type { QueueStatusDistributionDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
import type { BackendDashboardRepository } from '@/src/domain/repositories/backend/backend-dashboard-repository';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetQueueDistributionUseCase {
  execute(): Promise<QueueStatusDistributionDTO>;
}

export class GetQueueDistributionUseCase implements IGetQueueDistributionUseCase {
  constructor(
    private readonly dashboardRepository: BackendDashboardRepository,
    private readonly logger: Logger
  ) { }

  async execute(): Promise<QueueStatusDistributionDTO> {
    try {
      this.logger.info('GetQueueDistributionUseCase: Executing queue distribution retrieval');

      // Get queue distribution from repository
      const queueDistribution = await this.dashboardRepository.getQueueDistribution();
      
      // Map domain entity to DTO
      const distribution: QueueStatusDistributionDTO = {
        waiting: queueDistribution.waiting,
        serving: queueDistribution.serving,
        completed: queueDistribution.completed,
        cancelled: queueDistribution.cancelled,
        noShow: queueDistribution.noShow
      };

      this.logger.info('GetQueueDistributionUseCase: Successfully retrieved queue distribution');
      return distribution;
    } catch (error) {
      this.logger.error('GetQueueDistributionUseCase: Error retrieving queue distribution', error);
      throw error;
    }
  }
}
