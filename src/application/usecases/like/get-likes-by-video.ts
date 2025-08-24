import { LikeDto } from '../../dtos/like-dto';
import { ILikeRepositoryAdapter } from '../../interfaces/like-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';
import { LikeRepositoryException } from '../../exceptions/like-exceptions';

/**
 * Use case for getting all likes for a video
 * Following SOLID principles and Clean Architecture
 */
export class GetLikesByVideoUseCase implements IUseCase<string, LikeDto[]> {
  /**
   * Constructor with dependency injection
   * @param likeAdapter Repository adapter for like operations
   */
  constructor(private readonly likeAdapter: ILikeRepositoryAdapter) {}

  /**
   * Execute the use case to get all likes for a video
   * @param videoId ID of the video
   * @returns Array of like DTOs
   * @throws LikeRepositoryException if there's an error in the repository
   */
  async execute(videoId: string): Promise<LikeDto[]> {
    try {
      return await this.likeAdapter.getByVideo(videoId);
    } catch (error) {
      // Error is already wrapped by adapter
      if (error instanceof LikeRepositoryException) {
        throw error;
      }
      // Wrap any other errors
      throw new LikeRepositoryException(
        `Failed to get likes by video: ${(error as Error)?.message || 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }
}
