import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';
import { VideoDto } from '../dtos/video-dto';

/**
 * Interface for User Liked Videos Repository Adapter
 * This interface defines the contract for adapters that work with user liked videos
 * Following Interface Segregation Principle by creating focused interfaces
 */
export interface IUserLikedVideosRepositoryAdapter {
  /**
   * Get paginated videos liked by the specified user
   * @param profileId The profile ID to get liked videos for
   * @param params Pagination parameters
   * @returns Paginated result of liked videos
   */
  getPaginatedLikedVideosByUser(profileId: string, params: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
}
