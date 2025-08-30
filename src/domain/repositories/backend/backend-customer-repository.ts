import { CustomerEntity, CustomerStatsEntity, PaginatedCustomersEntity } from "../../entities/backend/backend-customer.entity";
import { PaginationParams } from "../../interfaces/pagination-types";

/**
 * Customer repository error types
 */
export enum BackendCustomerErrorType {
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
export class BackendCustomerError extends Error {
  constructor(
    public readonly type: BackendCustomerErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendCustomerError';
  }
}

/**
 * Customer repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface BackendCustomerRepository {
  /**
   * Get paginated customers data
   * @param params Pagination parameters
   * @returns Paginated customers data
   * @throws BackendCustomerError if the operation fails
   */
  getPaginatedCustomers(params: PaginationParams): Promise<PaginatedCustomersEntity>;

  /**
   * Get customer statistics
   * @returns Customer statistics data
   * @throws BackendCustomerError if the operation fails
   */
  getCustomerStats(): Promise<CustomerStatsEntity>;

  /**
   * Get customer by ID
   * @param id Customer ID
   * @returns Customer entity or null if not found
   * @throws BackendCustomerError if the operation fails
   */
  getCustomerById(id: string): Promise<CustomerEntity | null>;

  /**
   * Create a new customer
   * @param customer Customer data to create
   * @returns Created customer entity
   * @throws BackendCustomerError if the operation fails
   */
  createCustomer(customer: Omit<CustomerEntity, 'id' | 'createdAt' | 'updatedAt' | 'totalQueues' | 'totalPoints' | 'membershipTier' | 'lastVisit'>): Promise<CustomerEntity>;

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param customer Customer data to update
   * @returns Updated customer entity
   * @throws BackendCustomerError if the operation fails
   */
  updateCustomer(id: string, customer: Partial<Omit<CustomerEntity, 'id' | 'createdAt' | 'updatedAt' | 'totalQueues' | 'totalPoints' | 'membershipTier' | 'lastVisit'>>): Promise<CustomerEntity>;

  /**
   * Delete a customer
   * @param id Customer ID
   * @returns void
   * @throws BackendCustomerError if the operation fails
   */
  deleteCustomer(id: string): Promise<void>;
}
