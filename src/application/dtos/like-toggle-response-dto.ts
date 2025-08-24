/**
 * DTO for like toggle response
 * Contains the updated like status and count
 */
export interface LikeToggleResponseDto {
  /**
   * Whether the video is liked after the toggle
   */
  isLiked: boolean;
  
  /**
   * The updated like count for the video
   */
  likeCount: number;
}
