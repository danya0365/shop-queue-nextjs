import type {
  CustomerDashboardEntity,
  PopularServiceEntity,
  PromotionEntity,
  QueueStatusStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-dashboard.entity";

export enum ShopCustomerDashboardErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  DATABASE_ERROR = "DATABASE_ERROR",
  UNKNOWN = "UNKNOWN",
}

export class ShopCustomerDashboardError extends Error {
  constructor(
    public readonly type: ShopCustomerDashboardErrorType,
    message: string,
    public readonly method: string,
    public readonly context?: Record<string, unknown>,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "ShopCustomerDashboardError";
  }
}

export interface ShopCustomerDashboardRepository {
  /**
   * Get queue status statistics for a shop
   * @param shopId The shop ID
   * @returns Queue status statistics
   */
  getQueueStatus(shopId: string): Promise<QueueStatusStatsEntity>;

  /**
   * Get popular services for a shop
   * @param shopId The shop ID
   * @param limit Maximum number of services to return (default: 10)
   * @returns Array of popular services
   */
  getPopularServices(shopId: string, limit?: number): Promise<PopularServiceEntity[]>;

  /**
   * Get active promotions for a shop (paginated)
   * @param shopId The shop ID
   * @param page Page number (1-based). Optional, defaults to 1.
   * @param limit Items per page. Optional, defaults to 10.
   * @returns Array of active promotions
   */
  getPromotions(shopId: string, page?: number, limit?: number): Promise<PromotionEntity[]>;

  /**
   * Get total count of active and currently valid promotions for a shop
   * Used for pagination metadata
   */
  getPromotionsCount(shopId: string): Promise<number>;

  /**
   * Get complete customer dashboard data
   * @param shopId The shop ID
   * @returns Complete customer dashboard data
   */
  getCustomerDashboard(shopId: string): Promise<CustomerDashboardEntity>;
}
