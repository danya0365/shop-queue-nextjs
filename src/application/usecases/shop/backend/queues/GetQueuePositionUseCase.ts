import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import type { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Queue position information
 */
export interface QueuePositionInfo {
  position: number;
  totalAhead: number;
  estimatedWaitTime: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
}

/**
 * Input DTO for GetQueuePositionUseCase
 */
export interface GetQueuePositionInput {
  queueId: string;
  shopId: string;
}

/**
 * Use case for getting queue position and estimated wait time
 * Following SOLID principles and Clean Architecture
 */
export class GetQueuePositionUseCase implements IUseCase<GetQueuePositionInput, QueuePositionInfo> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get queue position
   * @param input Queue position parameters
   * @returns Queue position information
   */
  async execute(input: GetQueuePositionInput): Promise<QueuePositionInfo> {
    try {
      // Validate input
      if (!input.queueId || !input.shopId) {
        throw new Error('Queue ID and shop ID are required');
      }

      this.logger.info('Getting queue position', { input });

      // Get the specific queue
      const targetQueue = await this.queueRepository.getQueueById(input.queueId);
      if (!targetQueue) {
        throw new ShopBackendQueueError(
          ShopBackendQueueErrorType.NOT_FOUND,
          `Queue with ID ${input.queueId} not found`,
          'getQueuePosition',
          { input }
        );
      }

      // Validate queue belongs to the shop
      if (targetQueue.shopId !== input.shopId) {
        throw new ShopBackendQueueError(
          ShopBackendQueueErrorType.UNAUTHORIZED,
          'Queue does not belong to the specified shop',
          'getQueuePosition',
          { input }
        );
      }

      // If queue is already being served or completed, return special position
      if (targetQueue.status !== 'waiting') {
        return {
          position: 0,
          totalAhead: 0,
          estimatedWaitTime: 0,
          status: targetQueue.status
        };
      }

      // Get all waiting queues for the shop, sorted by priority and creation time
      const waitingQueuesResult = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 1000, // Get all waiting queues
        filters: {
          shopId: input.shopId,
          statusFilter: 'waiting'
        }
      });

      const waitingQueues = waitingQueuesResult.data;

      // Sort queues by priority and creation time
      const sortedQueues = this.sortQueuesByPriority(waitingQueues);

      // Find the position of the target queue
      const queueIndex = sortedQueues.findIndex(queue => queue.id === input.queueId);
      
      if (queueIndex === -1) {
        // Queue not found in waiting list (might have been processed)
        return {
          position: 0,
          totalAhead: 0,
          estimatedWaitTime: 0,
          status: targetQueue.status
        };
      }

      const position = queueIndex + 1;
      const totalAhead = queueIndex;

      // Calculate estimated wait time
      const estimatedWaitTime = this.calculateEstimatedWaitTime(
        sortedQueues, 
        queueIndex, 
        targetQueue.estimatedWaitTime
      );

      this.logger.info('Queue position calculated', { 
        queueId: input.queueId, 
        position, 
        totalAhead, 
        estimatedWaitTime 
      });

      return {
        position,
        totalAhead,
        estimatedWaitTime,
        status: targetQueue.status
      };
    } catch (error) {
      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      this.logger.error('Error in getQueuePosition', { error, input });
      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.UNKNOWN,
        'An unexpected error occurred while getting queue position',
        'getQueuePosition',
        { input },
        error
      );
    }
  }

  /**
   * Sort queues by priority and creation time
   * @param queues List of queues to sort
   * @returns Sorted queues
   */
  private sortQueuesByPriority(queues: import('@/src/domain/entities/shop/backend/backend-queue.entity').QueueEntity[]): import('@/src/domain/entities/shop/backend/backend-queue.entity').QueueEntity[] {
    const priorityOrder: Record<string, number> = {
      'urgent': 1,
      'high': 2,
      'normal': 3
    };

    return queues.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Then sort by creation time (older queues first)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  /**
   * Calculate estimated wait time based on queues ahead
   * @param sortedQueues Sorted list of queues
   * @param queueIndex Index of the target queue
   * @param baseEstimatedWaitTime Base estimated wait time for the queue
   * @returns Calculated estimated wait time in minutes
   */
  private calculateEstimatedWaitTime(
    sortedQueues: import('@/src/domain/entities/shop/backend/backend-queue.entity').QueueEntity[], 
    queueIndex: number, 
    baseEstimatedWaitTime: number
  ): number {
    let totalTime = 0;

    // Add estimated time for all queues ahead
    for (let i = 0; i < queueIndex; i++) {
      const queue = sortedQueues[i];
      totalTime += queue.estimatedWaitTime || baseEstimatedWaitTime;
    }

    // Add some buffer time (10% of total time)
    const bufferTime = Math.round(totalTime * 0.1);

    return totalTime + bufferTime;
  }
}
