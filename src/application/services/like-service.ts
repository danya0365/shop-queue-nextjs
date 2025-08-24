import { ErrorHandlingDecorator } from '../decorators/error-handling.decorator';
import { CreateLikeInputDto, LikeDto, LikeToggleResponseDto } from '../dtos/like-dto';
import { LikeUseCaseFactory } from '../factories/like-use-case.factory';
import type { ILikeRepositoryAdapter } from '../interfaces/like-repository-adapter.interface';
import type { ILikeService } from '../interfaces/like-service.interface';
import type { ILogger } from '../interfaces/logger.interface';
import type { IUseCase } from '../interfaces/use-case.interface';
import { GetLikeStatusInput } from '../usecases/like/get-like-status';

/**
 * Service class for like operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class LikeService implements ILikeService {
  private readonly toggleLikeUseCase: IUseCase<CreateLikeInputDto, LikeToggleResponseDto>;
  private readonly getLikeStatusUseCase: IUseCase<GetLikeStatusInput, boolean>;
  private readonly getLikesByUserUseCase: IUseCase<string, LikeDto[]>;
  private readonly getLikesByVideoUseCase: IUseCase<string, LikeDto[]>;
  private readonly getLikeCountUseCase: IUseCase<string, number>;

  /**
   * Constructor with dependency injection
   * @param likeAdapter Repository adapter for like operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly likeAdapter: ILikeRepositoryAdapter,
    private readonly logger?: ILogger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.toggleLikeUseCase = new ErrorHandlingDecorator(
      LikeUseCaseFactory.createToggleLikeUseCase(likeAdapter),
      logger
    );
    
    this.getLikeStatusUseCase = new ErrorHandlingDecorator(
      LikeUseCaseFactory.createGetLikeStatusUseCase(likeAdapter),
      logger
    );
    
    this.getLikesByUserUseCase = new ErrorHandlingDecorator(
      LikeUseCaseFactory.createGetLikesByUserUseCase(likeAdapter),
      logger
    );
    
    this.getLikesByVideoUseCase = new ErrorHandlingDecorator(
      LikeUseCaseFactory.createGetLikesByVideoUseCase(likeAdapter),
      logger
    );
    
    this.getLikeCountUseCase = new ErrorHandlingDecorator(
      LikeUseCaseFactory.createGetLikeCountUseCase(likeAdapter),
      logger
    );
  }

  /**
   * Toggle like status for a video
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Object containing like status and count
   */
  async toggleLike(profileId: string, videoId: string): Promise<LikeToggleResponseDto> {
    const input: CreateLikeInputDto = {
      profileId,
      videoId
    };
    // Error handling is now managed by the decorator
    return this.toggleLikeUseCase.execute(input);
  }

  /**
   * Get like status for a video by a user
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Boolean indicating if the video is liked by the user
   */
  async getLikeStatus(profileId: string, videoId: string): Promise<boolean> {
    // Error handling is now managed by the decorator
    return this.getLikeStatusUseCase.execute({ profileId, videoId });
  }

  /**
   * Get all likes by a user
   * @param profileId Profile ID
   * @returns Array of like DTOs
   */
  async getLikesByUser(profileId: string): Promise<LikeDto[]> {
    // Error handling is now managed by the decorator
    return this.getLikesByUserUseCase.execute(profileId);
  }

  /**
   * Get all likes for a video
   * @param videoId Video ID
   * @returns Array of like DTOs
   */
  async getLikesByVideo(videoId: string): Promise<LikeDto[]> {
    // Error handling is now managed by the decorator
    return this.getLikesByVideoUseCase.execute(videoId);
  }
  
  /**
   * Get like count for a video
   * @param videoId Video ID
   * @returns Number of likes
   */
  async getLikeCount(videoId: string): Promise<number> {
    // Error handling is now managed by the decorator
    return this.getLikeCountUseCase.execute(videoId);
  }
}
