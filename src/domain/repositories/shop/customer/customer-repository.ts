import { CustomerEntity } from "@/src/domain/entities/shop/customer/customer.entity";

/**
 * Customer repository error types
 */
export enum ShopCustomerErrorType {
  NOT_FOUND = "not_found",
  OPERATION_FAILED = "operation_failed",
  VALIDATION_ERROR = "validation_error",
  UNAUTHORIZED = "unauthorized",
  UNKNOWN = "unknown",
}

/**
 * Custom error class for customer repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopCustomerError extends Error {
  constructor(
    public readonly type: ShopCustomerErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ShopCustomerError";
  }
}

/**
 * Customer repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopCustomerRepository {
  /**
   * Get customer by ID
   * @param customerId Customer ID
   * @returns Customer entity
   * @throws ShopCustomerError if the operation fails
   */
  getCustomerById(customerId: string): Promise<CustomerEntity>;

  /**
   * Get customer by profile ID
   * @param profileId Profile ID
   * @param shopId Shop ID
   * @returns Customer entity or null if not found
   * @throws ShopCustomerError if the operation fails
   */
  getCustomerByProfileId(profileId: string, shopId: string): Promise<CustomerEntity | null>;

  /**
   * Register a new customer
   * @param shopId Shop ID
   * @param name Customer name
   * @param phone Customer phone
   * @returns Customer registration result
   * @throws ShopCustomerError if the operation fails
   */
  registerCustomer(shopId: string, name: string, phone: string): Promise<{ customerId: string }>;

  /**
   * Link customer to profile
   * @param customerId Customer ID
   * @param phone Customer phone
   * @returns Link operation result
   * @throws ShopCustomerError if the operation fails
   */
  linkCustomerToProfile(customerId: string, phone: string): Promise<{ success: boolean }>;
}
