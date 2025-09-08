import type { CustomerEntity, CustomerStatsEntity, PaginatedCustomersEntity } from '@/src/domain/entities/shop/backend/backend-customer.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Customer repository error types
 */
export enum ShopBackendCustomerErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for customer repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendCustomerError extends Error {
  constructor(
    public readonly type: ShopBackendCustomerErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopBackendCustomerError';
  }
}

/**
 * Customer repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendCustomerRepository {
  /**
   * Get paginated customers data
   * @param params Pagination parameters
   * @returns Paginated customers data
   * @throws ShopBackendCustomerError if the operation fails
   */
  getPaginatedCustomers(params: PaginationParams): Promise<PaginatedCustomersEntity>;

  /**
   * Get customer statistics
   * @returns Customer statistics data
   * @throws ShopBackendCustomerError if the operation fails
   */
  getCustomerStats(): Promise<CustomerStatsEntity>;

  /**
   * Get customer by ID
   * @param id Customer ID
   * @returns Customer entity or null if not found
   * @throws ShopBackendCustomerError if the operation fails
   */
  getCustomerById(id: string): Promise<CustomerEntity | null>;

  /**
   * Create a new customer
   * @param customer Customer data to create
   * @returns Created customer entity
   * @throws ShopBackendCustomerError if the operation fails
   */
  createCustomer(customer: Omit<CustomerEntity, 'id' | 'createdAt' | 'updatedAt' | 'totalQueues' | 'totalPoints' | 'membershipTier' | 'lastVisit'>): Promise<CustomerEntity>;

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param customer Customer data to update
   * @returns Updated customer entity
   * @throws ShopBackendCustomerError if the operation fails
   */
  updateCustomer(id: string, customer: Partial<Omit<CustomerEntity, 'id' | 'createdAt' | 'updatedAt' | 'totalQueues' | 'totalPoints' | 'membershipTier' | 'lastVisit'>>): Promise<CustomerEntity>;

  /**
   * Delete a customer
   * @param id Customer ID
   * @returns void
   * @throws ShopBackendCustomerError if the operation fails
   */
  deleteCustomer(id: string): Promise<void>;
}
