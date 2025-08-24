import { ILikeRepositoryAdapter } from '../../interfaces/like-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';
import { z } from 'zod';

/**
 * Schema for validating input
 */
const inputSchema = z.string().uuid();

/**
 * Use case for getting like count for a video
 * Following the Clean Architecture pattern
 */
export class GetLikeCountUseCase implements IUseCase<string, number> {
  /**
   * Constructor with dependency injection
   * @param likeAdapter Adapter for like operations
   */
  constructor(private readonly likeAdapter: ILikeRepositoryAdapter) {}

  /**
   * Execute the use case to get like count for a video
   * @param videoId Video ID
   * @returns Number of likes
   */
  async execute(videoId: string): Promise<number> {
    // Validate input
    inputSchema.parse(videoId);
    
    // Get likes for the video
    const likes = await this.likeAdapter.getByVideo(videoId);
    
    // Return the count
    return likes.length;
  }
}
