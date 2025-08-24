import { Logger } from "@/src/domain/interfaces/logger";
import { PaginatedResultDto, PaginationParamsDto } from "../../application/dtos/pagination-dto";
import {
  CreateVideoDto,
  UpdateVideoDto,
  VideoDetailsDto,
  VideoDto,
} from "../../application/dtos/video-dto";
import {
  VideoAlreadyExistsException,
  VideoNotFoundException,
  VideoRepositoryException,
} from "../../application/exceptions/video-exceptions";
import { IVideoRepositoryAdapter } from "../../application/interfaces/video-repository-adapter.interface";
import { VideoMapper } from "../../application/mappers/video-mapper";
import { Video } from "../../domain/entities/video";
import { PaginatedResult, PaginationParams } from "../../domain/interfaces/pagination-types";
import {
  VideoError,
  VideoErrorType,
  VideoRepository,
} from "../../domain/repositories/video-repository";
import {
  DatabaseOperationException,
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from "../exceptions/repository-exceptions";

/**
 * Adapter for VideoRepository that converts between domain entities and DTOs
 * Following Clean Architecture by separating infrastructure and application layers
 * Implements IVideoRepositoryAdapter interface for type safety with application layer
 */
export class VideoRepositoryAdapter implements IVideoRepositoryAdapter {
  /**
   * Constructor with dependency injection
   * @param repository The actual repository implementation
   * @param logger Logger for error tracking
   */
  constructor(
    private readonly repository: VideoRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Get all videos as DTOs
   * @returns Array of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getAll(): Promise<VideoDto[]> {
    try {
      const videos = await this.repository.getAll();
      return videos.map((video) => VideoMapper.toDto(video));
    } catch (error) {
      this.logger.error("Error getting all videos", error);
      this.mapDomainErrorToApplicationError(error as Error);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get a video by ID as DTO
   * @param id Video ID
   * @returns Video DTO or null if not found
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getById(id: string): Promise<VideoDto | null> {
    try {
      const video = await this.repository.getById(id);
      return video ? VideoMapper.toDto(video) : null;
    } catch (error) {
      this.logger.error(`Error getting video by ID: ${id}`, error);
      this.mapDomainErrorToApplicationError(error as Error, id);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Create a new video
   * @param data Video data to create
   * @returns Created video as DTO
   * @throws VideoAlreadyExistsException if a video with the same ID already exists
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async create(data: CreateVideoDto): Promise<VideoDto> {
    try {
      const videoCreate = VideoMapper.createDtoToDomain(data, data.profileId);
      const video = await this.repository.create(videoCreate);
      return VideoMapper.toDto(video);
    } catch (error) {
      this.logger.error("Error creating video", error);
      this.mapDomainErrorToApplicationError(
        error as Error,
        undefined,
        data.title
      );
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Update an existing video
   * @param id Video ID
   * @param data Updated video data
   * @returns Updated video as DTO
   * @throws VideoNotFoundException if the video is not found
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async update(id: string, data: UpdateVideoDto): Promise<VideoDto> {
    try {
      // Convert DTO to domain entity or partial update object
      const videoUpdate = VideoMapper.updateDtoToDomain
        ? VideoMapper.updateDtoToDomain(data)
        : (data as unknown as Partial<Video>);

      const video = await this.repository.update(id, videoUpdate);
      return VideoMapper.toDto(video);
    } catch (error) {
      this.logger.error(`Error updating video: ${id}`, error);
      this.mapDomainErrorToApplicationError(error as Error, id);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Delete a video
   * @param id Video ID
   * @throws VideoNotFoundException if the video is not found
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting video: ${id}`, error);
      this.mapDomainErrorToApplicationError(error as Error, id);
    }
  }

  /**
   * Increment views for a video
   * @param id Video ID
   * @throws VideoNotFoundException if the video is not found
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async incrementViews(id: string): Promise<void> {
    try {
      await this.repository.incrementViews(id);
    } catch (error) {
      this.logger.error(`Error incrementing views for video: ${id}`, error);
      this.mapDomainErrorToApplicationError(error as Error, id);
    }
  }

  /**
   * Search videos by query and optional category
   * @param query Search query
   * @param categoryId Optional category ID to filter by
   * @returns Array of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async search(query: string, categoryId?: string): Promise<VideoDto[]> {
    try {
      const videos = await this.repository.search(query, categoryId);
      return videos.map((video) => VideoMapper.toDto(video));
    } catch (error) {
      this.logger.error(`Error searching videos with query: ${query}`, error);
      this.mapDomainErrorToApplicationError(error as Error);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get videos by user as DTOs
   * @param profileId Profile ID
   * @returns Array of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   * @deprecated Use getPaginatedByUser instead for better performance
   */
  async getByUser(profileId: string): Promise<VideoDto[]> {
    try {
      // Use the paginated method with a high limit to get all videos
      const paginationParams: PaginationParams = {
        page: 1,
        limit: 1000 // High limit to get all videos
      };
      const result = await this.repository.getPaginatedByUser(profileId, paginationParams);
      return result.data.map(video => VideoMapper.toDto(video));
    } catch (error) {
      this.logger.error(`Error getting videos by user: ${profileId}`, error);
      this.mapDomainErrorToApplicationError(error as Error);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get liked videos by user as DTOs
   * @param profileId Profile ID
   * @returns Array of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   * @deprecated Use getPaginatedLikedByUser instead for better performance
   */
  async getLikedByUser(profileId: string): Promise<VideoDto[]> {
    try {
      // Use the paginated method with a high limit to get all videos
      const paginationParams: PaginationParams = {
        page: 1,
        limit: 1000 // High limit to get all videos
      };
      const result = await this.repository.getPaginatedLikedByUser(profileId, paginationParams);
      return result.data.map((video) => VideoMapper.toDto(video));
    } catch (error) {
      this.logger.error(
        `Error getting liked videos by user: ${profileId}`,
        error
      );
      this.mapDomainErrorToApplicationError(error as Error);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get video details
   * @param id Video ID
   * @returns Video details DTO or null if not found
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getVideoDetails(id: string): Promise<VideoDetailsDto | null> {
    try {
      // Check if the repository has the getVideoDetails method
      if ('getVideoDetails' in this.repository && typeof this.repository.getVideoDetails === 'function') {
        const videoDetails = await this.repository.getVideoDetails(id);
        return videoDetails ? VideoMapper.detailsToDto(videoDetails) : null;
      }

      this.logger.warn(`Repository does not support getVideoDetails method for video: ${id}`);
      return null;
    } catch (error) {
      this.logger.error(`Error getting video details for video: ${id}`, error);
      this.mapDomainErrorToApplicationError(error as Error, id);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get related videos
   * @param id Video ID
   * @param limit Optional limit of results
   * @returns Array of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getRelatedVideos(id: string, limit?: number): Promise<VideoDto[]> {
    try {
      // Check if the repository has the getRelatedVideos method
      if ('getRelatedVideos' in this.repository && typeof this.repository.getRelatedVideos === 'function') {
        const videos = await this.repository.getRelatedVideos(id, limit);
        return videos.map((video: Video) => VideoMapper.toDto(video));
      }

      this.logger.warn(`Repository does not support getRelatedVideos method for video: ${id}`);
      return [];
    } catch (error) {
      this.logger.error(`Error getting related videos for video: ${id}`, error);
      this.mapDomainErrorToApplicationError(error as Error, id);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get paginated most viewed videos as DTOs with database-level pagination
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getPaginatedMostViewed(pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    try {
      // Convert application DTO to domain entity
      const params: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit
      };

      // Call repository method
      const result = await this.repository.getPaginatedMostViewed(params);
      return this.mapPaginatedResultToDto(result);
    } catch (error) {
      this.logger.error('Error getting paginated most viewed videos', error);
      this.mapDomainErrorToApplicationError(error as Error);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get paginated most recent videos as DTOs with database-level pagination
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getPaginatedMostRecent(pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    try {
      // Convert application DTO to domain entity
      const params: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit
      };

      // Call repository method
      const result = await this.repository.getPaginatedMostRecent(params);
      return this.mapPaginatedResultToDto(result);
    } catch (error) {
      this.logger.error('Error getting paginated most recent videos', error);
      this.mapDomainErrorToApplicationError(error as Error);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get paginated videos by user as DTOs with database-level pagination
   * @param profileId Profile ID
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getPaginatedByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    try {
      // Convert application DTO to domain entity
      const params: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit
      };

      // Call repository method
      const result = await this.repository.getPaginatedByUser(profileId, params);
      return this.mapPaginatedResultToDto(result);
    } catch (error) {
      this.logger.error(`Error getting paginated videos by user: ${profileId}`, error);
      this.mapDomainErrorToApplicationError(error as Error);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get paginated liked videos by user as DTOs with database-level pagination
   * @param profileId Profile ID
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getPaginatedLikedByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    try {
      // Convert application DTO to domain entity
      const params: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit
      };

      // Call repository method
      const result = await this.repository.getPaginatedLikedByUser(profileId, params);
      return this.mapPaginatedResultToDto(result);
    } catch (error) {
      this.logger.error(`Error getting paginated liked videos for user: ${profileId}`, error);
      this.mapDomainErrorToApplicationError(error as Error, profileId);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Get paginated videos by category as DTOs with database-level pagination
   * @param categoryId Category ID
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   * @throws VideoRepositoryException if there's an error in the repository
   */
  async getPaginatedVideosByCategory(categoryId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    try {
      // Convert application DTO to domain entity
      const params: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit
      };

      // Call repository method
      const result = await this.repository.getPaginatedVideosByCategory(categoryId, params);
      return this.mapPaginatedResultToDto(result);
    } catch (error) {
      this.logger.error(`Error getting paginated videos for category: ${categoryId}`, error);
      this.mapDomainErrorToApplicationError(error as Error, categoryId);
      throw error; // This line will never be reached due to mapDomainErrorToApplicationError always throwing
    }
  }

  /**
   * Maps a domain paginated result to an application DTO
   * @param result Domain paginated result
   * @returns Application paginated result DTO
   */
  private mapPaginatedResultToDto<T extends Video>(result: PaginatedResult<T>): PaginatedResultDto<VideoDto> {
    return {
      data: result.data.map(item => VideoMapper.toDto(item)),
      pagination: {
        currentPage: result.pagination.currentPage,
        totalPages: result.pagination.totalPages,
        totalItems: result.pagination.totalItems,
        itemsPerPage: result.pagination.itemsPerPage,
        hasNextPage: result.pagination.hasNextPage,
        hasPrevPage: result.pagination.hasPrevPage
      }
    };
  }

  /**
 * Maps domain errors to application exceptions
 * @param error The error to map
 * @param id Optional video ID for context
 * @param title Optional video title for context
 * @throws Appropriate application exception based on the domain error
 */
  private mapDomainErrorToApplicationError(
    error: Error,
    id?: string,
    title?: string
  ): never {
    if (error instanceof VideoError) {
      switch (error.type) {
        case VideoErrorType.NOT_FOUND:
          throw new VideoNotFoundException(id || "Unknown");
        case VideoErrorType.ALREADY_EXISTS:
          throw new VideoAlreadyExistsException(title || "Unknown");
        case VideoErrorType.VALIDATION_ERROR:
        case VideoErrorType.OPERATION_FAILED:
        case VideoErrorType.CONSTRAINT_VIOLATION:
        case VideoErrorType.UNAUTHORIZED:
        case VideoErrorType.UNKNOWN:
        default:
          throw new VideoRepositoryException(
            error.message || `Video repository error: ${error.type}`,
            error
          );
      }
    }

    // Handle other types of errors
    if (error instanceof EntityNotFoundException) {
      throw new VideoNotFoundException(id || "Unknown");
    }
    if (error instanceof EntityAlreadyExistsException) {
      throw new VideoAlreadyExistsException(title || "Unknown");
    }
    if (error instanceof DatabaseOperationException) {
      throw new VideoRepositoryException(error.message, error);
    }

    // Default case for unknown errors
    throw new VideoRepositoryException(
      error.message || "Unknown video repository error",
      error
    );
  }
}
