import { BulkDeleteQueuesInput, BulkDeleteQueuesResult } from '@/src/application/dtos/shop/backend/queue-bulk-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import type { QueueEntity } from '@/src/domain/entities/shop/backend/backend-queue.entity';

/**
 * Use case for bulk deleting queues
 * Following SOLID principles and Clean Architecture
 */
export class BulkDeleteQueuesUseCase implements IUseCase<BulkDeleteQueuesInput, BulkDeleteQueuesResult> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to bulk delete queues
   * @param input Bulk delete input
   * @returns Bulk delete result
   */
  async execute(input: BulkDeleteQueuesInput): Promise<BulkDeleteQueuesResult> {
    try {
      // Validate input
      if (!input.queueIds || input.queueIds.length === 0) {
        throw new Error('Queue IDs are required');
      }

      if (input.queueIds.length > 100) {
        throw new Error('Cannot delete more than 100 queues at once');
      }

      this.logger.info('Starting bulk delete queues', { 
        queueCount: input.queueIds.length,
        shopId: input.shopId
      });

      // Validate that all queues exist and belong to the same shop
      const existingQueues = await this.validateQueuesExist(input.queueIds, input.shopId);

      // Check if any queues can be deleted (not in progress or completed)
      const deletableQueues = this.validateDeletableQueues(existingQueues);

      // Execute bulk delete
      const results = await this.executeBulkDelete(deletableQueues);

      // Create result
      const result: BulkDeleteQueuesResult = {
        success: results.failed.length === 0,
        totalQueues: input.queueIds.length,
        deletedCount: results.deleted.length,
        failedCount: results.failed.length,
        deletedQueues: results.deleted,
        failedQueues: results.failed.map(f => f.queueId),
        summary: {
          successRate: results.deleted.length / input.queueIds.length,
          averageProcessingTime: 0 // TODO: Calculate actual processing time
        }
      };

      this.logger.info('Bulk delete queues completed', { 
        result: {
          totalQueues: result.totalQueues,
          deletedQueues: result.deletedQueues.length,
          failedQueues: result.failedQueues.length,
          successRate: result.summary?.successRate || 0
        }
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to bulk delete queues', { error, input });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        'Failed to bulk delete queues',
        'bulkDeleteQueues',
        { input },
        error
      );
    }
  }

  /**
   * Validate that all queues exist and belong to the same shop
   * @param queueIds Queue IDs to validate
   * @param shopId Shop ID
   * @returns Array of existing queues
   */
  private async validateQueuesExist(queueIds: string[], shopId: string): Promise<QueueEntity[]> {
    try {
      // Get all queues by IDs
      const queues = await this.queueRepository.getQueuesByIds(queueIds);

      if (queues.length !== queueIds.length) {
        const foundIds = queues.map((q: QueueEntity) => q.id);
        const missingIds = queueIds.filter(id => !foundIds.includes(id));
        throw new Error(`Queues not found: ${missingIds.join(', ')}`);
      }

      // Validate all queues belong to the same shop
      const queueShopIds = [...new Set(queues.map((q: QueueEntity) => q.shopId))];
      if (queueShopIds.length > 1) {
        throw new Error('Queues must belong to the same shop');
      }

      if (queueShopIds[0] !== shopId) {
        throw new Error('Queues do not belong to the specified shop');
      }

      return queues;
    } catch (error) {
      this.logger.error('Failed to validate queues exist', { error, queueIds, shopId });
      throw error;
    }
  }

  /**
   * Validate that queues can be deleted
   * @param queues Queues to validate
   * @returns Array of deletable queues
   */
  private validateDeletableQueues(queues: QueueEntity[]): QueueEntity[] {
    const nonDeletableQueues = queues.filter((queue: QueueEntity) => {
      // Queues in progress or completed cannot be deleted
      return queue.status === 'in_progress' || queue.status === 'completed';
    });

    if (nonDeletableQueues.length > 0) {
      const nonDeletableIds = nonDeletableQueues.map(q => q.id).join(', ');
      throw new Error(`Cannot delete queues that are in progress or completed: ${nonDeletableIds}`);
    }

    return queues;
  }

  /**
   * Execute bulk delete operations
   * @param queues Queues to delete
   * @returns Delete results
   */
  private async executeBulkDelete(queues: QueueEntity[]): Promise<{
    deleted: string[];
    failed: Array<{
      queueId: string;
      error: string;
    }>;
  }> {
    const deleted: string[] = [];
    const failed: Array<{
      queueId: string;
      error: string;
    }> = [];

    // Execute deletes in parallel with concurrency limit
    const concurrencyLimit = 10;
    const chunks = this.chunkArray(queues, concurrencyLimit);

    for (const chunk of chunks) {
      const promises = chunk.map(async (queue) => {
        try {
          await this.queueRepository.deleteQueue(queue.id);
          deleted.push(queue.id);
        } catch (error) {
          this.logger.error('Failed to delete queue', { 
            queueId: queue.id, 
            error 
          });
          
          failed.push({
            queueId: queue.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      await Promise.all(promises);
    }

    return { deleted, failed };
  }

  /**
   * Split array into chunks
   * @param array Array to split
   * @param size Chunk size
   * @returns Array of chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
