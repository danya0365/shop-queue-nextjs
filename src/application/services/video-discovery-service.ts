
import { ErrorHandlingDecorator } from '../decorators/error-handling.decorator';
import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';
import { VideoDto } from '../dtos/video-dto';
import { VideoUseCaseFactory } from '../factories/video-use-case.factory';
import type { ILogger } from '../interfaces/logger.interface';
import type { IUseCase } from '../interfaces/use-case.interface';
import type { IVideoRepositoryAdapter } from '../interfaces/video-repository-adapter.interface';
import type { IVideoDiscoveryService } from '../interfaces/video-service.interface';

/**
 * Service class for video discovery operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class VideoDiscoveryService implements IVideoDiscoveryService {
  private readonly getRecentVideosUseCase: IUseCase<number | undefined, VideoDto[]>;
  private readonly getPopularVideosUseCase: IUseCase<number | undefined, VideoDto[]>;
  private readonly getMostLikedVideosUseCase: IUseCase<number | undefined, VideoDto[]>;
  private readonly getRelatedVideosUseCase: IUseCase<{videoId: string, limit?: number}, VideoDto[]>;
  private readonly getPaginatedPopularVideosUseCase: IUseCase<PaginationParamsDto, PaginatedResultDto<VideoDto>>;
  private readonly getPaginatedRecentVideosUseCase: IUseCase<PaginationParamsDto, PaginatedResultDto<VideoDto>>;

  /**
   * Constructor with dependency injection
   * @param videoAdapter Adapter for video operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly videoAdapter: IVideoRepositoryAdapter,
    private readonly logger?: ILogger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.getRecentVideosUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetRecentVideosUseCase(videoAdapter),
      logger
    );
    
    this.getPopularVideosUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetPopularVideosUseCase(videoAdapter),
      logger
    );
    
    this.getMostLikedVideosUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetMostLikedVideosUseCase(videoAdapter),
      logger
    );
    
    this.getRelatedVideosUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetRelatedVideosUseCase(videoAdapter),
      logger
    );

    // Create paginated use cases with error handling decorator
    this.getPaginatedPopularVideosUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetPaginatedPopularVideosUseCase(videoAdapter),
      logger
    );

    this.getPaginatedRecentVideosUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetPaginatedRecentVideosUseCase(videoAdapter),
      logger
    );
  }

  /**
   * Get recent videos
   * @param limit Optional limit of videos to return
   * @returns Array of video DTOs
   */
  async getRecentVideos(limit?: number): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.getRecentVideosUseCase.execute(limit);
  }

  /**
   * Get popular videos
   * @param limit Optional limit of videos to return
   * @returns Array of video DTOs
   */
  async getPopularVideos(limit?: number): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.getPopularVideosUseCase.execute(limit);
  }

  /**
   * Get most liked videos
   * @param limit Optional limit of videos to return
   * @returns Array of video DTOs
   */
  async getMostLikedVideos(limit?: number): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.getMostLikedVideosUseCase.execute(limit);
  }

  /**
   * Get related videos
   * @param videoId Video ID
   * @param limit Optional limit of videos to return
   * @returns Array of video DTOs
   */
  async getRelatedVideos(videoId: string, limit?: number): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.getRelatedVideosUseCase.execute({ videoId, limit });
  }

  /**
   * Get paginated recent videos using database-level pagination
   * @param params Pagination parameters (page, limit)
   * @returns Paginated result of video DTOs
   */
  async getPaginatedRecentVideos(params: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    // Error handling is now managed by the decorator
    return this.getPaginatedRecentVideosUseCase.execute(params);
  }

  /**
   * Get paginated popular videos using database-level pagination
   * @param params Pagination parameters (page, limit)
   * @returns Paginated result of video DTOs
   */
  async getPaginatedPopularVideos(params: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    // Error handling is now managed by the decorator
    return this.getPaginatedPopularVideosUseCase.execute(params);
  }
}
