import type { DashboardDataDTO } from "@/src/application/dtos/backend/dashboard-stats-dto";
import {
  GetDashboardStatsUseCase,
  type IGetDashboardStatsUseCase,
} from "@/src/application/usecases/backend/dashboard/GetDashboardStatsUseCase";
import {
  GetPopularServicesUseCase,
  type IGetPopularServicesUseCase,
} from "@/src/application/usecases/backend/dashboard/GetPopularServicesUseCase";
import {
  GetQueueDistributionUseCase,
  type IGetQueueDistributionUseCase,
} from "@/src/application/usecases/backend/dashboard/GetQueueDistributionUseCase";
import {
  GetRecentActivitiesUseCase,
  type IGetRecentActivitiesUseCase,
} from "@/src/application/usecases/backend/dashboard/GetRecentActivitiesUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BackendDashboardRepository } from "@/src/domain/repositories/backend/backend-dashboard-repository";

export interface IBackendDashboardService {
  getDashboardData(): Promise<DashboardDataDTO>;
}

export class BackendDashboardService implements IBackendDashboardService {
  constructor(
    private readonly getDashboardStatsUseCase: IGetDashboardStatsUseCase,
    private readonly getRecentActivitiesUseCase: IGetRecentActivitiesUseCase,
    private readonly getQueueDistributionUseCase: IGetQueueDistributionUseCase,
    private readonly getPopularServicesUseCase: IGetPopularServicesUseCase,
    private readonly logger: Logger
  ) {}

  async getDashboardData(): Promise<DashboardDataDTO> {
    try {
      this.logger.info(
        "GetDashboardDataUseCase: Executing dashboard data retrieval"
      );

      // Execute all use cases in parallel for better performance
      const [stats, popularServices, queueDistribution, recentActivities] =
        await Promise.all([
          this.getDashboardStatsUseCase.execute(),
          this.getPopularServicesUseCase.execute(),
          this.getQueueDistributionUseCase.execute(),
          this.getRecentActivitiesUseCase.execute(),
        ]);

      // Combine all data into a single DTO
      const dashboardData: DashboardDataDTO = {
        stats,
        popularServices,
        queueDistribution,
        recentActivities,
        lastUpdated: new Date().toISOString(),
      };

      this.logger.info(
        "GetDashboardDataUseCase: Successfully retrieved all dashboard data"
      );
      return dashboardData;
    } catch (error) {
      this.logger.error(
        "GetDashboardDataUseCase: Error retrieving dashboard data",
        error
      );
      throw error;
    }
  }
}

export class BackendDashboardServiceFactory {
  static create(
    repository: BackendDashboardRepository,
    logger: Logger
  ): BackendDashboardService {
    const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
      repository,
      logger
    );
    const getRecentActivitiesUseCase = new GetRecentActivitiesUseCase(
      repository,
      logger
    );
    const getQueueDistributionUseCase = new GetQueueDistributionUseCase(
      repository,
      logger
    );
    const getPopularServicesUseCase = new GetPopularServicesUseCase(
      repository,
      logger
    );
    return new BackendDashboardService(
      getDashboardStatsUseCase,
      getRecentActivitiesUseCase,
      getQueueDistributionUseCase,
      getPopularServicesUseCase,
      logger
    );
  }
}
