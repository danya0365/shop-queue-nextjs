import { QueueStatsDTO } from '@/src/application/dtos/backend/queues-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueMapper } from '@/src/application/mappers/backend/queue-mapper';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendQueueRepository } from '@/src/domain/repositories/backend/backend-queue-repository';

/**
 * Use case for getting queue statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueStatsUseCase implements IUseCase<void, QueueStatsDTO> {
  constructor(
    private readonly queueRepository: BackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get queue statistics
   * @returns Queue statistics DTO
   */
  async execute(): Promise<QueueStatsDTO> {
    try {
      this.logger.info('Getting queue statistics');
      
      const queueStats = await this.queueRepository.getQueueStats();
      return QueueMapper.statsToDTO(queueStats);
    } catch (error) {
      this.logger.error('Error getting queue statistics', { error });
      throw error;
    }
  }
}
