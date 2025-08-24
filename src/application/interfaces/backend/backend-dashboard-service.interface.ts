import { 
  BackendActivityDto, 
  DashboardStatsDto, 
  PopularVideoDto, 
  RecentProfileDto, 
  SystemHealthDto 
} from '../../dtos/backend/backend-dashboard-dto';

/**
 * Interface for Backend Dashboard Service
 * Following SOLID principles by defining a focused interface for backend dashboard operations
 */
export interface IBackendDashboardService {
  /**
   * Get system health status
   * @returns System health data or null if not available
   */
  getSystemHealth(): Promise<SystemHealthDto | null>;
  
  /**
   * Get recent backend activities
   * @param limit Maximum number of activities to return
   * @returns List of recent activities
   */
  getRecentActivities(limit?: number): Promise<BackendActivityDto[]>;

  /**
   * Get dashboard statistics
   * @returns Dashboard statistics data
   */
  getDashboardStats(): Promise<DashboardStatsDto>;

  /**
   * Get popular videos
   * @param limit Maximum number of videos to return (default: 5)
   * @returns List of popular videos
   */
  getPopularVideos(limit?: number): Promise<PopularVideoDto[]>;

  /**
   * Get recent user profiles
   * @param limit Maximum number of profiles to return (default: 5)
   * @returns List of recent user profiles
   */
  getRecentProfiles(limit?: number): Promise<RecentProfileDto[]>;
}
