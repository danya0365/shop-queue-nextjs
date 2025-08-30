import { Logger } from '@/src/domain/interfaces/logger';
import { ErrorHandlingDecorator } from '../decorators/error-handling.decorator';
import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';
import { CreateVideoDto, VideoDetailsDto, VideoDto, VideoWithCategoryDto } from '../dtos/video-dto';
import { VideoUseCaseFactory } from '../factories/video-use-case.factory';
import type { ICategoryRepositoryAdapter } from '../interfaces/category-repository-adapter.interface';
import type { IPaginatedVideoService } from '../interfaces/paginated-video-service.interface';
import type { IProfileRepositoryAdapter } from '../interfaces/profile-repository-adapter.interface';
import type { IUseCase } from '../interfaces/use-case.interface';
import type { IVideoRepositoryAdapter } from '../interfaces/video-repository-adapter.interface';
import type { IVideoService } from '../interfaces/video-service.interface';

/**
 * Service class for video operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class VideoService implements IVideoService, IPaginatedVideoService {
  private readonly getVideosUseCase: IUseCase<void, VideoDto[]>;
  private readonly getVideoByIdUseCase: IUseCase<string, VideoDto | null>;
  private readonly createVideoUseCase: IUseCase<CreateVideoDto, VideoDto>;
  private readonly incrementVideoViewsUseCase: IUseCase<string, boolean>;
  private readonly getVideosByCategoryUseCase: IUseCase<string, VideoDto[]>;
  private readonly searchVideosUseCase: IUseCase<{ query: string, categoryId?: string }, VideoDto[]>;
  private readonly getVideosByUserUseCase: IUseCase<string, VideoDto[]>;
  private readonly getPaginatedVideosByUserUseCase: IUseCase<{ profileId: string, pagination: PaginationParamsDto }, PaginatedResultDto<VideoDto>>;
  private readonly getPaginatedLikedVideosByUserUseCase: IUseCase<{ profileId: string, pagination: PaginationParamsDto }, PaginatedResultDto<VideoDto>>;
  private readonly getVideoWithCategoryByIdUseCase: IUseCase<string, VideoWithCategoryDto | null>;
  private readonly getVideoDetailsUseCase: IUseCase<string, VideoDetailsDto | null>;
  private readonly getPaginatedVideosByCategoryUseCase: IUseCase<{ categoryId: string, pagination: PaginationParamsDto }, PaginatedResultDto<VideoDto>>;

  /**
   * Constructor with dependency injection
   * @param videoAdapter Adapter for video operations
   * @param categoryAdapter Adapter for category operations
   * @param profileAdapter Adapter for profile operations
   * @param logger Logger for error logging
   */
  constructor(
    private readonly videoAdapter: IVideoRepositoryAdapter,
    private readonly categoryAdapter: ICategoryRepositoryAdapter,
    private readonly profileAdapter: IProfileRepositoryAdapter,
    private readonly logger: Logger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.getVideosUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetVideosUseCase(videoAdapter, logger),
      logger
    );

    this.getVideoByIdUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetVideoByIdUseCase(videoAdapter, logger),
      logger
    );

    this.createVideoUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createCreateVideoUseCase(videoAdapter, logger),
      logger
    );

    this.incrementVideoViewsUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createIncrementVideoViewsUseCase(videoAdapter, logger),
      logger
    );

    this.getVideosByCategoryUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetVideosByCategoryUseCase(videoAdapter, logger),
      logger
    );

    this.searchVideosUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createSearchVideosUseCase(videoAdapter, logger),
      logger
    );

    this.getVideosByUserUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetVideosByUserUseCase(videoAdapter, logger),
      logger
    );

    this.getPaginatedVideosByUserUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetPaginatedVideosByUserUseCase(videoAdapter, logger),
      logger
    );

    this.getPaginatedLikedVideosByUserUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetPaginatedLikedVideosByUserUseCase(videoAdapter, logger),
      logger
    );

    this.getVideoWithCategoryByIdUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetVideoWithCategoryByIdUseCase(
        videoAdapter,
        categoryAdapter,
        profileAdapter,
        logger
      ),
      logger
    );

    this.getVideoDetailsUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetVideoDetailsUseCase(
        videoAdapter,
        categoryAdapter,
        profileAdapter,
        logger
      ),
      logger
    );

    this.getPaginatedVideosByCategoryUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetPaginatedVideosByCategoryUseCase(videoAdapter, logger),
      logger
    );
  }

  /**
   * Get all videos
   * @returns Array of video DTOs
   */
  async getAllVideos(): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.getVideosUseCase.execute();
  }

  /**
   * Get a video by ID
   * @param id Video ID
   * @returns Video DTO or null if not found
   */
  async getVideoById(id: string): Promise<VideoDto | null> {
    // Error handling is now managed by the decorator
    return this.getVideoByIdUseCase.execute(id);
  }

  /**
   * Create a new video
   * @param videoData Data for the new video
   * @returns Created video as DTO
   */
  async createVideo(videoData: CreateVideoDto): Promise<VideoDto> {
    // Error handling is now managed by the decorator
    return this.createVideoUseCase.execute(videoData);
  }

  /**
   * Increment video views
   * @param id Video ID
   * @returns True if successful
   */
  async incrementVideoViews(id: string): Promise<boolean> {
    // Error handling is now managed by the decorator
    return this.incrementVideoViewsUseCase.execute(id);
  }

  /**
   * Get videos by category
   * @param categoryId Category ID
   * @returns Array of video DTOs
   */
  async getVideosByCategory(categoryId: string): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.getVideosByCategoryUseCase.execute(categoryId);
  }

  /**
   * Search videos
   * @param query Search query
   * @param categoryId Optional category ID to filter by
   * @returns Array of video DTOs
   */
  async searchVideos(query: string, categoryId?: string): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.searchVideosUseCase.execute({ query, categoryId });
  }

  /**
   * Get videos by user
   * @param profileId Profile ID
   * @returns Array of video DTOs
   */
  async getVideosByUser(profileId: string): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.getVideosByUserUseCase.execute(profileId);
  }

  /**
   * Get paginated videos by user
   * @param profileId Profile ID
   * @param pagination Pagination parameters
   * @returns Paginated result with videos
   */
  async getPaginatedVideosByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    // Error handling is now managed by the decorator
    return this.getPaginatedVideosByUserUseCase.execute({ profileId, pagination });
  }

  /**
   * Get paginated liked videos by user
   * @param profileId Profile ID
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   */
  async getPaginatedLikedVideosByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    return this.getPaginatedLikedVideosByUserUseCase.execute({ profileId, pagination });
  }

  /**
   * Get paginated videos by category
   * @param categoryId Category ID
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   */
  async getPaginatedVideosByCategory(categoryId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    return this.getPaginatedVideosByCategoryUseCase.execute({ categoryId, pagination });
  }

  /**
   * Get video with category by ID
   * @param id Video ID
   * @returns Video with category DTO or null if not found
   */
  async getVideoWithCategoryById(id: string): Promise<VideoWithCategoryDto | null> {
    // Error handling is now managed by the decorator
    return this.getVideoWithCategoryByIdUseCase.execute(id);
  }

  /**
   * Get video details including category, profile, and like status
   * @param id Video ID
   * @returns Video details DTO or null if not found
   */
  async getVideoDetails(id: string): Promise<VideoDetailsDto | null> {
    // Error handling is now managed by the decorator
    return this.getVideoDetailsUseCase.execute(id);
  }
}
