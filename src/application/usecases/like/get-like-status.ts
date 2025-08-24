import { LikeRepositoryException } from '../../exceptions/like-exceptions';
import { ILikeRepositoryAdapter } from '../../interfaces/like-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';

export interface GetLikeStatusInput {
  profileId: string;
  videoId: string;
}

/**
 * Use case for checking if a user has liked a video
 * Following SOLID principles and Clean Architecture
 */
export class GetLikeStatusUseCase implements IUseCase<GetLikeStatusInput, boolean> {
  /**
   * Constructor with dependency injection
   * @param likeAdapter Repository adapter for like operations
   */
  constructor(private readonly likeAdapter: ILikeRepositoryAdapter) {}

  /**
   * Execute the use case to check if a user has liked a video
   * @param input Object containing profileId and videoId
   * @returns Boolean indicating if the video is liked
   * @throws LikeRepositoryException if there's an error in the repository
   */
  async execute(input: GetLikeStatusInput): Promise<boolean> {
    const { profileId, videoId } = input;
    try {
      return await this.likeAdapter.getLikeStatus(profileId, videoId);
    } catch (error) {
      // Error is already wrapped by adapter
      if (error instanceof LikeRepositoryException) {
        throw error;
      }
      // Wrap any other errors
      throw new LikeRepositoryException(
        `Failed to get like status: ${(error as Error)?.message || 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }
}
