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
   * Get queue ID by queue number (helper method for backward compatibility)
   * @param shopId The shop ID
   * @param queueNumber The queue number
   * @returns Queue ID or null if not found
   * @throws CustomerQueueStatusError if the operation fails
   */
  getQueueIdByNumber(
    shopId: string,
    queueNumber: string,
  ): Promise<string | null>;

  /**
   * Check if a customer is the owner of a queue
   * @param queueId The queue ID
   * @param customerId The customer ID to check
   * @returns True if the customer is the owner of the queue
   * @throws CustomerQueueStatusError if the operation fails
   */
  isQueueOwner(
    queueId: string,
    customerId: string
  ): Promise<boolean>;

  /**
   * Get customer queue status by queue ID
   * @param shopId The shop ID
   * @param queueId The queue ID
   * @returns Customer queue status entity or null if not found
   * @throws CustomerQueueStatusError if the operation fails
   */
  getCustomerQueueStatus(
    shopId: string,
    queueId: string,
  ): Promise<CustomerQueueStatusEntity | null>;

  /**
   * Get queue progress information for a shop
   * @param shopId The shop ID
   * @returns Queue progress entity
   * @throws CustomerQueueStatusError if the operation fails
   */
  getQueueProgress(shopId: string): Promise<QueueProgressEntity>;

  /**
   * Cancel a customer queue by queue ID with explicit ownership verification
   * @param queueId The queue ID
   * @param customerId The customer ID that must own the queue
   */
  cancelCustomerQueueById(
    queueId: string,
    customerId: string,
  ): Promise<boolean>;
}
