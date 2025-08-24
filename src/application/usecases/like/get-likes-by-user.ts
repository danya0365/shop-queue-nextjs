import { LikeDto } from '../../dtos/like-dto';
import { ILikeRepositoryAdapter } from '../../interfaces/like-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';
import { LikeRepositoryException } from '../../exceptions/like-exceptions';

/**
 * Use case for getting all likes by a user
 * Following SOLID principles and Clean Architecture
 */
export class GetLikesByUserUseCase implements IUseCase<string, LikeDto[]> {
  /**
   * Constructor with dependency injection
   * @param likeAdapter Repository adapter for like operations
   */
  constructor(private readonly likeAdapter: ILikeRepositoryAdapter) {}

  /**
   * Execute the use case to get all likes by a user
   * @param profileId ID of the user profile
   * @returns Array of like DTOs
   * @throws LikeRepositoryException if there's an error in the repository
   */
  async execute(profileId: string): Promise<LikeDto[]> {
    try {
      return await this.likeAdapter.getByUser(profileId);
    } catch (error) {
      // Error is already wrapped by adapter
      if (error instanceof LikeRepositoryException) {
        throw error;
      }
      // Wrap any other errors
      throw new LikeRepositoryException(
        `Failed to get likes by user: ${(error as Error)?.message || 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }
}
