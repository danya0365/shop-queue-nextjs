import { Logger } from "@/src/domain/interfaces/logger";
import { DashboardDataDto } from "../../application/dtos/dashboard-dto";
import { PaginatedResultDto, PaginationParamsDto } from "../../application/dtos/pagination-dto";
import { VideoDto } from "../../application/dtos/video-dto";
import { IDashboardRepositoryAdapter } from "../../application/interfaces/dashboard-repository-adapter.interface";
import { DashboardMapper } from "../../application/mappers/dashboard-mapper";
import { VideoMapper } from "../../application/mappers/video-mapper";
import { DashboardRepository } from "../../domain/repositories/dashboard-repository";
import { VideoRepository } from "../../domain/repositories/video-repository";

/**
 * Base exception for dashboard repository errors
 * Following Clean Architecture by defining application-specific exceptions
 */
export class DashboardRepositoryException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DashboardRepositoryException';

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DashboardRepositoryException);
    }
  }
}

/**
 * Adapter for DashboardRepository
 * Following Clean Architecture by separating infrastructure and application layers
 * Implements IDashboardRepositoryAdapter interface for type safety with application layer
 */
export class DashboardRepositoryAdapter implements IDashboardRepositoryAdapter {
  /**
   * Constructor with dependency injection
   * @param repository The actual repository implementation
   * @param videoRepository The video repository for liked videos
   * @param logger Logger for error tracking
   */
  constructor(
    private readonly repository: DashboardRepository,
    private readonly videoRepository: VideoRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Get user dashboard data
   * @returns Dashboard data or null if not found
   * @throws Error if there's an error in the repository
   */
  async getUserDashboard(): Promise<DashboardDataDto | null> {
    try {
      const dashboardData = await this.repository.getUserDashboard();
      return dashboardData ? DashboardMapper.toDto(dashboardData) : null;
    } catch (error: unknown) {
      this.logger.error('Error getting user dashboard data', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new DashboardRepositoryException(`Failed to get dashboard data: ${errorMessage}`, error);
    }
  }

  /**
   * Get videos liked by the specified user
   * @param profileId The profile ID to get liked videos for
   * @returns Array of liked videos
   * @throws Error if there's an error in the repository
   */
  /**
   * Get videos liked by the specified user
   * @deprecated Use getPaginatedLikedVideosByUser instead
   */
  async getLikedVideosByUser(profileId: string): Promise<VideoDto[]> {
    try {
      // Use paginated method with a high limit to maintain backward compatibility
      const paginationParams: PaginationParamsDto = { page: 1, limit: 1000 };
      const result = await this.getPaginatedLikedVideosByUser(profileId, paginationParams);
      return result.data;
    } catch (error: unknown) {
      this.logger.error(`Error getting liked videos for profile ${profileId}`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new DashboardRepositoryException(`Failed to get liked videos: ${errorMessage}`, error);
    }
  }

  /**
   * Get paginated videos liked by the specified user
   * @param profileId The profile ID to get liked videos for
   * @param pagination Pagination parameters
   * @returns Paginated result with videos
   */
  async getPaginatedLikedVideosByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    try {
      const result = await this.videoRepository.getPaginatedLikedByUser(profileId, pagination);
      return {
        data: result.data.map(video => VideoMapper.toDto(video)),
        pagination: result.pagination
      };
    } catch (error: unknown) {
      this.logger.error(`Error getting paginated liked videos for profile ${profileId}`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new DashboardRepositoryException(`Failed to get paginated liked videos: ${errorMessage}`, error);
    }
  }
}
