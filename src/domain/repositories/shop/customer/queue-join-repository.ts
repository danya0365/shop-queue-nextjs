import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import { CustomerEntity } from "@/src/domain/entities/shop/customer/customer.entity";
import type {
  JoinQueueResultEntity,
  QueueJoinEntity,
  ServiceOptionEntity,
  ShopQueueInfoEntity,
} from "@/src/domain/entities/shop/customer/queue-join.entity";

/**
 * Queue join repository error types
 */
export enum ShopCustomerQueueJoinErrorType {
  NOT_FOUND = "not_found",
  OPERATION_FAILED = "operation_failed",
  VALIDATION_ERROR = "validation_error",
  UNAUTHORIZED = "unauthorized",
  SHOP_NOT_ACCEPTING_QUEUES = "shop_not_accepting_queues",
  SERVICE_NOT_AVAILABLE = "service_not_available",
  UNKNOWN = "unknown",
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
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ShopCustomerQueueJoinError";
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
  joinQueue(
    queueData: Omit<
      QueueJoinEntity,
      "id" | "status" | "createdAt" | "updatedAt"
    >
  ): Promise<JoinQueueResultEntity>;

  /**
   * Get customer queues with pagination and status filter
   * @param customerId Customer ID
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @param status Optional status filter (default: all statuses)
   * @returns Paginated customer queues data
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  getCustomerQueues(
    customerId: string,
    page?: number,
    limit?: number,
    status?: QueueStatus
  ): Promise<{
    queues: QueueJoinEntity[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Get queue by ID
   * @param queueId Queue ID
   * @returns Queue data
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  getQueueById(queueId: string): Promise<QueueJoinEntity>;

  /**
   * Get customer by ID
   * @param customerId Customer ID
   * @returns Customer entity
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  getCustomerById(customerId: string): Promise<CustomerEntity>;

  /**
   * Get customer by profile ID
   * @param profileId Profile ID
   * @param shopId Shop ID
   * @returns Customer entity or null if not found
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  getCustomerByProfileId(profileId: string, shopId: string): Promise<CustomerEntity | null>;

  /**
   * Register a new customer
   * @param shopId Shop ID
   * @param name Customer name
   * @param phone Customer phone
   * @returns Customer registration result
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  registerCustomer(shopId: string, name: string, phone: string): Promise<{ customerId: string }>;

  /**
   * Link customer to profile
   * @param customerId Customer ID
   * @param phone Customer phone
   * @returns Link operation result
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  linkCustomerToProfile(customerId: string, phone: string): Promise<{ success: boolean }>;
}
