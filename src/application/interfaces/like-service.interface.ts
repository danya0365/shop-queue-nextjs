import { LikeDto, LikeToggleResponseDto } from '../dtos/like-dto';

/**
 * Interface for like service
 * Following Interface Segregation Principle by defining a clear contract
 */
export interface ILikeService {
  /**
   * Toggle like status for a video
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Updated like status with like count
   */
  toggleLike(profileId: string, videoId: string): Promise<LikeToggleResponseDto>;

  /**
   * Get like status for a video
   * @param videoId Video ID
   * @param profileId Profile ID
   * @returns Like status (true if liked, false if not)
   */
  getLikeStatus(videoId: string, profileId: string): Promise<boolean>;

  /**
   * Get likes by user
   * @param profileId Profile ID
   * @returns Array of like DTOs
   */
  getLikesByUser(profileId: string): Promise<LikeDto[]>;

  /**
   * Get likes by video
   * @param videoId Video ID
   * @returns Array of like DTOs
   */
  getLikesByVideo(videoId: string): Promise<LikeDto[]>;

  /**
   * Get like count for a video
   * @param videoId Video ID
   * @returns Number of likes
   */
  getLikeCount(videoId: string): Promise<number>;
}
