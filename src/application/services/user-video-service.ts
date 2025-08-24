import { ErrorHandlingDecorator } from '../decorators/error-handling.decorator';
import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';
import { VideoDto } from '../dtos/video-dto';
import { VideoUseCaseFactory } from '../factories/video-use-case.factory';
import type { ILogger } from '../interfaces/logger.interface';
import type { IProfileRepositoryAdapter } from '../interfaces/profile-repository-adapter.interface';
import type { IUseCase } from '../interfaces/use-case.interface';
import type { IVideoRepositoryAdapter } from '../interfaces/video-repository-adapter.interface';
import type { IUserVideoService } from '../interfaces/video-service.interface';

/**
 * Service class for user-video interaction operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class UserVideoService implements IUserVideoService {
  private readonly getLikedVideosByUserUseCase: IUseCase<string, VideoDto[]>;
  private readonly getPaginatedLikedVideosByUserUseCase: IUseCase<{profileId: string, pagination: PaginationParamsDto}, PaginatedResultDto<VideoDto>>;

  /**
   * Constructor with dependency injection
   * @param videoAdapter Adapter for video operations
   * @param profileAdapter Adapter for profile operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly videoAdapter: IVideoRepositoryAdapter,
    private readonly profileAdapter: IProfileRepositoryAdapter,
    private readonly logger?: ILogger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.getLikedVideosByUserUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetLikedVideosByUserUseCase(videoAdapter),
      logger
    );
    
    this.getPaginatedLikedVideosByUserUseCase = new ErrorHandlingDecorator(
      VideoUseCaseFactory.createGetPaginatedLikedVideosByUserUseCase(videoAdapter),
      logger
    );
  }

  /**
   * Get liked videos by user
   * @param profileId Profile ID
   * @returns Array of video DTOs
   */
  async getLikedVideosByUser(profileId: string): Promise<VideoDto[]> {
    // Error handling is now managed by the decorator
    return this.getLikedVideosByUserUseCase.execute(profileId);
  }
  
  /**
   * Get paginated liked videos by user
   * @param profileId Profile ID
   * @param pagination Pagination parameters
   * @returns Paginated result of video DTOs
   */
  async getPaginatedLikedVideosByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    // Error handling is now managed by the decorator
    return this.getPaginatedLikedVideosByUserUseCase.execute({ profileId, pagination });
  }
}
