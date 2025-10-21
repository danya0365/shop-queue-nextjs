import type {
  CustomerPointExpiryEntity,
  CustomerPointTransactionEntity,
  CustomerPointTransactionFilters,
  CustomerPointsEntity,
  CustomerPointsStatsEntity,
  CustomerPointsWithCustomerEntity,
  PaginatedCustomerPointTransactionsEntity,
} from "@/src/domain/entities/backend/backend-customer-points.entity";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";

export interface CustomerPointsListFilters {
  searchQuery?: string;
  membershipTier?: string;
  minCurrentPoints?: number;
  maxCurrentPoints?: number;
  minTotalEarned?: number;
  maxTotalEarned?: number;
  includeInactiveCustomers?: boolean;
}

export enum CustomerPointsRepositoryErrorType {
  NOT_FOUND = "not_found",
  VALIDATION_ERROR = "validation_error",
  PERMISSION_DENIED = "permission_denied",
  OPERATION_FAILED = "operation_failed",
  UNKNOWN = "unknown",
}

export class CustomerPointsRepositoryError extends Error {
  constructor(
    public readonly type: CustomerPointsRepositoryErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "CustomerPointsRepositoryError";
  }
}

export interface CustomerPointsRepository {
  getCustomerPointsByCustomerId(
    shopId: string,
    customerId: string,
  ): Promise<CustomerPointsEntity | null>;

  getCustomerPointsList(
    shopId: string,
    pagination: PaginationParams,
    filters?: CustomerPointsListFilters,
  ): Promise<{ data: CustomerPointsWithCustomerEntity[]; pagination: PaginationParams }>;

  getCustomerPointsStats(shopId: string): Promise<CustomerPointsStatsEntity>;

  addPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string,
    options?: {
      queueId?: string | null;
      metadata?: Record<string, unknown> | null;
    },
  ): Promise<CustomerPointsEntity>;

  redeemPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string,
    options?: {
      rewardId?: string | null;
      metadata?: Record<string, unknown> | null;
    },
  ): Promise<CustomerPointsEntity>;

  adjustPoints(
    shopId: string,
    customerId: string,
    adjustment: number,
    description: string,
    metadata?: Record<string, unknown> | null,
  ): Promise<CustomerPointsEntity>;

  getCustomerPointTransactions(
    shopId: string,
    customerId: string | null,
    pagination: PaginationParams,
    filters?: CustomerPointTransactionFilters,
  ): Promise<PaginatedCustomerPointTransactionsEntity>;

  getRecentTransactions(
    shopId: string,
    limit?: number,
  ): Promise<CustomerPointTransactionEntity[]>;

  getTransactionById(
    shopId: string,
    transactionId: string,
  ): Promise<CustomerPointTransactionEntity | null>;

  getExpirySchedule(
    shopId: string,
    customerId: string,
  ): Promise<CustomerPointExpiryEntity[]>;

  cancelTransaction(
    shopId: string,
    transactionId: string,
    reason?: string,
  ): Promise<CustomerPointsEntity>;
}
