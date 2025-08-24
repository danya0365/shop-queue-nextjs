import { BackendDashboardRepositoryException } from "@/src/domain/exceptions/backend/backend-dashboard-repository-exception";
import {
  BackendActivityDto,
  DailyViewsDto,
  DashboardStatsDto,
  MonthlyNewVideosDto,
  PopularVideoDto,
  RecentProfileDto,
  SystemHealthDto
} from "../../../application/dtos/backend/backend-dashboard-dto";
import type { IBackendDashboardRepositoryAdapter } from "../../../application/interfaces/backend/backend-dashboard-repository-adapter.interface";
import type { ILogger } from "../../../application/interfaces/logger.interface";
import { BackendDashboardMapper } from "../../../application/mappers/backend/backend-dashboard-mapper";
import type { BackendDashboardRepository } from "../../../domain/repositories/backend/backend-dashboard-repository";

/**
 * Adapter for BackendDashboardRepository
 * Following SOLID principles and Clean Architecture by adapting domain repository to application layer
 */
export class BackendDashboardRepositoryAdapter
  implements IBackendDashboardRepositoryAdapter {
  /**
   * Constructor with dependency injection
   * @param repository Backend dashboard repository
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly repository: BackendDashboardRepository,
    private readonly logger?: ILogger
  ) { }

  /**
   * Get system health status
   * @returns System health data or null if not available
   * @throws BackendDashboardRepositoryException if there's an error in the repository
   */
  async getSystemHealth(): Promise<SystemHealthDto | null> {
    try {
      const systemHealth = await this.repository.getSystemHealth();

      if (!systemHealth) {
        return null;
      }

      return BackendDashboardMapper.toSystemHealthDto(systemHealth);
    } catch (error: unknown) {
      this.logger?.error(
        `Error getting system health data: ${error instanceof Error ? error.message : String(error)
        }`
      );
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BackendDashboardRepositoryException(
        `Failed to get system health data: ${errorMessage}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get recent backend activities
   * @param limit Maximum number of activities to return
   * @returns List of recent activities
   * @throws BackendDashboardRepositoryException if there's an error in the repository
   */
  async getRecentActivities(limit?: number): Promise<BackendActivityDto[]> {
    try {
      const activities = await this.repository.getRecentActivities(limit);
      return BackendDashboardMapper.toBackendActivityDtos(activities);
    } catch (error: unknown) {
      this.logger?.error(
        `Error getting recent activities (limit: ${limit}): ${error instanceof Error ? error.message : String(error)
        }`
      );
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BackendDashboardRepositoryException(
        `Failed to get recent activities: ${errorMessage}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get dashboard statistics
   * @returns Dashboard statistics data
   * @throws BackendDashboardRepositoryException if there's an error in the repository
   */
  async getDashboardStats(): Promise<DashboardStatsDto> {
    try {
      const stats = await this.repository.getDashboardStats();
      return BackendDashboardMapper.toDashboardStatsDto(stats);
    } catch (error: unknown) {
      this.logger?.error(
        `Error getting dashboard statistics: ${error instanceof Error ? error.message : String(error)
        }`
      );
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BackendDashboardRepositoryException(
        `Failed to get dashboard statistics: ${errorMessage}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get popular videos
   * @param limit Maximum number of videos to return (default: 5)
   * @returns List of popular videos
   * @throws BackendDashboardRepositoryException if there's an error in the repository
   */
  async getPopularVideos(limit?: number): Promise<PopularVideoDto[]> {
    try {
      const videos = await this.repository.getPopularVideos(limit);
      return BackendDashboardMapper.toPopularVideoDtos(videos);
    } catch (error: unknown) {
      this.logger?.error(
        `Error getting popular videos (limit: ${limit}): ${error instanceof Error ? error.message : String(error)
        }`
      );
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BackendDashboardRepositoryException(
        `Failed to get popular videos: ${errorMessage}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get recent user profiles
   * @param limit Maximum number of profiles to return (default: 5)
   * @returns List of recent user profiles
   * @throws BackendDashboardRepositoryException if there's an error in the repository
   */
  async getRecentProfiles(limit?: number): Promise<RecentProfileDto[]> {
    try {
      const profiles = await this.repository.getRecentProfiles(limit);
      return BackendDashboardMapper.toRecentProfileDtos(profiles);
    } catch (error: unknown) {
      this.logger?.error(
        `Error getting recent profiles (limit: ${limit}): ${error instanceof Error ? error.message : String(error)
        }`
      );
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BackendDashboardRepositoryException(
        `Failed to get recent profiles: ${errorMessage}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get daily views data for the last n days
   * @param days Number of days to retrieve data for (default: 7)
   * @returns Daily views data
   * @throws BackendDashboardRepositoryException if there's an error in the repository
   */
  async getDailyViews(days?: number): Promise<DailyViewsDto> {
    try {
      const dailyViews = await this.repository.getDailyViews(days);
      return BackendDashboardMapper.toDailyViewsDto(dailyViews);
    } catch (error: unknown) {
      this.logger?.error(
        `Error getting daily views data (days: ${days}): ${error instanceof Error ? error.message : String(error)
        }`
      );
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BackendDashboardRepositoryException(
        `Failed to get daily views data: ${errorMessage}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get monthly new videos data for the last n months
   * @param months Number of months to retrieve data for (default: 6)
   * @returns Monthly new videos data
   * @throws BackendDashboardRepositoryException if there's an error in the repository
   */
  async getMonthlyNewVideos(months?: number): Promise<MonthlyNewVideosDto> {
    try {
      const monthlyNewVideos = await this.repository.getMonthlyNewVideos(months);
      return BackendDashboardMapper.toMonthlyNewVideosDto(monthlyNewVideos);
    } catch (error: unknown) {
      this.logger?.error(
        `Error getting monthly new videos data (months: ${months}): ${error instanceof Error ? error.message : String(error)
        }`
      );
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BackendDashboardRepositoryException(
        `Failed to get monthly new videos data: ${errorMessage}`,
        error instanceof Error ? error : undefined
      );
    }
  }

}
