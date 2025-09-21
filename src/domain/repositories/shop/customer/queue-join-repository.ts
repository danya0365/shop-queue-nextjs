import type {
  ServiceOptionEntity,
  QueueServiceEntity,
  ShopQueueInfoEntity,
  QueueJoinEntity,
  JoinQueueResultEntity,
} from "@/src/domain/entities/shop/customer/queue-join.entity";

/**
 * Queue join repository error types
 */
export enum ShopCustomerQueueJoinErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  SHOP_NOT_ACCEPTING_QUEUES = 'shop_not_accepting_queues',
  SERVICE_NOT_AVAILABLE = 'service_not_available',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for queue join repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopCustomerQueueJoinError extends Error {
  constructor(
    public readonly type: ShopCustomerQueueJoinErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopCustomerQueueJoinError';
  }
}

/**
 * Queue join repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopCustomerQueueJoinRepository {
  /**
   * Get available services for a shop
   * @param shopId Shop ID
   * @returns Array of available service options
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  getAvailableServices(shopId: string): Promise<ServiceOptionEntity[]>;

  /**
   * Get shop queue information
   * @param shopId Shop ID
   * @returns Shop queue information including wait times and queue status
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  getShopQueueInfo(shopId: string): Promise<ShopQueueInfoEntity>;

  /**
   * Join a queue with selected services
   * @param queueData Queue join data including customer info and services
   * @returns Result of the queue join operation
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  joinQueue(queueData: Omit<QueueJoinEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<JoinQueueResultEntity>;
}
