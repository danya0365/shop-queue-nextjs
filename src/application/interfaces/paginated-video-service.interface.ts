import { VideoDto } from '../dtos/video-dto';
import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';

/**
 * Interface for paginated video service
 * Following Interface Segregation Principle by defining a clear contract for pagination
 */
export interface IPaginatedVideoService {
  /**
   * Get paginated videos by user
   * @param profileId Profile ID
   * @param pagination Pagination parameters
   * @returns Paginated result with videos
   */
  getPaginatedVideosByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
  
  /**
   * Get paginated liked videos by user
   * @param profileId Profile ID
   * @param pagination Pagination parameters
   * @returns Paginated result with videos
   */
  getPaginatedLikedVideosByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
  
  /**
   * Get paginated videos by category
   * @param categoryId Category ID
   * @param pagination Pagination parameters
   * @returns Paginated result with videos
   */
  getPaginatedVideosByCategory(categoryId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
}
