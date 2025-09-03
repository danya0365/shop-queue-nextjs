import { 
  DashboardStatsEntity, 
  PopularServiceEntity, 
  QueueStatusDistributionEntity, 
  RecentActivityEntity 
} from "../../entities/backend/backend-dashboard.entity";

/**
 * Error types for dashboard repository operations
 */
export enum BackendDashboardErrorType {
  NOT_FOUND = 'NOT_FOUND',
  OPERATION_FAILED = 'OPERATION_FAILED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Custom error class for dashboard repository operations
 */
export class BackendDashboardError extends Error {
  constructor(
    public readonly type: BackendDashboardErrorType,
    message: string,
    public readonly operation: string,
    public readonly params: Record<string, unknown> = {},
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'BackendDashboardError';
  }
}

/**
 * Repository interface for dashboard operations
 * Following Clean Architecture principles for repository interfaces
 */
export interface BackendDashboardRepository {
  /**
   * Get dashboard statistics
   * @returns Dashboard statistics entity
   */
  getDashboardStats(): Promise<DashboardStatsEntity>;

  /**
   * Get queue status distribution
   * @returns Queue status distribution entity
   */
  getQueueDistribution(): Promise<QueueStatusDistributionEntity>;

  /**
   * Get popular services
   * @param limit Number of services to return
   * @returns Array of popular service entities
   */
  getPopularServices(limit?: number): Promise<PopularServiceEntity[]>;

  /**
   * Get recent activities
   * @param limit Number of activities to return
   * @returns Array of recent activity entities
   */
  getRecentActivities(limit?: number): Promise<RecentActivityEntity[]>;
}
