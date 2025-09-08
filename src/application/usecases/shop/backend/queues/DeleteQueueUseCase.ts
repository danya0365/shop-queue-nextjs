import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for deleting a queue
 * Following SOLID principles and Clean Architecture
 */
export class DeleteQueueUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to delete a queue
   * @param queueId Queue ID to delete
   * @returns true if deleted successfully
   * @throws Error if queue not found or deletion fails
   */
  async execute(queueId: string): Promise<boolean> {
    try {
      if (!queueId) {
        throw new Error('Queue ID is required');
      }

      this.logger.info('Deleting queue', { queueId });

      const result = await this.queueRepository.deleteQueue(queueId);

      if (!result) {
        throw new Error(`Queue with ID ${queueId} not found or could not be deleted`);
      }

      return result;
    } catch (error) {
      this.logger.error('Error deleting queue', { error, queueId });
      throw error;
    }
  }
}
