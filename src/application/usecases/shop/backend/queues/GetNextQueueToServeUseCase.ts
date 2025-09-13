import { QueueDTO } from '@/src/application/dtos/shop/backend/queues-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueMapper } from '@/src/application/mappers/shop/backend/queue-mapper';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import type { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Input DTO for GetNextQueueToServeUseCase
 */
export interface GetNextQueueToServeInput {
  shopId: string;
  employeeId?: string;
  departmentId?: string;
  priorityOnly?: boolean;
}

/**
 * Use case for getting the next queue to serve
 * Following SOLID principles and Clean Architecture
 */
export class GetNextQueueToServeUseCase implements IUseCase<GetNextQueueToServeInput, QueueDTO | null> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get the next queue to serve
   * @param input Parameters for finding next queue
   * @returns Next queue DTO or null if no queue available
   */
  async execute(input: GetNextQueueToServeInput): Promise<QueueDTO | null> {
    try {
      // Validate input
      if (!input.shopId) {
        throw new Error('Shop ID is required');
      }

      this.logger.info('Getting next queue to serve', { input });

      // Build filters for finding the next queue
      const filters: {
        shopId: string;
        statusFilter: string;
        priorityFilter?: string;
      } = {
        shopId: input.shopId,
        statusFilter: 'waiting'
      };

      // If priority only, filter by urgent/high priority
      if (input.priorityOnly) {
        filters.priorityFilter = 'urgent,high';
      }

      // Get paginated queues sorted by priority and creation time
      const queuesResult = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 50, // Get a reasonable batch to process
        filters
      });

      let queues = queuesResult.data;

      // Filter queues based on business rules
      queues = this.filterQueuesByBusinessRules(queues, input);

      if (queues.length === 0) {
        this.logger.info('No queues available to serve', { input });
        return null;
      }

      // Sort queues by priority and creation time
      const sortedQueues = this.sortQueuesByPriority(queues);

      // Get the next queue
      const nextQueue = sortedQueues[0];

      this.logger.info('Next queue to serve found', { 
        queueId: nextQueue.id, 
        queueNumber: nextQueue.queueNumber,
        priority: nextQueue.priority 
      });

      return QueueMapper.toDTO(nextQueue);
    } catch (error) {
      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      this.logger.error('Error in getNextQueueToServe', { error, input });
      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.UNKNOWN,
        'An unexpected error occurred while getting next queue to serve',
        'getNextQueueToServe',
        { input },
        error
      );
    }
  }

  /**
   * Filter queues based on business rules
   * @param queues List of queues to filter
   * @param input Input parameters
   * @returns Filtered queues
   */
  private filterQueuesByBusinessRules(queues: import('@/src/domain/entities/shop/backend/backend-queue.entity').QueueEntity[], input: GetNextQueueToServeInput): import('@/src/domain/entities/shop/backend/backend-queue.entity').QueueEntity[] {
    return queues.filter(queue => {
      // Skip queues that are already assigned to another employee
      if (queue.servedByEmployeeId && queue.servedByEmployeeId !== input.employeeId) {
        return false;
      }

      // If department is specified, filter by department
      // This would need to be implemented based on your department-queue relationship
      if (input.departmentId) {
        // For now, we'll assume all queues in the shop are eligible
        // In a real implementation, you might check queue.departmentId or similar
      }

      return true;
    });
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
}
