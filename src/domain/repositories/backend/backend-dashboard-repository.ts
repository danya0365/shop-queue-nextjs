import {
  BackendActivityEntity,
  DailyViewsEntity,
  DashboardStatsEntity,
  MonthlyNewVideosEntity,
  PopularVideoEntity,
  RecentProfileEntity,
  SystemHealthEntity
} from '../../entities/backend/backend-dashboard.entity';
import { BaseError } from '../../errors/base-error';

/**
 * Error types specific to backend dashboard operations
 */
export enum BackendDashboardErrorType {
  NOT_FOUND = 'BACKEND_DASHBOARD_NOT_FOUND',
  OPERATION_FAILED = 'BACKEND_DASHBOARD_OPERATION_FAILED',
  UNKNOWN = 'BACKEND_DASHBOARD_UNKNOWN_ERROR'
}

/**
 * Domain error for backend dashboard operations
 * Following SOLID principles by encapsulating error handling for backend dashboard domain
 */
export class BackendDashboardError extends BaseError {
  constructor(
    public readonly type: BackendDashboardErrorType,
    message: string,
    operation?: string,
    context?: Record<string, unknown>,
    cause?: unknown
  ) {
    super(message, operation, context, cause);
    this.name = 'BackendDashboardError';
  }
}

/**
 * Interface for Backend Dashboard Repository
 * Following SOLID principles by defining a focused interface for backend dashboard operations
 */
export interface BackendDashboardRepository {
  /**
   * Get system health status
   * @returns System health data or null if not available
   * @throws BackendDashboardError if the operation fails
   */
  getSystemHealth(): Promise<SystemHealthEntity | null>;
  
  /**
   * Get recent backend activities
   * @param limit Maximum number of activities to return
   * @returns List of recent activities
   * @throws BackendDashboardError if the operation fails
   */
  getRecentActivities(limit?: number): Promise<BackendActivityEntity[]>;

  /**
   * Get dashboard statistics
   * @returns Dashboard statistics data
   * @throws BackendDashboardError if the operation fails
   */
  getDashboardStats(): Promise<DashboardStatsEntity>;

  /**
   * Get popular videos
   * @param limit Maximum number of videos to return (default: 5)
   * @returns List of popular videos
   * @throws BackendDashboardError if the operation fails
   */
  getPopularVideos(limit?: number): Promise<PopularVideoEntity[]>;

  /**
   * Get recent user profiles
   * @param limit Maximum number of profiles to return (default: 5)
   * @returns List of recent user profiles
   * @throws BackendDashboardError if the operation fails
   */
  getRecentProfiles(limit?: number): Promise<RecentProfileEntity[]>;
  
  /**
   * Get daily views data for the last n days
   * @param days Number of days to retrieve data for (default: 7)
   * @returns Daily views data
   * @throws BackendDashboardError if the operation fails
   */
  getDailyViews(days?: number): Promise<DailyViewsEntity>;
  
  /**
   * Get monthly new videos data for the last n months
   * @param months Number of months to retrieve data for (default: 6)
   * @returns Monthly new videos data
   * @throws BackendDashboardError if the operation fails
   */
  getMonthlyNewVideos(months?: number): Promise<MonthlyNewVideosEntity>;
}
