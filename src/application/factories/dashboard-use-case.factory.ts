import { IDashboardDataRepositoryAdapter } from '../interfaces/dashboard-data-repository-adapter.interface';
import { IUseCase } from '../interfaces/use-case.interface';
import { DashboardDataDto } from '../dtos/dashboard-dto';
import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';
import { VideoDto } from '../dtos/video-dto';
import { GetUserDashboardUseCase } from '../usecases/dashboard/get-user-dashboard';
import { GetPaginatedLikedVideosByUserUseCase } from '../usecases/video/get-paginated-liked-videos-by-user';
import { IVideoRepositoryAdapter } from '../interfaces/video-repository-adapter.interface';
import { ILogger } from '../interfaces/logger.interface';

/**
 * Factory for creating dashboard use cases
 * Following Factory Pattern to centralize creation logic
 * Following SOLID principles by separating dashboard-related use cases
 */
export class DashboardUseCaseFactory {
  /**
   * Create a use case for getting user dashboard data
   * @param dashboardDataAdapter Dashboard data repository adapter
   * @returns GetUserDashboardUseCase instance
   */
  static createGetUserDashboardUseCase(
    dashboardDataAdapter: IDashboardDataRepositoryAdapter
  ): IUseCase<void, DashboardDataDto | null> {
    return new GetUserDashboardUseCase(dashboardDataAdapter);
  }
  
  /**
   * Create a use case for getting paginated liked videos by user
   * @param videoAdapter Video repository adapter
   * @param logger Optional logger for error logging
   * @returns GetPaginatedLikedVideosByUserUseCase instance
   */
  static createGetPaginatedLikedVideosByUserUseCase(
    videoAdapter: IVideoRepositoryAdapter,
    logger?: ILogger
  ): IUseCase<{profileId: string, pagination: PaginationParamsDto}, PaginatedResultDto<VideoDto>> {
    return new GetPaginatedLikedVideosByUserUseCase(videoAdapter, logger);
  }
}
