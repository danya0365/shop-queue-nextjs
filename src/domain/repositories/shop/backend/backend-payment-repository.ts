import type { CreatePaymentEntity, PaginatedPaymentsEntity, PaymentEntity, PaymentMethodStatsEntity, PaymentStatsEntity, UpdatePaymentEntity } from '@/src/domain/entities/shop/backend/backend-payment.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Payment repository error types
 */
export enum ShopBackendPaymentErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for payment repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendPaymentError extends Error {
  constructor(
    public readonly type: ShopBackendPaymentErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopBackendPaymentError';
  }
}

/**
 * Payment repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendPaymentRepository {
  /**
   * Get paginated payments data
   * @param params Pagination and filter parameters
   * @returns Paginated payments data
   * @throws ShopBackendPaymentError if the operation fails
   */
  getPaginatedPayments(params: PaginationParams & {
    filters?: {
      searchQuery?: string;
      paymentMethodFilter?: string;
      paymentStatusFilter?: string;
      dateFrom?: string;
      dateTo?: string;
      minAmount?: number;
      maxAmount?: number;
    };
  }): Promise<PaginatedPaymentsEntity>;

  /**
   * Get payment statistics
   * @returns Payment statistics data
   * @throws ShopBackendPaymentError if the operation fails
   */
  getPaymentStats(): Promise<PaymentStatsEntity>;

  /**
   * Get payment method statistics
   * @returns Payment method statistics data
   * @throws ShopBackendPaymentError if the operation fails
   */
  getPaymentMethodStats(): Promise<PaymentMethodStatsEntity>;

  /**
   * Get payment by ID
   * @param id Payment ID
   * @returns Payment entity or null if not found
   * @throws ShopBackendPaymentError if the operation fails
   */
  getPaymentById(id: string): Promise<PaymentEntity | null>;

  /**
   * Create a new payment
   * @param payment Payment data to create
   * @returns Created payment entity
   * @throws ShopBackendPaymentError if the operation fails
   */
  createPayment(payment: Omit<CreatePaymentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentEntity>;

  /**
   * Update an existing payment
   * @param id Payment ID
   * @param payment Payment data to update
   * @returns Updated payment entity
   * @throws ShopBackendPaymentError if the operation fails
   */
  updatePayment(id: string, payment: Partial<Omit<UpdatePaymentEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PaymentEntity>;

  /**
   * Delete a payment
   * @param id Payment ID
   * @returns true if deleted successfully
   * @throws ShopBackendPaymentError if the operation fails
   */
  deletePayment(id: string): Promise<boolean>;
}
