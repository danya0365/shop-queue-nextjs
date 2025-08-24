import { DashboardDataDto } from '../dtos/dashboard-dto';
import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';
import { VideoDto } from '../dtos/video-dto';

/**
 * Interface for Dashboard Repository Adapter
 * This interface defines the contract for adapters that work with Dashboard data
 * Following Clean Architecture by separating domain and application layers
 */
export interface IDashboardRepositoryAdapter {
  /**
   * Get dashboard data for the currently active profile
   * @returns Dashboard data or null if not found or no active profile
   */
  getUserDashboard(): Promise<DashboardDataDto | null>;
  
  /**
   * Get paginated videos liked by the specified user
   * @param profileId The profile ID to get liked videos for
   * @param pagination Pagination parameters
   * @returns Paginated result with videos
   */
  getPaginatedLikedVideosByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
}
