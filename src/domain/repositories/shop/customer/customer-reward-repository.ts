import type {
  CustomerRewardEntity,
  CustomerPointsEntity,
  RewardTransactionEntity,
  AvailableRewardEntity,
  CustomerRewardStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-reward.entity";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";

/**
 * Customer reward repository error types
 */
export enum ShopCustomerRewardErrorType {
  NOT_FOUND = "not_found",
  OPERATION_FAILED = "operation_failed",
  VALIDATION_ERROR = "validation_error",
  UNAUTHORIZED = "unauthorized",
  INSUFFICIENT_POINTS = "insufficient_points",
  REWARD_UNAVAILABLE = "reward_unavailable",
  REWARD_EXPIRED = "reward_expired",
  UNKNOWN = "unknown",
}

/**
 * Custom error class for customer reward repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopCustomerRewardError extends Error {
  constructor(
    public readonly type: ShopCustomerRewardErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ShopCustomerRewardError";
  }
}

/**
 * Customer reward repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopCustomerRewardRepository {
  /**
   * Get customer points information
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer points entity
   * @throws ShopCustomerRewardError if the operation fails
   */
  getCustomerPoints(shopId: string, customerId: string): Promise<CustomerPointsEntity>;

  /**
   * Get available rewards with pagination and filters
   * @param params Pagination parameters with filters
   * @returns Paginated available rewards
   * @throws ShopCustomerRewardError if the operation fails
   */
  getAvailableRewards(params: PaginationParams & {
    shopId: string;
    customerId?: string;
    filters?: {
      category?: string;
      type?: "discount" | "free_item" | "cashback" | "points";
      isAvailable?: boolean;
      minPointsCost?: number;
      maxPointsCost?: number;
    };
  }): Promise<{
    data: AvailableRewardEntity[];
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
   * Get redeemed rewards with pagination and filters
   * @param params Pagination parameters with filters
   * @returns Paginated redeemed rewards
   * @throws ShopCustomerRewardError if the operation fails
   */
  getRedeemedRewards(params: PaginationParams & {
    shopId: string;
    customerId: string;
    filters?: {
      category?: string;
      type?: "discount" | "free_item" | "cashback" | "points";
      dateRange?: "all" | "month" | "quarter" | "year" | "custom";
      startDate?: string;
      endDate?: string;
    };
  }): Promise<{
    data: CustomerRewardEntity[];
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
   * Get reward transactions with pagination and filters
   * @param params Pagination parameters with filters
   * @returns Paginated reward transactions
   * @throws ShopCustomerRewardError if the operation fails
   */
  getRewardTransactions(params: PaginationParams & {
    shopId: string;
    customerId: string;
    filters?: {
      type?: "earned" | "redeemed" | "expired";
      dateRange?: "all" | "month" | "quarter" | "year" | "custom";
      startDate?: string;
      endDate?: string;
    };
  }): Promise<{
    data: RewardTransactionEntity[];
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
   * Get reward details by ID
   * @param shopId The shop ID
   * @param rewardId The reward ID
   * @param customerId The customer ID (optional)
   * @returns Reward details
   * @throws ShopCustomerRewardError if the operation fails
   */
  getRewardById(shopId: string, rewardId: string, customerId?: string): Promise<AvailableRewardEntity | CustomerRewardEntity>;

  /**
   * Redeem a reward for a customer
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @param rewardId The reward ID
   * @returns Redeemed reward entity
   * @throws ShopCustomerRewardError if the operation fails
   */
  redeemReward(shopId: string, customerId: string, rewardId: string): Promise<CustomerRewardEntity>;

  /**
   * Get customer reward statistics
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer reward statistics
   * @throws ShopCustomerRewardError if the operation fails
   */
  getCustomerRewardStats(shopId: string, customerId: string): Promise<CustomerRewardStatsEntity>;

  /**
   * Get customer information for rewards
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer information
   * @throws ShopCustomerRewardError if the operation fails
   */
  getCustomerInfo(shopId: string, customerId: string): Promise<{
    customerName: string;
    memberSince: string;
  }>;
}
