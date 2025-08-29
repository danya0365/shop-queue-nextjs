import type { QueueStatusDistributionDTO } from '@/src/application/dtos/backend/DashboardStatsDTO';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetQueueDistributionUseCase {
  execute(): Promise<QueueStatusDistributionDTO>;
}

export class GetQueueDistributionUseCase implements IGetQueueDistributionUseCase {
  constructor(private readonly logger: Logger) {}

  async execute(): Promise<QueueStatusDistributionDTO> {
    try {
      this.logger.info('GetQueueDistributionUseCase: Executing queue distribution retrieval');

      // Mock data - replace with actual repository calls later
      const distribution: QueueStatusDistributionDTO = {
        waiting: 25,
        serving: 12,
        completed: 180,
        cancelled: 8,
        noShow: 5
      };

      this.logger.info('GetQueueDistributionUseCase: Successfully retrieved queue distribution');
      return distribution;
    } catch (error) {
      this.logger.error('GetQueueDistributionUseCase: Error retrieving queue distribution', error);
      throw error;
    }
  }
}
