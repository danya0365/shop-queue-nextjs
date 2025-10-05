import type {
  GlobalDashboardStatsDTO,
  GlobalRecentActivityDTO,
  ShopPerformanceSummaryDTO,
  GlobalDashboardDataDTO,
} from '@/src/application/dtos/dashboard/global-dashboard-dto';
import type { IGetGlobalStatsUseCase } from '@/src/application/usecases/dashboard/GetGlobalStatsUseCase';
import type { IGetGlobalRecentActivitiesUseCase } from '@/src/application/usecases/dashboard/GetGlobalRecentActivitiesUseCase';
import type { IGetShopPerformancesUseCase } from '@/src/application/usecases/dashboard/GetShopPerformancesUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { GetGlobalStatsUseCase } from '@/src/application/usecases/dashboard/GetGlobalStatsUseCase';
import { GetGlobalRecentActivitiesUseCase } from '@/src/application/usecases/dashboard/GetGlobalRecentActivitiesUseCase';
import { GetShopPerformancesUseCase } from '@/src/application/usecases/dashboard/GetShopPerformancesUseCase';
import type { GlobalDashboardRepository } from '@/src/domain/repositories/dashboard/global-dashboard-repository';

/**
 * Global Dashboard Service Interface
 */
export interface IGlobalDashboardService {
  /**
   * Get aggregated statistics across all shops
   */
  getGlobalStats(profileId: string): Promise<GlobalDashboardStatsDTO>;

  /**
   * Get recent activities across all shops
   */
  getRecentActivities(
    profileId: string,
    limit?: number
  ): Promise<GlobalRecentActivityDTO[]>;

  /**
   * Get performance summary for each shop
   */
  getShopPerformances(profileId: string): Promise<ShopPerformanceSummaryDTO[]>;

  /**
   * Get complete global dashboard data
   */
  getGlobalDashboardData(
    profileId: string,
    activityLimit?: number
  ): Promise<GlobalDashboardDataDTO>;
}

/**
 * Global Dashboard Service
 * Orchestrates use cases for global dashboard operations
 */
export class GlobalDashboardService implements IGlobalDashboardService {
  constructor(
    private readonly getGlobalStatsUseCase: IGetGlobalStatsUseCase,
    private readonly getRecentActivitiesUseCase: IGetGlobalRecentActivitiesUseCase,
    private readonly getShopPerformancesUseCase: IGetShopPerformancesUseCase,
    private readonly logger: Logger
  ) {}

  async getGlobalStats(profileId: string): Promise<GlobalDashboardStatsDTO> {
    try {
      this.logger.info('GlobalDashboardService: Getting global stats', { profileId });
      const stats = await this.getGlobalStatsUseCase.execute(profileId);
      this.logger.info('GlobalDashboardService: Successfully retrieved global stats', {
        profileId,
        totalShops: stats.totalShops,
      });
      return stats;
    } catch (error) {
      this.logger.error('GlobalDashboardService: Error getting global stats', error);
      throw error;
    }
  }

  async getRecentActivities(
    profileId: string,
    limit: number = 10
  ): Promise<GlobalRecentActivityDTO[]> {
    try {
      this.logger.info('GlobalDashboardService: Getting recent activities', {
        profileId,
        limit,
      });
      const activities = await this.getRecentActivitiesUseCase.execute(profileId, limit);
      this.logger.info('GlobalDashboardService: Successfully retrieved recent activities', {
        profileId,
        count: activities.length,
      });
      return activities;
    } catch (error) {
      this.logger.error('GlobalDashboardService: Error getting recent activities', error);
      throw error;
    }
  }

  async getShopPerformances(
    profileId: string
  ): Promise<ShopPerformanceSummaryDTO[]> {
    try {
      this.logger.info('GlobalDashboardService: Getting shop performances', { profileId });
      const performances = await this.getShopPerformancesUseCase.execute(profileId);
      this.logger.info('GlobalDashboardService: Successfully retrieved shop performances', {
        profileId,
        count: performances.length,
      });
      return performances;
    } catch (error) {
      this.logger.error('GlobalDashboardService: Error getting shop performances', error);
      throw error;
    }
  }

  async getGlobalDashboardData(
    profileId: string,
    activityLimit: number = 10
  ): Promise<GlobalDashboardDataDTO> {
    try {
      this.logger.info('GlobalDashboardService: Getting complete global dashboard data', {
        profileId,
        activityLimit,
      });

      // Execute all queries in parallel for better performance
      const [stats, recentActivities, shopPerformances] = await Promise.all([
        this.getGlobalStatsUseCase.execute(profileId),
        this.getRecentActivitiesUseCase.execute(profileId, activityLimit),
        this.getShopPerformancesUseCase.execute(profileId),
      ]);

      const dashboardData: GlobalDashboardDataDTO = {
        stats,
        recentActivities,
        shopPerformances,
        lastUpdated: new Date().toISOString(),
      };

      this.logger.info('GlobalDashboardService: Successfully retrieved complete dashboard data', {
        profileId,
        totalShops: stats.totalShops,
        activitiesCount: recentActivities.length,
        shopsCount: shopPerformances.length,
      });

      return dashboardData;
    } catch (error) {
      this.logger.error('GlobalDashboardService: Error getting global dashboard data', error);
      throw error;
    }
  }
}

/**
 * Global Dashboard Service Factory
 */
export class GlobalDashboardServiceFactory {
  static create(
    repository: GlobalDashboardRepository,
    logger: Logger
  ): GlobalDashboardService {
    const getGlobalStatsUseCase = new GetGlobalStatsUseCase(repository, logger);
    const getRecentActivitiesUseCase = new GetGlobalRecentActivitiesUseCase(
      repository,
      logger
    );
    const getShopPerformancesUseCase = new GetShopPerformancesUseCase(repository, logger);

    return new GlobalDashboardService(
      getGlobalStatsUseCase,
      getRecentActivitiesUseCase,
      getShopPerformancesUseCase,
      logger
    );
  }
}
