import { BulkReassignQueuesInput, BulkReassignQueuesResult } from '@/src/application/dtos/shop/backend/queue-bulk-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for bulk reassigning queues to different employees
 * Following SOLID principles and Clean Architecture
 */
export class BulkReassignQueuesUseCase implements IUseCase<BulkReassignQueuesInput, BulkReassignQueuesResult> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to bulk reassign queues
   * @param input Bulk reassign input
   * @returns Bulk reassign result
   */
  async execute(input: BulkReassignQueuesInput): Promise<BulkReassignQueuesResult> {
    try {
      // Validate input
      if (!input.queueIds || input.queueIds.length === 0) {
        throw new Error('Queue IDs are required');
      }

      if (input.queueIds.length > 100) {
        throw new Error('Cannot reassign more than 100 queues at once');
      }

      if (!input.targetEmployeeId) {
        throw new Error('Target employee ID is required');
      }

      this.logger.info('Starting bulk reassign queues', { 
        queueCount: input.queueIds.length,
        targetEmployeeId: input.targetEmployeeId
      });

      // Validate that all queues exist
      const existingQueues = await this.validateQueuesExist(input.queueIds);

      // Validate that queues can be reassigned
      const reassignableQueues = this.validateReassignableQueues(existingQueues);

      // Execute bulk reassignment
      const results = await this.executeBulkReassign(reassignableQueues, input.targetEmployeeId);

      // Create result
      const result: BulkReassignQueuesResult = {
        success: results.failed.length === 0,
        totalQueues: input.queueIds.length,
        reassignedQueues: results.reassigned,
        failedQueues: results.failed.map(f => f.queueId),
        summary: {
          totalReassigned: results.reassigned.length,
          totalFailed: results.failed.length,
          successRate: results.reassigned.length / input.queueIds.length,
          averageProcessingTime: 0 // TODO: Calculate actual processing time
        }
      };

      this.logger.info('Bulk reassign queues completed', { 
        result: {
          totalQueues: result.totalQueues,
          reassignedQueues: result.reassignedQueues.length,
          failedQueues: result.failedQueues.length,
          successRate: result.summary?.successRate || 0
        }
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to bulk reassign queues', { error, input });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        'Failed to bulk reassign queues',
        'bulkReassignQueues',
        { input },
        error
      );
    }
  }

  /**
   * Validate that all queues exist
   * @param queueIds Queue IDs to validate
   * @returns Array of existing queues
   */
  private async validateQueuesExist(queueIds: string[]): Promise<any[]> {
    try {
      // Get all queues by IDs
      const queues = await this.queueRepository.getQueuesByIds(queueIds);

      if (queues.length !== queueIds.length) {
        const foundIds = queues.map(q => q.id);
        const missingIds = queueIds.filter(id => !foundIds.includes(id));
        throw new Error(`Queues not found: ${missingIds.join(', ')}`);
      }

      return queues;
    } catch (error) {
      this.logger.error('Failed to validate queues exist', { error, queueIds });
      throw error;
    }
  }

  /**
   * Validate that queues can be reassigned
   * @param queues Queues to validate
   * @returns Array of reassignable queues
   */
  private validateReassignableQueues(queues: any[]): any[] {
    const nonReassignableQueues = queues.filter(queue => {
      // Completed queues cannot be reassigned
      return queue.status === 'completed';
    });

    if (nonReassignableQueues.length > 0) {
      const nonReassignableIds = nonReassignableQueues.map(q => q.id).join(', ');
      throw new Error(`Cannot reassign completed queues: ${nonReassignableIds}`);
    }

    return queues;
  }

  /**
   * Execute bulk reassignment operations
   * @param queues Queues to reassign
   * @param targetEmployeeId Target employee ID
   * @returns Reassignment results
   */
  private async executeBulkReassign(
    queues: any[], 
    targetEmployeeId: string
  ): Promise<{
    reassigned: string[];
    failed: Array<{
      queueId: string;
      error: string;
    }>;
  }> {
    const reassigned: string[] = [];
    const failed: Array<{
      queueId: string;
      error: string;
    }> = [];

    // Execute reassignments in parallel with concurrency limit
    const concurrencyLimit = 10;
    const chunks = this.chunkArray(queues, concurrencyLimit);

    for (const chunk of chunks) {
      const promises = chunk.map(async (queue) => {
        try {
          // Prepare update data
          const updateData = {
            servedByEmployeeId: targetEmployeeId,
            // If queue is waiting and being reassigned, update status to in_progress
            status: queue.status === 'waiting' ? 'in_progress' : queue.status,
            // If queue is being reassigned for the first time, set calledAt
            calledAt: !queue.calledAt && queue.status === 'waiting' ? new Date().toISOString() : queue.calledAt
          };

          const updatedQueue = await this.queueRepository.updateQueue(
            queue.id,
            updateData
          );
          
          reassigned.push(updatedQueue.id);
        } catch (error) {
          this.logger.error('Failed to reassign queue', { 
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

    return { reassigned, failed };
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
