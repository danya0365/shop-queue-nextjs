import type { CreateQueueEntity, PaginatedQueuesEntity, QueueEntity, QueueStatsEntity, UpdateQueueEntity } from '@/src/domain/entities/shop/backend/backend-queue.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Queue repository error types
 */
export enum ShopBackendQueueErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for queue repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendQueueError extends Error {
  constructor(
    public readonly type: ShopBackendQueueErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopBackendQueueError';
  }
}

/**
 * Queue repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendQueueRepository {
  /**
   * Get paginated queues data
   * @param params Pagination parameters with filters
   * @returns Paginated queues data
   * @throws ShopBackendQueueError if the operation fails
   */
  getPaginatedQueues(params: PaginationParams & {
    filters?: {
      searchQuery?: string;
      statusFilter?: string;
      priorityFilter?: string;
      shopId?: string;
      customerId?: string;
      dateFrom?: string;
      dateTo?: string;
    };
  }): Promise<PaginatedQueuesEntity>;

  /**
   * Get queue statistics
   * @param shopId Shop ID for filtering statistics
   * @returns Queue statistics data
   * @throws ShopBackendQueueError if the operation fails
   */
  getQueueStats(shopId: string): Promise<QueueStatsEntity>;

  /**
   * Get queue by ID
   * @param id Queue ID
   * @returns Queue entity or null if not found
   * @throws ShopBackendQueueError if the operation fails
   */
  getQueueById(id: string): Promise<QueueEntity | null>;

  /**
   * Create a new queue
   * @param queue Queue entity to create
   * @returns Created queue entity
   * @throws ShopBackendQueueError if the operation fails
   */
  createQueue(queue: Omit<CreateQueueEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<QueueEntity>;

  /**
   * Update an existing queue
   * @param id Queue ID
   * @param queue Queue data to update
   * @returns Updated queue entity
   * @throws ShopBackendQueueError if the operation fails
   */
  updateQueue(id: string, queue: Partial<UpdateQueueEntity>): Promise<QueueEntity>;

  /**
   * Delete a queue
   * @param id Queue ID
   * @returns true if deleted, false if not found
   * @throws ShopBackendQueueError if the operation fails
   */
  deleteQueue(id: string): Promise<boolean>;
}
