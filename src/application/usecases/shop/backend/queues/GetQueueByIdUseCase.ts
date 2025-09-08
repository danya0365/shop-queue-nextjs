import { QueueDTO } from '@/src/application/dtos/shop/backend/queues-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueMapper } from '@/src/application/mappers/shop/backend/queue-mapper';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for getting a queue by ID
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueByIdUseCase implements IUseCase<string, QueueDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get a queue by ID
   * @param queueId Queue ID to get
   * @returns Queue DTO
   * @throws Error if queue not found
   */
  async execute(queueId: string): Promise<QueueDTO> {
    try {
      if (!queueId) {
        throw new Error('Queue ID is required');
      }

      const queue = await this.queueRepository.getQueueById(queueId);

      if (!queue) {
        throw new Error(`Queue with ID ${queueId} not found`);
      }

      return QueueMapper.toDTO(queue);
    } catch (error) {
      this.logger.error('Error in GetQueueByIdUseCase.execute', { error, queueId });
      throw error;
    }
  }
}
