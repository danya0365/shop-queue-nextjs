import { QueueStatsDTO } from '@/src/application/dtos/shop/backend/queues-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueMapper } from '@/src/application/mappers/shop/backend/queue-mapper';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for getting queue statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueStatsUseCase implements IUseCase<string, QueueStatsDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get queue statistics
   * @param shopId Shop ID for filtering statistics
   * @returns Queue statistics DTO
   */
  async execute(shopId: string): Promise<QueueStatsDTO> {
    try {
      this.logger.info('Getting queue statistics', { shopId });

      const queueStats = await this.queueRepository.getQueueStats(shopId);
      return QueueMapper.statsToDTO(queueStats);
    } catch (error) {
      this.logger.error('Error getting queue statistics', { error, shopId });
      throw error;
    }
  }
}
