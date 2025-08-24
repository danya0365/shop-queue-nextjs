import { IBackendDashboardRepositoryAdapter } from '../../interfaces/backend/backend-dashboard-repository-adapter.interface';
import { GetDashboardStatsUseCase } from '../../usecases/backend/dashboard/get-dashboard-stats';
import { GetPopularVideosUseCase } from '../../usecases/backend/dashboard/get-popular-videos';
import { GetRecentActivitiesUseCase } from '../../usecases/backend/dashboard/get-recent-activities';
import { GetRecentProfilesUseCase } from '../../usecases/backend/dashboard/get-recent-profiles';
import { GetSystemHealthUseCase } from '../../usecases/backend/dashboard/get-system-health';

/**
 * Factory for creating backend dashboard use cases
 * Following SOLID principles with Factory Pattern
 */
export class BackendDashboardUseCaseFactory {
  /**
   * Create GetSystemHealth use case
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   * @returns GetSystemHealthUseCase instance
   */
  static createGetSystemHealthUseCase(
    backendDashboardAdapter: IBackendDashboardRepositoryAdapter
  ): GetSystemHealthUseCase {
    return new GetSystemHealthUseCase(backendDashboardAdapter);
  }

  /**
   * Create GetRecentActivities use case
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   * @returns GetRecentActivitiesUseCase instance
   */
  static createGetRecentActivitiesUseCase(
    backendDashboardAdapter: IBackendDashboardRepositoryAdapter
  ): GetRecentActivitiesUseCase {
    return new GetRecentActivitiesUseCase(backendDashboardAdapter);
  }

  /**
   * Create GetDashboardStats use case
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   * @returns GetDashboardStatsUseCase instance
   */
  static createGetDashboardStatsUseCase(
    backendDashboardAdapter: IBackendDashboardRepositoryAdapter
  ): GetDashboardStatsUseCase {
    return new GetDashboardStatsUseCase(backendDashboardAdapter);
  }

  /**
   * Create GetPopularVideos use case
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   * @returns GetPopularVideosUseCase instance
   */
  static createGetPopularVideosUseCase(
    backendDashboardAdapter: IBackendDashboardRepositoryAdapter
  ): GetPopularVideosUseCase {
    return new GetPopularVideosUseCase(backendDashboardAdapter);
  }

  /**
   * Create GetRecentProfiles use case
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   * @returns GetRecentProfilesUseCase instance
   */
  static createGetRecentProfilesUseCase(
    backendDashboardAdapter: IBackendDashboardRepositoryAdapter
  ): GetRecentProfilesUseCase {
    return new GetRecentProfilesUseCase(backendDashboardAdapter);
  }
}
