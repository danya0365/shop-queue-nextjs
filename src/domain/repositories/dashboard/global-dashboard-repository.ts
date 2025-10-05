import type {
  GlobalDashboardStatsEntity,
  GlobalRecentActivityEntity,
  ShopPerformanceSummaryEntity,
} from '@/src/domain/entities/dashboard/global-dashboard.entity';

/**
 * Global Dashboard Repository Interface
 * Defines contract for retrieving aggregated dashboard data across all user's shops
 */
export interface GlobalDashboardRepository {
  /**
   * Get aggregated statistics across all shops owned by a user
   * @param profileId - The profile ID of the shop owner
   * @returns Promise with global dashboard statistics
   */
  getGlobalStats(profileId: string): Promise<GlobalDashboardStatsEntity>;

  /**
   * Get recent activities across all shops owned by a user
   * @param profileId - The profile ID of the shop owner
   * @param limit - Maximum number of activities to return (default: 10)
   * @returns Promise with array of recent activities
   */
  getRecentActivities(
    profileId: string,
    limit?: number
  ): Promise<GlobalRecentActivityEntity[]>;

  /**
   * Get performance summary for each shop owned by a user
   * @param profileId - The profile ID of the shop owner
   * @returns Promise with array of shop performance summaries
   */
  getShopPerformances(
    profileId: string
  ): Promise<ShopPerformanceSummaryEntity[]>;

  /**
   * Get complete global dashboard data (stats + activities + shop performances)
   * @param profileId - The profile ID of the shop owner
   * @param activityLimit - Maximum number of activities to return (default: 10)
   * @returns Promise with complete global dashboard data
   */
  getGlobalDashboardData(
    profileId: string,
    activityLimit?: number
  ): Promise<{
    stats: GlobalDashboardStatsEntity;
    recentActivities: GlobalRecentActivityEntity[];
    shopPerformances: ShopPerformanceSummaryEntity[];
  }>;
}
