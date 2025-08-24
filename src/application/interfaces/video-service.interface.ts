import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';
import { CreateVideoDto, VideoDetailsDto, VideoDto, VideoWithCategoryDto } from '../dtos/video-dto';

/**
 * Interface for video service
 * Following Interface Segregation Principle by defining a clear contract
 */
export interface IVideoService {
  /**
   * Get all videos
   * @returns Array of video DTOs
   */
  getAllVideos(): Promise<VideoDto[]>;

  /**
   * Get a video by ID
   * @param id Video ID
   * @returns Video DTO or null if not found
   */
  getVideoById(id: string): Promise<VideoDto | null>;

  /**
   * Create a new video
   * @param videoData Data for the new video
   * @returns Created video as DTO
   */
  createVideo(videoData: CreateVideoDto): Promise<VideoDto>;

  /**
   * Increment video views
   * @param id Video ID
   * @returns True if successful
   */
  incrementVideoViews(id: string): Promise<boolean>;

  /**
   * Get videos by category
   * @param categoryId Category ID
   * @returns Array of video DTOs
   */
  getVideosByCategory(categoryId: string): Promise<VideoDto[]>;

  /**
   * Search videos
   * @param query Search query
   * @param categoryId Optional category ID to filter by
   * @returns Array of video DTOs
   */
  searchVideos(query: string, categoryId?: string): Promise<VideoDto[]>;

  /**
   * Get videos by user
   * @param profileId Profile ID
   * @returns Array of video DTOs
   */
  getVideosByUser(profileId: string): Promise<VideoDto[]>;

  /**
   * Get video with category by ID
   * @param id Video ID
   * @returns Video with category DTO or null if not found
   */
  getVideoWithCategoryById(id: string): Promise<VideoWithCategoryDto | null>;

  /**
   * Get video details including category, profile, and like status
   * @param id Video ID
   * @returns Video details DTO or null if not found
   */
  getVideoDetails(id: string): Promise<VideoDetailsDto | null>;
}

/**
 * Interface for video discovery service
 * Follows Single Responsibility Principle by focusing only on video discovery
 */
export interface IVideoDiscoveryService {
  /**
   * Get recent videos
   * @param limit Optional limit of videos to return
   * @returns Array of video DTOs
   */
  getRecentVideos(limit?: number): Promise<VideoDto[]>;

  /**
   * Get paginated recent videos
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   */
  getPaginatedRecentVideos(pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;

  /**
   * Get popular videos
   * @param limit Optional limit of videos to return
   * @returns Array of video DTOs
   */
  getPopularVideos(limit?: number): Promise<VideoDto[]>;

  /**
   * Get paginated popular videos
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   */
  getPaginatedPopularVideos(pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;

  /**
   * Get most liked videos
   * @param limit Optional limit of videos to return
   * @returns Array of video DTOs
   */
  getMostLikedVideos(limit?: number): Promise<VideoDto[]>;

  /**
   * Get related videos
   * @param videoId Video ID
   * @param limit Optional limit of videos to return
   * @returns Array of video DTOs
   */
  getRelatedVideos(videoId: string, limit?: number): Promise<VideoDto[]>;
}

/**
 * Interface for UserVideoService
 * Following Interface Segregation Principle by separating user-video interaction operations
 */
export interface IUserVideoService {
  /**
   * Get paginated liked videos by user
   * @param profileId Profile ID
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   */
  getPaginatedLikedVideosByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
}
