import type {
  CustomerQueueStatusEntity,
  QueueProgressEntity,
} from "@/src/domain/entities/shop/customer/customer-queue-status.entity";

/**
 * Customer queue status repository error types
 */
export enum CustomerQueueStatusErrorType {
  NOT_FOUND = "not_found",
  OPERATION_FAILED = "operation_failed",
  VALIDATION_ERROR = "validation_error",
  UNAUTHORIZED = "unauthorized",
  UNKNOWN = "unknown",
}

/**
 * Custom error class for customer queue status repository operations
 * Following Clean Architecture principles for error handling
 */
export class CustomerQueueStatusError extends Error {
  constructor(
    public readonly type: CustomerQueueStatusErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "CustomerQueueStatusError";
  }
}

/**
 * Customer queue status repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface CustomerQueueStatusRepository {
  /**
   * Get customer queue status by queue number
   * @param shopId The shop ID
   * @param queueNumber The queue number
   * @returns Customer queue status entity or null if not found
   * @throws CustomerQueueStatusError if the operation fails
   */
  getCustomerQueueStatus(
    shopId: string,
    queueNumber: string,
  ): Promise<CustomerQueueStatusEntity | null>;

  /**
   * Get queue progress information for a shop
   * @param shopId The shop ID
   * @returns Queue progress entity
   * @throws CustomerQueueStatusError if the operation fails
   */
  getQueueProgress(shopId: string): Promise<QueueProgressEntity>;

  /**
   * Cancel a customer queue
   * @param shopId The shop ID
   * @param queueNumber The queue number
   * @returns True if cancellation was successful
   * @throws CustomerQueueStatusError if the operation fails
   */
  cancelCustomerQueue(
    shopId: string,
    queueNumber: string,
  ): Promise<boolean>;
}
