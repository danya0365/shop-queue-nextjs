import { CreateLikeInputDto, LikeDto, LikeToggleResponseDto } from '../dtos/like-dto';

/**
 * Interface for like repository adapter
 * Following Dependency Inversion Principle and Interface Segregation Principle
 */
export interface ILikeRepositoryAdapter {
  /**
   * Toggle like status for a video
   * @param input Input DTO with profile ID and video ID
   * @returns Object containing like status and count
   */
  toggleLike(input: CreateLikeInputDto): Promise<LikeToggleResponseDto>;
  
  /**
   * Get like status for a video by a user
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Boolean indicating if the video is liked by the user
   */
  getLikeStatus(profileId: string, videoId: string): Promise<boolean>;
  
  /**
   * Get all likes by a user
   * @param profileId Profile ID
   * @returns Array of like DTOs
   */
  getByUser(profileId: string): Promise<LikeDto[]>;
  
  /**
   * Get all likes for a video
   * @param videoId Video ID
   * @returns Array of like DTOs
   */
  getByVideo(videoId: string): Promise<LikeDto[]>;
}
