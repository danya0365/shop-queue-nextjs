import { ErrorHandlingDecorator } from '../decorators/error-handling.decorator';
import { DashboardDataDto } from '../dtos/dashboard-dto';
import { DashboardUseCaseFactory } from '../factories/dashboard-use-case.factory';
import type { IDashboardDataRepositoryAdapter } from '../interfaces/dashboard-data-repository-adapter.interface';
import type { IDashboardService } from '../interfaces/dashboard-service.interface';
import type { ILogger } from '../interfaces/logger.interface';
import type { IUseCase } from '../interfaces/use-case.interface';

/**
 * Service class for dashboard operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class DashboardService implements IDashboardService {
  private readonly getUserDashboardUseCase: IUseCase<void, DashboardDataDto | null>;
  
  /**
   * Constructor with dependency injection
   * @param dashboardDataAdapter Adapter for dashboard data operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly dashboardDataAdapter: IDashboardDataRepositoryAdapter,
    private readonly logger?: ILogger
  ) {
    // Create use case using factory and decorate it with error handling
    this.getUserDashboardUseCase = new ErrorHandlingDecorator(
      DashboardUseCaseFactory.createGetUserDashboardUseCase(dashboardDataAdapter),
      logger
    );
  }

  /**
   * Get user dashboard data using the Supabase RPC function
   * This includes video count, total views, likes, comments, and recent videos
   * Uses the active profile from Supabase session
   * @returns Dashboard data DTO or null if not found
   */
  async getUserDashboard(): Promise<DashboardDataDto | null> {
    const dashboardData = await this.getUserDashboardUseCase.execute();
    return dashboardData;
  }

}
