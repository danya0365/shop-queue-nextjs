import type {
  GlobalDashboardStatsEntity,
  GlobalRecentActivityEntity,
  ShopPerformanceSummaryEntity,
} from '@/src/domain/entities/dashboard/global-dashboard.entity';
import { GlobalDashboardError } from '@/src/domain/errors/global-dashboard-error';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { GlobalDashboardRepository } from '@/src/domain/repositories/dashboard/global-dashboard-repository';
import type { DatabaseDataSource } from '@/src/domain/interfaces/datasources/database-datasource';
import { GlobalDashboardMapper } from '@/src/infrastructure/mappers/dashboard/global-dashboard-mapper';
import type {
  GlobalDashboardStatsSchema,
  GlobalRecentActivitySchema,
  ShopPerformanceSummarySchema,
} from '@/src/infrastructure/schemas/dashboard/global-dashboard.schema';
import { StandardRepository } from '../base/standard-repository';

/**
 * Supabase Global Dashboard Repository
 * Implementation of GlobalDashboardRepository using Supabase
 * Following Clean Architecture and SOLID principles
 */
export class SupabaseGlobalDashboardRepository extends StandardRepository implements GlobalDashboardRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, 'GlobalDashboard');
  }

  async getGlobalStats(profileId: string): Promise<GlobalDashboardStatsEntity> {
    try {
      this.logger.info('SupabaseGlobalDashboardRepository: Getting global stats', {
        profileId,
      });

      // Call RPC function to get global stats
      const result = await this.dataSource.callRpc<GlobalDashboardStatsSchema>(
        'get_global_dashboard_stats',
        { p_profile_id: profileId }
      );

      if (!result || typeof result !== 'object') {
        throw GlobalDashboardError.notFound('Global dashboard stats not found');
      }

      const stats = GlobalDashboardMapper.statsToEntity(result);

      this.logger.info('SupabaseGlobalDashboardRepository: Successfully retrieved global stats', {
        profileId,
        totalShops: stats.totalShops,
      });

      return stats;
    } catch (error) {
      this.logger.error('SupabaseGlobalDashboardRepository: Error getting global stats', error);
      
      if (error instanceof GlobalDashboardError) {
        throw error;
      }
      
      throw GlobalDashboardError.databaseError(
        'Failed to get global stats from database',
        error
      );
    }
  }

  async getRecentActivities(
    profileId: string,
    limit: number = 10
  ): Promise<GlobalRecentActivityEntity[]> {
    try {
      this.logger.info('SupabaseGlobalDashboardRepository: Getting recent activities', {
        profileId,
        limit,
      });

      // Call RPC function to get recent activities
      const result = await this.dataSource.callRpc<GlobalRecentActivitySchema[]>(
        'get_global_recent_activities',
        {
          p_profile_id: profileId,
          p_limit: limit,
        }
      );

      if (!Array.isArray(result)) {
        this.logger.warn('SupabaseGlobalDashboardRepository: No activities found', {
          profileId,
        });
        return [];
      }

      const activities = result.map(activity =>
        GlobalDashboardMapper.activityToEntity(activity)
      );

      this.logger.info('SupabaseGlobalDashboardRepository: Successfully retrieved activities', {
        profileId,
        count: activities.length,
      });

      return activities;
    } catch (error) {
      this.logger.error(
        'SupabaseGlobalDashboardRepository: Error getting recent activities',
        error
      );
      
      if (error instanceof GlobalDashboardError) {
        throw error;
      }
      
      throw GlobalDashboardError.databaseError(
        'Failed to get recent activities from database',
        error
      );
    }
  }

  async getShopPerformances(
    profileId: string
  ): Promise<ShopPerformanceSummaryEntity[]> {
    try {
      this.logger.info('SupabaseGlobalDashboardRepository: Getting shop performances', {
        profileId,
      });

      // Call RPC function to get shop performances
      const result = await this.dataSource.callRpc<ShopPerformanceSummarySchema[]>(
        'get_shop_performances',
        { p_profile_id: profileId }
      );

      if (!Array.isArray(result)) {
        this.logger.warn('SupabaseGlobalDashboardRepository: No shop performances found', {
          profileId,
        });
        return [];
      }

      const performances = result.map(perf =>
        GlobalDashboardMapper.performanceToEntity(perf)
      );

      this.logger.info(
        'SupabaseGlobalDashboardRepository: Successfully retrieved shop performances',
        {
          profileId,
          count: performances.length,
        }
      );

      return performances;
    } catch (error) {
      this.logger.error(
        'SupabaseGlobalDashboardRepository: Error getting shop performances',
        error
      );
      
      if (error instanceof GlobalDashboardError) {
        throw error;
      }
      
      throw GlobalDashboardError.databaseError(
        'Failed to get shop performances from database',
        error
      );
    }
  }

  async getGlobalDashboardData(
    profileId: string,
    activityLimit: number = 10
  ): Promise<{
    stats: GlobalDashboardStatsEntity;
    recentActivities: GlobalRecentActivityEntity[];
    shopPerformances: ShopPerformanceSummaryEntity[];
  }> {
    try {
      this.logger.info('SupabaseGlobalDashboardRepository: Getting complete dashboard data', {
        profileId,
        activityLimit,
      });

      // Execute all queries in parallel for better performance
      const [stats, recentActivities, shopPerformances] = await Promise.all([
        this.getGlobalStats(profileId),
        this.getRecentActivities(profileId, activityLimit),
        this.getShopPerformances(profileId),
      ]);

      this.logger.info(
        'SupabaseGlobalDashboardRepository: Successfully retrieved complete dashboard data',
        {
          profileId,
          totalShops: stats.totalShops,
          activitiesCount: recentActivities.length,
          shopsCount: shopPerformances.length,
        }
      );

      return {
        stats,
        recentActivities,
        shopPerformances,
      };
    } catch (error) {
      this.logger.error(
        'SupabaseGlobalDashboardRepository: Error getting complete dashboard data',
        error
      );
      
      if (error instanceof GlobalDashboardError) {
        throw error;
      }
      
      throw GlobalDashboardError.databaseError(
        'Failed to get complete dashboard data from database',
        error
      );
    }
  }
}
