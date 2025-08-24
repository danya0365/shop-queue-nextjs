import { Logger } from "@/src/domain/interfaces/logger";
import { Video, VideoCreate } from "../../domain/entities/video";
import { VideoWithDetails } from "../../domain/entities/video-with-relations";
import type { IEventDispatcher } from "../../domain/events/event-dispatcher";
import type { DatabaseDataSource } from "../../domain/interfaces/datasources/database-datasource";
import {
  DatabaseError,
  DatabaseErrorType,
  QueryOptions,
  SortDirection,
} from "../../domain/interfaces/datasources/database-datasource";
import {
  PaginatedResult,
  PaginationParams,
} from "../../domain/interfaces/pagination-types";
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
import { SupabaseVideoMapper } from "../mappers/supabase-video-mapper";
import {
  DashboardData,
  DashboardDataDbSchema,
  VideoDbSchema,
  VideoDetailsDbSchema,
} from "../schemas/video-schema";
import { StandardRepository } from "./base/standard-repository";

// Re-export DashboardData for backward compatibility
export type { DashboardData } from "../schemas/video-schema";

/**
 * Supabase implementation of VideoRepository
 * Following SOLID principles and Clean Architecture
 */
export class SupabaseVideoRepository
  extends StandardRepository
  implements VideoRepository {
  private readonly tableName = "videos";
  private readonly eventDispatcher?: IEventDispatcher;

  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations
   * @param logger Abstraction for logging
   * @param eventDispatcher Optional event dispatcher for domain events
   */
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger,
    eventDispatcher?: IEventDispatcher
  ) {
    super(dataSource, logger, "Video", false);
    this.eventDispatcher = eventDispatcher;
  }

  /**
   * Get all videos
   * @returns Array of video domain entities
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getAll(): Promise<Video[]> {
    try {
      const result = await this.dataSource.get<VideoDbSchema>(this.tableName);
      return SupabaseVideoMapper.toDomainList(result);
    } catch (error) {
      return this.handleError(error, "getAll", "all videos");
    }
  }

  /**
   * Get a video by ID
   * @param id Video ID
   * @returns Video domain entity or null if not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getById(id: string): Promise<Video | null> {
    try {
      const result = await this.dataSource.getById<VideoDbSchema>(
        this.tableName,
        id
      );
      if (!result) return null;
      return SupabaseVideoMapper.toDomain(result);
    } catch (error) {
      return this.handleError(error, "getById", `video id: ${id}`);
    }
  }

  /**
   * Get video details using the Supabase get_video_details function
   * This uses the RPC function defined in the migrations
   * @param id Video ID
   * @returns Video with details domain entity or null if not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getVideoDetails(id: string): Promise<VideoWithDetails | null> {
    try {
      // First check if the video exists
      const videoExists = await this.getById(id);
      if (!videoExists) {
        return null;
      }

      // Use the abstracted callRpc method to call the RPC function
      const data = await this.dataSource.callRpc<VideoDetailsDbSchema[]>(
        "get_video_details",
        { video_id: id }
      );

      if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
      }

      // Map the response to our domain entity using the mapper
      return SupabaseVideoMapper.toDetailsDomain(data[0]);
    } catch (error) {
      // Re-throw if it's already one of our custom exceptions
      if (error instanceof DatabaseOperationException) {
        throw error;
      }

      this.logger.error(`Failed to get video details for ${id}:`, error);
      throw new DatabaseOperationException(
        "get video details",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get paginated videos by category
   * @param categoryId Category ID
   * @param params Pagination parameters
   * @returns Paginated result of video domain entities
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getPaginatedVideosByCategory(
    categoryId: string,
    params: PaginationParams
  ): Promise<PaginatedResult<Video>> {
    try {
      // Calculate offset from page and limit
      const offset = (params.page - 1) * params.limit;

      // Use RPC function to get paginated videos by category
      const result = await this.dataSource.callRpc<{
        videos: VideoDbSchema[];
        total_count: number;
      }>("get_videos_by_category", {
        p_category_id: categoryId,
        p_limit: params.limit,
        p_offset: offset,
      });

      if (!result || !result.videos || !Array.isArray(result.videos)) {
        return {
          data: [],
          pagination: {
            currentPage: params.page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: params.limit,
            hasNextPage: false,
            hasPrevPage: params.page > 1,
          },
        };
      }

      // Map the videos to domain entities
      const videos = SupabaseVideoMapper.toDomainList(result.videos);

      // Calculate pagination metadata
      const totalItems = result.total_count;
      const totalPages = Math.ceil(totalItems / params.limit) || 1;

      return {
        data: videos,
        pagination: {
          currentPage: params.page,
          totalPages,
          totalItems,
          itemsPerPage: params.limit,
          hasNextPage: params.page < totalPages,
          hasPrevPage: params.page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get paginated videos for category: ${categoryId}`,
        error
      );
      throw new DatabaseOperationException(
        `get paginated videos for category: ${categoryId}`,
        this.entityName,
        error
      );
    }
  }

  /**
   * Get paginated most viewed videos with database-level pagination
   * @param params Pagination parameters
   * @returns Paginated result of video domain entities
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getPaginatedMostViewed(
    params: PaginationParams
  ): Promise<PaginatedResult<Video>> {
    try {
      // ใช้ getAdvanced แทนการเรียก RPC function
      const queryOptions: QueryOptions = {
        // เลือกคอลัมน์ที่ต้องการ
        select: ["*"],
        // เพิ่ม join กับตาราง profiles และ categories
        joins: [
          { table: "profiles", on: { fromField: "profile_id", toField: "id" } },
          {
            table: "categories",
            on: { fromField: "category_id", toField: "id" },
          },
        ],
        // เรียงลำดับตาม views_count มากไปน้อย
        sort: [{ field: "views_count", direction: SortDirection.DESC }],
        // กำหนด pagination
        pagination: {
          limit: params.limit,
          offset: (params.page - 1) * params.limit,
        },
      };

      // ดึงข้อมูลวิดีโอโดยใช้ getAdvanced
      const videosData = await this.dataSource.getAdvanced<VideoDbSchema>(
        this.tableName,
        queryOptions
      );

      // นับจำนวนทั้งหมดโดยใช้ count method
      const totalItems = await this.dataSource.count(this.tableName);

      if (!videosData || !Array.isArray(videosData)) {
        return {
          data: [],
          pagination: {
            currentPage: params.page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: params.limit,
            hasNextPage: false,
            hasPrevPage: params.page > 1,
          },
        };
      }

      // Map the videos to domain entities
      const videos = videosData.map((video) =>
        SupabaseVideoMapper.toDomain(video)
      );

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalItems / params.limit) || 1;

      return {
        data: videos,
        pagination: {
          currentPage: params.page,
          totalPages,
          totalItems,
          itemsPerPage: params.limit,
          hasNextPage: params.page < totalPages,
          hasPrevPage: params.page > 1,
        },
      };
    } catch (error) {
      this.logger.error("Failed to get paginated most viewed videos", error);
      throw new DatabaseOperationException(
        "get paginated most viewed videos",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get paginated most recent videos with database-level pagination
   * @param params Pagination parameters
   * @returns Paginated result of video domain entities
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getPaginatedMostRecent(
    params: PaginationParams
  ): Promise<PaginatedResult<Video>> {
    try {
      // Calculate offset from page and limit
      const offset = (params.page - 1) * params.limit;

      // Get paginated videos using RPC function
      const result = await this.dataSource.callRpc<{
        videos: VideoDetailsDbSchema[];
        total_count: number;
      }>("get_recent_videos", {
        p_limit: params.limit,
        p_offset: offset,
      });

      if (!result || !result.videos || !Array.isArray(result.videos)) {
        return {
          data: [],
          pagination: {
            currentPage: params.page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: params.limit,
            hasNextPage: false,
            hasPrevPage: params.page > 1,
          },
        };
      }

      // Map the videos to domain entities
      const videos = SupabaseVideoMapper.toDetailsDomainList(result.videos);

      // Calculate pagination metadata
      const totalItems = result.total_count;
      const totalPages = Math.ceil(totalItems / params.limit) || 1;

      return {
        data: videos,
        pagination: {
          currentPage: params.page,
          totalPages,
          totalItems,
          itemsPerPage: params.limit,
          hasNextPage: params.page < totalPages,
          hasPrevPage: params.page > 1,
        },
      };
    } catch (error) {
      this.logger.error("Failed to get paginated most recent videos", error);
      throw new DatabaseOperationException(
        "get paginated most recent",
        this.entityName,
        error
      );
    }
  }

  /**
   * Create a new video
   * @param video Video data to create
   * @returns Created video domain entity
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async create(video: VideoCreate): Promise<Video> {
    try {
      const videoData = SupabaseVideoMapper.toDatabase(video);

      const result = await this.dataSource.insert<VideoDbSchema>(
        this.tableName,
        videoData
      );
      if (!result) {
        throw new DatabaseOperationException("create", this.entityName);
      }

      return SupabaseVideoMapper.toDomain(result);
    } catch (error) {
      return this.handleError(error, "create", `video: ${video.title}`);
    }
  }

  /**
   * Update an existing video
   * @param id Video ID
   * @param video Updated video data
   * @returns Updated video domain entity
   * @throws EntityNotFoundException if the video is not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async update(id: string, video: Partial<VideoCreate>): Promise<Video> {
    try {
      // Check if video exists
      const existingVideo = await this.getById(id);
      if (!existingVideo) {
        throw new EntityNotFoundException(this.entityName, id);
      }

      // Prepare update data
      const updateData: Partial<VideoDbSchema> = {};
      if (video.title !== undefined) updateData.title = video.title;
      if (video.description !== undefined)
        updateData.description = video.description;
      if (video.youtubeId !== undefined)
        updateData.youtube_id = video.youtubeId;
      if (video.categoryId !== undefined)
        updateData.category_id = video.categoryId;
      if (video.durationSeconds !== undefined)
        updateData.duration_seconds = video.durationSeconds;

      const result = await this.dataSource.update<VideoDbSchema>(
        this.tableName,
        id,
        updateData
      );
      if (!result) {
        throw new EntityNotFoundException(this.entityName, id);
      }

      return SupabaseVideoMapper.toDomain(result);
    } catch (error) {
      // Re-throw if it's already one of our custom exceptions
      if (
        error instanceof EntityNotFoundException ||
        error instanceof DatabaseOperationException
      ) {
        throw error;
      }

      this.logger.error(`Failed to update video with id: ${id}`, error);
      throw new DatabaseOperationException("update", this.entityName, error);
    }
  }

  /**
   * Delete a video
   * @param id Video ID
   * @throws VideoError if the video is not found or if the operation fails
   */
  async delete(id: string): Promise<void> {
    try {
      // Check if video exists
      const existingVideo = await this.getById(id);
      if (!existingVideo) {
        throw new EntityNotFoundException(this.entityName, id);
      }

      await this.dataSource.delete(this.tableName, id);
      return;
    } catch (error) {
      return this.handleError(error, "delete", `video id: ${id}`);
    }
  }

  /**
   * Increment views for a video
   * @param id Video ID
   * @throws VideoError if the video is not found or if the operation fails
   */
  async incrementViews(id: string): Promise<void> {
    try {
      // Check if video exists
      const video = await this.getById(id);
      if (!video) {
        throw new EntityNotFoundException(this.entityName, id);
      }

      // Use the abstracted callRpc method to call the RPC function
      await this.dataSource.callRpc<void>("increment_video_view", {
        param_video_id: id,
      });

      return;
    } catch (error) {
      this.logger.error(`Failed to increment views for video: ${id}`, error);
      this.handleError(error);
    }
  }

  /**
   * Search videos by query and optional category
   * @param query Search query
   * @param categoryId Optional category ID to filter by
   * @param limit Optional limit of results
   * @returns Array of video domain entities
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async search(
    query: string,
    categoryId?: string,
    limit: number = 20
  ): Promise<Video[]> {
    try {
      // First try to use the extended search function with more features
      try {
        const result = await this.dataSource.callRpc<VideoDetailsDbSchema[]>(
          "search_videos_extended",
          {
            search_query: query,
            limit_count: limit,
            filter_category_slug: categoryId || null,
          }
        );

        // Check if data is null or not an array
        if (!result || !Array.isArray(result)) {
          return [];
        }

        return SupabaseVideoMapper.toDetailsDomainList(result);
      } catch (extendedSearchError) {
        // Log the error but don't throw yet - we'll try the fallback
        this.logger.warn(
          `Failed to use search_videos_extended, falling back to search_videos: ${extendedSearchError instanceof Error
            ? extendedSearchError.message
            : "Unknown error"
          }`
        );

        // Fallback to the original search_videos function if extended version fails
        // This follows the Open/Closed principle by gracefully degrading functionality
        const fallbackResult = await this.dataSource.callRpc<VideoDbSchema[]>(
          "search_videos",
          {
            search_query: query,
            limit_count: limit,
          }
        );

        if (!fallbackResult || !Array.isArray(fallbackResult)) {
          return [];
        }

        // The fallback doesn't include category filtering, so we need to do it manually if needed
        let filteredResults = fallbackResult;
        if (categoryId) {
          // Get the category by slug to find its ID
          const categoryResult = await this.dataSource.get("categories", {
            slug: categoryId,
          });
          if (categoryResult && categoryResult.length > 0) {
            const categoryIdValue = categoryResult[0].id;
            filteredResults = fallbackResult.filter(
              (video) => video.category_id === categoryIdValue
            );
          }
        }

        return SupabaseVideoMapper.toDomainList(filteredResults);
      }
    } catch (error) {
      this.logger.error(
        `Failed to search videos with query: "${query}"`,
        error
      );
      throw new DatabaseOperationException("search", this.entityName, error);
    }
  }

  /**
   * Get paginated videos by user (profile) with database-level pagination
   * @param profileId Profile ID
   * @param params Pagination parameters
   * @returns Paginated result of video domain entities
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getPaginatedByUser(
    profileId: string,
    params: PaginationParams
  ): Promise<PaginatedResult<Video>> {
    try {
      // Calculate offset from page and limit
      const offset = (params.page - 1) * params.limit;

      // Get paginated videos using RPC function
      const result = await this.dataSource.callRpc<{
        videos: VideoDetailsDbSchema[];
        total_count: number;
      }>("get_videos_by_profile", {
        p_profile_id: profileId,
        p_limit: params.limit,
        p_offset: offset,
      });

      if (!result || !result.videos || !Array.isArray(result.videos)) {
        return {
          data: [],
          pagination: {
            currentPage: params.page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: params.limit,
            hasNextPage: false,
            hasPrevPage: params.page > 1,
          },
        };
      }

      // Map the videos to domain entities
      const videos = SupabaseVideoMapper.toDetailsDomainList(result.videos);

      // Calculate pagination metadata
      const totalItems = result.total_count;
      const totalPages = Math.ceil(totalItems / params.limit) || 1;

      return {
        data: videos,
        pagination: {
          currentPage: params.page,
          totalPages,
          totalItems,
          itemsPerPage: params.limit,
          hasNextPage: params.page < totalPages,
          hasPrevPage: params.page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get paginated videos by profile: ${profileId}`,
        error
      );
      throw new DatabaseOperationException(
        "get paginated by user",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get paginated liked videos by user with database-level pagination
   * @param profileId Profile ID
   * @param params Pagination parameters
   * @returns Paginated result of video domain entities
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getPaginatedLikedByUser(
    profileId: string,
    params: PaginationParams
  ): Promise<PaginatedResult<Video>> {
    this.logger.info(`Getting paginated liked videos by profile: ${profileId}`);
    try {
      // Calculate offset from page and limit
      const offset = (params.page - 1) * params.limit;

      // Get paginated liked videos using RPC function
      const result = await this.dataSource.callRpc<{
        videos: VideoDetailsDbSchema[];
        total_count: number;
      }>("get_videos_liked_by_profile", {
        liked_by_profile_id: profileId,
        p_limit: params.limit,
        p_offset: offset,
      });

      if (!result || !result.videos || !Array.isArray(result.videos)) {
        return {
          data: [],
          pagination: {
            currentPage: params.page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: params.limit,
            hasNextPage: false,
            hasPrevPage: params.page > 1,
          },
        };
      }

      // Map the videos to domain entities
      const videos = SupabaseVideoMapper.toDetailsDomainList(result.videos);

      // Calculate pagination metadata
      const totalItems = result.total_count;
      const totalPages = Math.ceil(totalItems / params.limit) || 1;

      return {
        data: videos,
        pagination: {
          currentPage: params.page,
          totalPages,
          totalItems,
          itemsPerPage: params.limit,
          hasNextPage: params.page < totalPages,
          hasPrevPage: params.page > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get paginated liked videos by profile: ${profileId}`,
        error
      );
      throw new DatabaseOperationException(
        "get paginated liked by user",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get user dashboard data using the Supabase get_user_dashboard function
   * This uses the RPC function defined in the migrations which gets data for the active profile
   * @returns Dashboard data or null if not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getUserDashboard(): Promise<DashboardData | null> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const data = await this.dataSource.callRpc<DashboardDataDbSchema[]>(
        "get_user_dashboard"
      );

      if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
      }

      // Map the response to our domain entity using the mapper
      return SupabaseVideoMapper.toDashboardDomain(data[0]);
    } catch (error) {
      // Re-throw if it's already one of our custom exceptions
      if (error instanceof DatabaseOperationException) {
        throw error;
      }

      this.logger.error("Failed to get user dashboard data", error);
      throw new DatabaseOperationException(
        "get user dashboard",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get related videos using the Supabase get_related_videos function
   * This uses the RPC function defined in the migrations
   * @param videoId Video ID to find related videos for
   * @param limit Optional limit of results
   * @returns Array of video domain entities
   * @throws EntityNotFoundException if the video is not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getRelatedVideos(
    videoId: string,
    limit: number = 10
  ): Promise<Video[]> {
    try {
      // Check if video exists
      const videoExists = await this.getById(videoId);
      if (!videoExists) {
        throw new EntityNotFoundException(this.entityName, videoId);
      }

      // Use the abstracted callRpc method to call the RPC function
      const data = await this.dataSource.callRpc<VideoDbSchema[]>(
        "get_related_videos",
        {
          video_id: videoId,
          limit_count: limit,
        }
      );

      if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
      }

      // Map the response to our domain entities using the mapper
      return SupabaseVideoMapper.toDomainList(data);
    } catch (error) {
      // Re-throw if it's already one of our custom exceptions
      if (
        error instanceof EntityNotFoundException ||
        error instanceof DatabaseOperationException
      ) {
        throw error;
      }

      this.logger.error(`Failed to get related videos for: ${videoId}`, error);
      throw new DatabaseOperationException(
        "get related videos",
        this.entityName,
        error
      );
    }
  }

  /**
   * Handles repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation description
   * @param context Optional context information
   * @throws VideoError with appropriate error type
   */
  public handleError(
    error: unknown,
    operation?: string,
    context?: string
  ): never {
    // Create a proper context object for VideoError
    const errorContext: Record<string, unknown> = {
      operation: operation || "unknown operation",
      entityName: this.entityName,
      contextInfo: context || undefined,
    };

    this.logger.error(
      `Error in ${this.entityName} repository: ${errorContext.operation as string
      }`,
      error,
      errorContext
    );

    // Convert database errors to domain errors
    if (error instanceof DatabaseError) {
      switch (error.type) {
        case DatabaseErrorType.NOT_FOUND:
          throw new VideoError(
            VideoErrorType.NOT_FOUND,
            `${operation || "Operation"} failed: ${error.message}`,
            errorContext,
            error
          );
        case DatabaseErrorType.DUPLICATE_ENTRY:
          throw new VideoError(
            VideoErrorType.ALREADY_EXISTS,
            `${operation || "Operation"} failed: ${error.message}`,
            errorContext,
            error
          );
        case DatabaseErrorType.VALIDATION_ERROR:
          throw new VideoError(
            VideoErrorType.VALIDATION_ERROR,
            `${operation || "Operation"} failed: ${error.message}`,
            errorContext,
            error
          );
        case DatabaseErrorType.CONSTRAINT_VIOLATION:
          throw new VideoError(
            VideoErrorType.CONSTRAINT_VIOLATION,
            `${operation || "Operation"} failed: ${error.message}`,
            errorContext,
            error
          );
        case DatabaseErrorType.PERMISSION_DENIED:
          throw new VideoError(
            VideoErrorType.UNAUTHORIZED,
            `${operation || "Operation"} failed: ${error.message}`,
            errorContext,
            error
          );
        default:
          throw new VideoError(
            VideoErrorType.OPERATION_FAILED,
            `${operation || "Operation"} failed: ${error.message}`,
            errorContext,
            error
          );
      }
    }

    // Handle repository exceptions
    if (error instanceof EntityNotFoundException) {
      throw new VideoError(
        VideoErrorType.NOT_FOUND,
        `${operation || "Operation"} failed: ${error.message}`,
        errorContext,
        error
      );
    }

    if (error instanceof EntityAlreadyExistsException) {
      throw new VideoError(
        VideoErrorType.ALREADY_EXISTS,
        `${operation || "Operation"} failed: ${error.message}`,
        errorContext,
        error
      );
    }

    if (error instanceof DatabaseOperationException) {
      throw new VideoError(
        VideoErrorType.OPERATION_FAILED,
        `${operation || "Operation"} failed: ${error.message}`,
        errorContext,
        error
      );
    }

    // Handle other types of errors
    const message =
      error instanceof Error
        ? `${operation || "Operation"} failed: ${error.message}`
        : `${operation || "Unknown operation"} failed in ${context || this.entityName
        } repository`;

    throw new VideoError(VideoErrorType.UNKNOWN, message, errorContext, error);
  }
}
