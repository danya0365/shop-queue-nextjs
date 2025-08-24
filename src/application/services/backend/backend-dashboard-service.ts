
import { ErrorHandlingDecorator } from '../../decorators/error-handling.decorator';
import {
  BackendActivityDto,
  DashboardStatsDto,
  PopularVideoDto,
  RecentProfileDto,
  SystemHealthDto
} from '../../dtos/backend/backend-dashboard-dto';
import { BackendDashboardUseCaseFactory } from '../../factories/backend/backend-dashboard-use-case.factory';
import type { IBackendDashboardRepositoryAdapter } from '../../interfaces/backend/backend-dashboard-repository-adapter.interface';
import type { IBackendDashboardService } from '../../interfaces/backend/backend-dashboard-service.interface';
import type { ILogger } from '../../interfaces/logger.interface';
import type { IUseCase } from '../../interfaces/use-case.interface';
import { GetPopularVideosInput } from '../../usecases/backend/dashboard/get-popular-videos';
import { GetRecentActivitiesInput } from '../../usecases/backend/dashboard/get-recent-activities';
import { GetRecentProfilesInput } from '../../usecases/backend/dashboard/get-recent-profiles';

/**
 * Service class for backend dashboard operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class BackendDashboardService implements IBackendDashboardService {
  private readonly getSystemHealthUseCase: IUseCase<void, SystemHealthDto | null>;
  private readonly getRecentActivitiesUseCase: IUseCase<GetRecentActivitiesInput, BackendActivityDto[]>;
  private readonly getDashboardStatsUseCase: IUseCase<void, DashboardStatsDto>;
  private readonly getPopularVideosUseCase: IUseCase<GetPopularVideosInput, PopularVideoDto[]>;
  private readonly getRecentProfilesUseCase: IUseCase<GetRecentProfilesInput, RecentProfileDto[]>;

  /**
   * Constructor with dependency injection
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly backendDashboardAdapter: IBackendDashboardRepositoryAdapter,
    private readonly logger?: ILogger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.getSystemHealthUseCase = new ErrorHandlingDecorator(
      BackendDashboardUseCaseFactory.createGetSystemHealthUseCase(backendDashboardAdapter),
      logger
    );
    
    this.getRecentActivitiesUseCase = new ErrorHandlingDecorator(
      BackendDashboardUseCaseFactory.createGetRecentActivitiesUseCase(backendDashboardAdapter),
      logger
    );
    
    this.getDashboardStatsUseCase = new ErrorHandlingDecorator(
      BackendDashboardUseCaseFactory.createGetDashboardStatsUseCase(backendDashboardAdapter),
      logger
    );
    
    this.getPopularVideosUseCase = new ErrorHandlingDecorator(
      BackendDashboardUseCaseFactory.createGetPopularVideosUseCase(backendDashboardAdapter),
      logger
    );
    
    this.getRecentProfilesUseCase = new ErrorHandlingDecorator(
      BackendDashboardUseCaseFactory.createGetRecentProfilesUseCase(backendDashboardAdapter),
      logger
    );
  }

  /**
   * Get system health status
   * @returns System health data or null if not available
   */
  async getSystemHealth(): Promise<SystemHealthDto | null> {
    // Error handling is managed by the decorator
    return await this.getSystemHealthUseCase.execute();
  }
  
  /**
   * Get recent backend activities
   * @param limit Maximum number of activities to return
   * @returns List of recent activities
   */
  async getRecentActivities(limit?: number): Promise<BackendActivityDto[]> {
    // Error handling is managed by the decorator
    return await this.getRecentActivitiesUseCase.execute({ limit });
  }

  /**
   * Get dashboard statistics
   * @returns Dashboard statistics data
   */
  async getDashboardStats(): Promise<DashboardStatsDto> {
    // Error handling is managed by the decorator
    return await this.getDashboardStatsUseCase.execute();
  }

  /**
   * Get popular videos
   * @param limit Maximum number of videos to return (default: 5)
   * @returns List of popular videos
   */
  async getPopularVideos(limit?: number): Promise<PopularVideoDto[]> {
    // Error handling is managed by the decorator
    return await this.getPopularVideosUseCase.execute({ limit });
  }

  /**
   * Get recent user profiles
   * @param limit Maximum number of profiles to return (default: 5)
   * @returns List of recent user profiles
   */
  async getRecentProfiles(limit?: number): Promise<RecentProfileDto[]> {
    // Error handling is managed by the decorator
    return await this.getRecentProfilesUseCase.execute({ limit });
  }
}
