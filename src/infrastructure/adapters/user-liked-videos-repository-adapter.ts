import { Logger } from "@/src/domain/interfaces/logger";
import { PaginatedResultDto, PaginationParamsDto } from "../../application/dtos/pagination-dto";
import { VideoDto } from "../../application/dtos/video-dto";
import { IUserLikedVideosRepositoryAdapter } from "../../application/interfaces/user-liked-videos-repository-adapter.interface";
import { VideoMapper } from "../../application/mappers/video-mapper";
import { VideoRepository } from "../../domain/repositories/video-repository";

/**
 * Base exception for user liked videos repository errors
 * Following Clean Architecture by defining application-specific exceptions
 */
export class UserLikedVideosRepositoryException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'UserLikedVideosRepositoryException';

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserLikedVideosRepositoryException);
    }
  }
}

/**
 * Adapter for User Liked Videos Repository
 * Following Clean Architecture by separating infrastructure and application layers
 * Following Interface Segregation Principle with focused interfaces
 * Implements IUserLikedVideosRepositoryAdapter interface for type safety with application layer
 */
export class UserLikedVideosRepositoryAdapter implements IUserLikedVideosRepositoryAdapter {
  /**
   * Constructor with dependency injection
   * @param videoRepository The video repository for liked videos
   * @param logger Logger for error tracking
   */
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Get videos liked by the specified user
   * @param profileId The profile ID to get liked videos for
   * @returns Array of liked videos
   * @throws Error if there's an error in the repository
   */
  async getLikedVideosByUser(profileId: string): Promise<VideoDto[]> {
    try {
      // Use the paginated method with a high limit to get all videos
      const result = await this.videoRepository.getPaginatedLikedByUser(profileId, { page: 1, limit: 1000 });
      return result.data.map((video) => VideoMapper.toDto(video));
    } catch (error: unknown) {
      this.logger.error(`Error getting liked videos for profile ${profileId}`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new UserLikedVideosRepositoryException(`Failed to get liked videos: ${errorMessage}`, error);
    }
  }

  /**
   * Get paginated videos liked by the specified user
   * @param profileId The profile ID to get liked videos for
   * @param params Pagination parameters
   * @returns Paginated result of liked videos
   * @throws Error if there's an error in the repository
   */
  async getPaginatedLikedVideosByUser(profileId: string, params: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    try {
      const result = await this.videoRepository.getPaginatedLikedByUser(profileId, {
        page: params.page,
        limit: params.limit
      });

      return {
        data: result.data.map((video) => VideoMapper.toDto(video)),
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          totalItems: result.pagination.totalItems,
          itemsPerPage: result.pagination.itemsPerPage,
          hasNextPage: result.pagination.hasNextPage,
          hasPrevPage: result.pagination.hasPrevPage
        }
      };
    } catch (error: unknown) {
      this.logger.error(`Error getting paginated liked videos for profile ${profileId}`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new UserLikedVideosRepositoryException(`Failed to get paginated liked videos: ${errorMessage}`, error);
    }
  }
}
