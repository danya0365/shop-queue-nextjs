import type {
  DashboardStatsEntity,
  PopularServiceEntity,
  QueueStatusDistributionEntity,
  RecentActivityEntity,
} from "@/src/domain/entities/shop/backend/backend-dashboard.entity";

/**
 * Error types for dashboard repository operations
 */
export enum ShopBackendDashboardErrorType {
  NOT_FOUND = "NOT_FOUND",
  OPERATION_FAILED = "OPERATION_FAILED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN = "UNKNOWN",
}

/**
 * Custom error class for dashboard repository operations
 */
export class ShopBackendDashboardError extends Error {
  constructor(
    public readonly type: ShopBackendDashboardErrorType,
    message: string,
    public readonly operation: string,
    public readonly params: Record<string, unknown> = {},
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ShopBackendDashboardError";
  }
}

/**
 * Repository interface for dashboard operations
 * Following Clean Architecture principles for repository interfaces
 */
export interface ShopBackendDashboardRepository {
  /**
   * Get dashboard statistics
   * @param shopId The shop ID
   * @returns Dashboard statistics entity
   */
  getDashboardStats(shopId: string): Promise<DashboardStatsEntity>;

  /**
   * Get queue status distribution
   * @param shopId The shop ID
   * @returns Queue status distribution entity
   */
  getQueueDistribution(shopId: string): Promise<QueueStatusDistributionEntity>;

  /**
   * Get popular services
   * @param shopId The shop ID
   * @param limit Number of services to return
   * @returns Array of popular service entities
   */
  getPopularServices(
    shopId: string,
    limit?: number
  ): Promise<PopularServiceEntity[]>;

  /**
   * Get recent activities
   * @param shopId The shop ID
   * @param limit Number of activities to return
   * @returns Array of recent activity entities
   */
  getRecentActivities(
    shopId: string,
    limit?: number
  ): Promise<RecentActivityEntity[]>;

  /**
   * Get queue statistics
   * @param shopId The shop ID
   * @returns Queue statistics
   */
  getQueueStats(shopId: string): Promise<{
    waiting: number;
    confirmed: number;
    serving: number;
    completed: number;
    cancelled: number;
  }>;

  /**
   * Get revenue statistics
   * @param shopId The shop ID
   * @returns Revenue statistics
   */
  getRevenueStats(shopId: string): Promise<{
    today: number;
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  }>;

  /**
   * Get employee statistics
   * @param shopId The shop ID
   * @returns Employee statistics
   */
  getEmployeeStats(shopId: string): Promise<{
    total: number;
    online: number;
    serving: number;
  }>;

  /**
   * Get shop name
   * @param shopId The shop ID
   * @returns Shop name
   */
  getShopName(shopId: string): Promise<string>;
}
