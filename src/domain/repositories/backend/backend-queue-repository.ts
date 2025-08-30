import { PaginatedQueuesEntity, QueueEntity, QueueStatsEntity } from "../../entities/backend/backend-queue.entity";
import { PaginationParams } from "../../interfaces/pagination-types";

/**
 * Queue repository error types
 */
export enum BackendQueueErrorType {
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
export class BackendQueueError extends Error {
  constructor(
    public readonly type: BackendQueueErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendQueueError';
  }
}

/**
 * Queue repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface BackendQueueRepository {
  /**
   * Get paginated queues data
   * @param params Pagination parameters
   * @returns Paginated queues data
   * @throws BackendQueueError if the operation fails
   */
  getPaginatedQueues(params: PaginationParams): Promise<PaginatedQueuesEntity>;

  /**
   * Get queue statistics
   * @returns Queue statistics data
   * @throws BackendQueueError if the operation fails
   */
  getQueueStats(): Promise<QueueStatsEntity>;

  /**
   * Get queue by ID
   * @param id Queue ID
   * @returns Queue entity or null if not found
   * @throws BackendQueueError if the operation fails
   */
  getQueueById(id: string): Promise<QueueEntity | null>;

  /**
   * Create a new queue
   * @param queue Queue entity to create
   * @returns Created queue entity
   * @throws BackendQueueError if the operation fails
   */
  createQueue(queue: Omit<QueueEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<QueueEntity>;

  /**
   * Update an existing queue
   * @param id Queue ID
   * @param queue Queue data to update
   * @returns Updated queue entity
   * @throws BackendQueueError if the operation fails
   */
  updateQueue(id: string, queue: Partial<QueueEntity>): Promise<QueueEntity>;

  /**
   * Delete a queue
   * @param id Queue ID
   * @returns true if deleted, false if not found
   * @throws BackendQueueError if the operation fails
   */
  deleteQueue(id: string): Promise<boolean>;
}
