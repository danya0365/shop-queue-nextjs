import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import type {
  CustomerQueueHistoryEntity,
  CustomerStatsEntity,
  CustomerInfoEntity,
} from "@/src/domain/entities/shop/customer/customer-history.entity";

/**
 * Customer history repository error types
 */
export enum ShopCustomerHistoryErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for customer history repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopCustomerHistoryError extends Error {
  constructor(
    public readonly type: ShopCustomerHistoryErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopCustomerHistoryError';
  }
}

/**
 * Customer history repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopCustomerHistoryRepository {
  /**
   * Get paginated customer queue history
   * @param params Pagination parameters with filters
   * @returns Paginated customer queue history data
   * @throws ShopCustomerHistoryError if the operation fails
   */
  getCustomerQueueHistory(params: PaginationParams & {
    shopId: string;
    customerId?: string;
    filters?: {
      status?: "all" | "completed" | "cancelled" | "no_show";
      dateRange?: "all" | "month" | "quarter" | "year";
      shop?: string;
      startDate?: string;
      endDate?: string;
    };
  }): Promise<{
    data: CustomerQueueHistoryEntity[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;

  /**
   * Get customer statistics
   * @param shopId Shop ID
   * @param customerId Customer ID (optional)
   * @returns Customer statistics data
   * @throws ShopCustomerHistoryError if the operation fails
   */
  getCustomerStats(shopId: string, customerId?: string): Promise<CustomerStatsEntity>;

  /**
   * Get customer information
   * @param shopId Shop ID
   * @param customerId Customer ID (optional)
   * @returns Customer information including name
   * @throws ShopCustomerHistoryError if the operation fails
   */
  getCustomerInfo(shopId: string, customerId?: string): Promise<CustomerInfoEntity>;
}
