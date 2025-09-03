import {
  DashboardStatsEntity,
  PopularServiceEntity,
  QueueStatusDistributionEntity,
  RecentActivityEntity
} from "../../../domain/entities/backend/backend-dashboard.entity";
import { DatabaseDataSource, QueryOptions, SortDirection } from "../../../domain/interfaces/datasources/database-datasource";
import { Logger } from "../../../domain/interfaces/logger";
import {
  BackendDashboardError,
  BackendDashboardErrorType,
  BackendDashboardRepository
} from "../../../domain/repositories/backend/backend-dashboard-repository";
import { SupabaseBackendDashboardMapper } from "../../mappers/backend/supabase-backend-dashboard.mapper";
import {
  DashboardStatsSchema,
  PopularServiceSchema,
  QueueStatusDistributionSchema,
  RecentActivitySchema
} from "../../schemas/backend/dashboard.schema";
import { EmployeeStatsSchema } from "../../schemas/backend/employee.schema";
import { BackendRepository } from "../base/backend-repository";

type DashboardStatsSchemaRecord = Record<string, unknown> & DashboardStatsSchema;
type EmployeeStatsSchemaRecord = Record<string, unknown> & EmployeeStatsSchema;
type PopularServiceSchemaRecord = Record<string, unknown> & PopularServiceSchema;
type QueueStatusDistributionSchemaRecord = Record<string, unknown> & QueueStatusDistributionSchema;
type RecentActivitySchemaRecord = Record<string, unknown> & RecentActivitySchema;

/**
 * Supabase implementation of the dashboard repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseBackendDashboardRepository extends BackendRepository implements BackendDashboardRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendDashboard");
  }

  /**
   * Get dashboard statistics from database
   * @returns Dashboard statistics entity
   */
  async getDashboardStats(): Promise<DashboardStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for stats view
      };

      // Assuming a view exists for dashboard statistics
      const statsData = await this.dataSource.getAdvanced<DashboardStatsSchemaRecord>(
        'dashboard_stats_view',
        queryOptions
      );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalShops: 0,
          totalQueues: 0,
          totalCustomers: 0,
          totalEmployees: 0,
          activeQueues: 0,
          completedQueuesToday: 0,
          totalRevenue: 0,
          averageWaitTime: 0
        };
      }

      // Map database results to domain entity
      return SupabaseBackendDashboardMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof BackendDashboardError) {
        throw error;
      }

      this.logger.error('Error in getDashboardStats', { error });
      throw new BackendDashboardError(
        BackendDashboardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching dashboard statistics',
        'getDashboardStats',
        {},
        error
      );
    }
  }

  /**
   * Get queue status distribution from database
   * @returns Queue status distribution entity
   */
  async getQueueDistribution(): Promise<QueueStatusDistributionEntity> {
    try {
      // Use getAdvanced to fetch queue distribution data
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for distribution view
      };

      // Assuming a view exists for queue distribution
      const distributionData = await this.dataSource.getAdvanced<QueueStatusDistributionSchemaRecord>(
        'queue_distribution_view',
        queryOptions
      );

      if (!distributionData || distributionData.length === 0) {
        // If no distribution data is found, return default values
        return {
          waiting: 0,
          serving: 0,
          completed: 0,
          cancelled: 0,
          noShow: 0
        };
      }

      // Map database results to domain entity
      return SupabaseBackendDashboardMapper.queueDistributionToEntity(distributionData[0]);
    } catch (error) {
      if (error instanceof BackendDashboardError) {
        throw error;
      }

      this.logger.error('Error in getQueueDistribution', { error });
      throw new BackendDashboardError(
        BackendDashboardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching queue distribution',
        'getQueueDistribution',
        {},
        error
      );
    }
  }

  /**
   * Get popular services from database
   * @param limit Number of services to return (default: 5)
   * @returns Array of popular service entities
   */
  async getPopularServices(limit: number = 5): Promise<PopularServiceEntity[]> {
    try {
      // Use getAdvanced to fetch popular services data
      const queryOptions: QueryOptions = {
        select: ['*'],
        sort: [{ field: 'queue_count', direction: SortDirection.DESC }],
        pagination: {
          limit
        }
      };

      // Assuming a view exists for popular services
      const servicesData = await this.dataSource.getAdvanced<PopularServiceSchemaRecord>(
        'popular_services_view',
        queryOptions
      );

      if (!servicesData || servicesData.length === 0) {
        return [];
      }

      // Map database results to domain entities
      return servicesData.map(service => SupabaseBackendDashboardMapper.popularServiceToEntity(service));
    } catch (error) {
      if (error instanceof BackendDashboardError) {
        throw error;
      }

      this.logger.error('Error in getPopularServices', { error, limit });
      throw new BackendDashboardError(
        BackendDashboardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching popular services',
        'getPopularServices',
        { limit },
        error
      );
    }
  }

  /**
   * Get recent activities from database
   * @param limit Number of activities to return (default: 5)
   * @returns Array of recent activity entities
   */
  async getRecentActivities(limit: number = 5): Promise<RecentActivityEntity[]> {
    try {
      // Use getAdvanced to fetch recent activities data
      const queryOptions: QueryOptions = {
        select: ['*'],
        sort: [{ field: 'timestamp', direction: SortDirection.DESC }],
        pagination: {
          limit
        }
      };

      // Assuming a view or table exists for recent activities
      const activitiesData = await this.dataSource.getAdvanced<RecentActivitySchemaRecord>(
        'recent_activities',
        queryOptions
      );

      if (!activitiesData || activitiesData.length === 0) {
        return [];
      }

      // Map database results to domain entities
      return activitiesData.map(activity => SupabaseBackendDashboardMapper.recentActivityToEntity(activity));
    } catch (error) {
      if (error instanceof BackendDashboardError) {
        throw error;
      }

      this.logger.error('Error in getRecentActivities', { error, limit });
      throw new BackendDashboardError(
        BackendDashboardErrorType.UNKNOWN,
        'An unexpected error occurred while fetching recent activities',
        'getRecentActivities',
        { limit },
        error
      );
    }
  }
}
