import {
  DashboardStatsEntity,
  PopularServiceEntity,
  QueueStatusDistributionEntity,
  RecentActivityEntity,
} from "@/src/domain/entities/shop/backend/backend-dashboard.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import {
  ShopBackendDashboardError,
  ShopBackendDashboardErrorType,
  ShopBackendDashboardRepository,
} from "@/src/domain/repositories/shop/backend/backend-dashboard-repository";
import { SupabaseShopBackendDashboardMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-dashboard.mapper";
import {
  DashboardStatsByShopViewSchema,
  PopularServiceSchema,
  QueueStatusDistributionSchema,
  RecentActivitySchema,
} from "@/src/infrastructure/schemas/shop/backend/dashboard.schema";
import { StandardRepository } from "../../base/standard-repository";

type PopularServiceSchemaRecord = Record<string, unknown> &
  PopularServiceSchema;
type QueueStatusDistributionSchemaRecord = Record<string, unknown> &
  QueueStatusDistributionSchema;
type RecentActivitySchemaRecord = Record<string, unknown> &
  RecentActivitySchema;

/**
 * Supabase implementation of the dashboard repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendDashboardRepository
  extends StandardRepository
  implements ShopBackendDashboardRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "ShopBackendDashboard");
  }

  /**
   * Get dashboard statistics from database
   * @param shopId The shop ID
   * @returns Dashboard statistics entity
   */
  async getDashboardStats(shopId: string): Promise<DashboardStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
        ],
      };

      // Assuming a view exists for dashboard statistics
      const statsData =
        await this.dataSource.getAdvanced<DashboardStatsByShopViewSchema>(
          "dashboard_stats_by_shop_view",
          queryOptions
        );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          shopId: null,
          shopName: null,
          shopSlug: null,
          shopStatus: null,
          totalQueues: 0,
          totalCustomers: 0,
          totalEmployees: 0,
          totalServices: 0,
          totalRevenue: 0,
          totalReviews: 0,
          totalPointsEarned: 0,
          totalPointsRedeemed: 0,
          activeCustomers: 0,
          activeEmployees: 0,
          activeQueues: 0,
          activePromotions: 0,
          activeRewards: 0,
          availableServices: 0,
          employeesOnDuty: 0,
          waitingQueues: 0,
          servingQueues: 0,
          completedQueuesToday: 0,
          customersVisitedToday: 0,
          revenueToday: 0,
          promotionsUsedToday: 0,
          rewardUsagesToday: 0,
          paidPayments: 0,
          pendingPayments: 0,
          averageRating: 0,
          averageWaitTime: 0,
          averageServiceTime: 0,
          statsGeneratedAt: null,
        };
      }

      // Map database results to domain entity
      return SupabaseShopBackendDashboardMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof ShopBackendDashboardError) {
        throw error;
      }

      this.logger.error("Error in getDashboardStats", { error, shopId });
      throw new ShopBackendDashboardError(
        ShopBackendDashboardErrorType.UNKNOWN,
        "An unexpected error occurred while fetching dashboard statistics",
        "getDashboardStats",
        { shopId },
        error
      );
    }
  }

  /**
   * Get queue status distribution from database
   * @param shopId The shop ID
   * @returns Queue status distribution entity
   */
  async getQueueDistribution(
    shopId: string
  ): Promise<QueueStatusDistributionEntity> {
    try {
      // Use getAdvanced to fetch queue distribution data
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
        ],
      };

      // Assuming a view exists for queue distribution
      const distributionData =
        await this.dataSource.getAdvanced<QueueStatusDistributionSchemaRecord>(
          "queue_status_distribution_view",
          queryOptions
        );

      if (!distributionData || distributionData.length === 0) {
        // If no distribution data is found, return default values
        return {
          waiting: 0,
          serving: 0,
          completed: 0,
          cancelled: 0,
          noShow: 0,
        };
      }

      // Map database results to domain entity
      return SupabaseShopBackendDashboardMapper.queueDistributionToEntity(
        distributionData[0]
      );
    } catch (error) {
      if (error instanceof ShopBackendDashboardError) {
        throw error;
      }

      this.logger.error("Error in getQueueDistribution", { error, shopId });
      throw new ShopBackendDashboardError(
        ShopBackendDashboardErrorType.UNKNOWN,
        "An unexpected error occurred while fetching queue distribution",
        "getQueueDistribution",
        { shopId },
        error
      );
    }
  }

  /**
   * Get popular services from database
   * @param shopId The shop ID
   * @param limit Number of services to return (default: 5)
   * @returns Array of popular service entities
   */
  async getPopularServices(
    shopId: string,
    limit: number = 5
  ): Promise<PopularServiceEntity[]> {
    try {
      // Use getAdvanced to fetch popular services data
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
        ],
        sort: [{ field: "queue_count", direction: SortDirection.DESC }],
        pagination: {
          limit,
        },
      };

      // Assuming a view exists for popular services
      const servicesData =
        await this.dataSource.getAdvanced<PopularServiceSchemaRecord>(
          "popular_services_view",
          queryOptions
        );

      if (!servicesData || servicesData.length === 0) {
        return [];
      }

      // Map database results to domain entities
      return servicesData.map((service) =>
        SupabaseShopBackendDashboardMapper.popularServiceToEntity(service)
      );
    } catch (error) {
      if (error instanceof ShopBackendDashboardError) {
        throw error;
      }

      this.logger.error("Error in getPopularServices", {
        error,
        shopId,
        limit,
      });
      throw new ShopBackendDashboardError(
        ShopBackendDashboardErrorType.UNKNOWN,
        "An unexpected error occurred while fetching popular services",
        "getPopularServices",
        { shopId, limit },
        error
      );
    }
  }

  /**
   * Get recent activities from database
   * @param shopId The shop ID
   * @param limit Number of activities to return (default: 5)
   * @returns Array of recent activity entities
   */
  async getRecentActivities(
    shopId: string,
    limit: number = 5
  ): Promise<RecentActivityEntity[]> {
    try {
      // Use getAdvanced to fetch recent activities data
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
        ],
        sort: [{ field: "created_at", direction: SortDirection.DESC }],
        pagination: {
          limit,
        },
      };

      // Assuming a view or table exists for recent activities
      const activitiesData =
        await this.dataSource.getAdvanced<RecentActivitySchemaRecord>(
          "shop_activity_log",
          queryOptions
        );

      if (!activitiesData || activitiesData.length === 0) {
        return [];
      }

      // Map database results to domain entities
      return activitiesData.map((activity) =>
        SupabaseShopBackendDashboardMapper.recentActivityToEntity(activity)
      );
    } catch (error) {
      if (error instanceof ShopBackendDashboardError) {
        throw error;
      }

      this.logger.error("Error in getRecentActivities", {
        error,
        shopId,
        limit,
      });
      throw new ShopBackendDashboardError(
        ShopBackendDashboardErrorType.UNKNOWN,
        "An unexpected error occurred while fetching recent activities",
        "getRecentActivities",
        { shopId, limit },
        error
      );
    }
  }

  /**
   * Get queue statistics
   * @param shopId The shop ID
   * @returns Queue statistics
   */
  async getQueueStats(shopId: string): Promise<{
    waiting: number;
    confirmed: number;
    serving: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
        ],
      };

      // Assuming a view exists for queue statistics
      const queueStatsData = await this.dataSource.getAdvanced<{
        all_waiting_queue: number;
        all_confirmed_queue: number;
        all_serving_queue: number;
        all_completed_total: number;
        all_cancelled_total: number;
      }>("queue_stats_by_shop_view", queryOptions);

      if (!queueStatsData || queueStatsData.length === 0) {
        return {
          waiting: 0,
          confirmed: 0,
          serving: 0,
          completed: 0,
          cancelled: 0,
        };
      }

      return {
        waiting: queueStatsData[0].all_waiting_queue,
        confirmed: queueStatsData[0].all_confirmed_queue,
        serving: queueStatsData[0].all_serving_queue,
        completed: queueStatsData[0].all_completed_total,
        cancelled: queueStatsData[0].all_cancelled_total,
      };
    } catch (error) {
      if (error instanceof ShopBackendDashboardError) {
        throw error;
      }

      this.logger.error("Error in getQueueStats", { error, shopId });
      throw new ShopBackendDashboardError(
        ShopBackendDashboardErrorType.UNKNOWN,
        "An unexpected error occurred while fetching queue statistics",
        "getQueueStats",
        { shopId },
        error
      );
    }
  }

  /**
   * Get revenue statistics
   * @param shopId The shop ID
   * @returns Revenue statistics
   */
  async getRevenueStats(shopId: string): Promise<{
    today: number;
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  }> {
    return {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0,
    };

    try {
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
        ],
      };

      // Assuming a view exists for revenue statistics
      const revenueStatsData = await this.dataSource.getAdvanced<{
        today: number;
        this_week: number;
        this_month: number;
        last_month: number;
        growth: number;
      }>("revenue_stats_view", queryOptions);

      if (!revenueStatsData || revenueStatsData.length === 0) {
        return {
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          lastMonth: 0,
          growth: 0,
        };
      }

      const data = revenueStatsData[0];
      return {
        today: data.today,
        thisWeek: data.this_week,
        thisMonth: data.this_month,
        lastMonth: data.last_month,
        growth: data.growth,
      };
    } catch (error) {
      if (error instanceof ShopBackendDashboardError) {
        throw error;
      }

      this.logger.error("Error in getRevenueStats", { error, shopId });
      throw new ShopBackendDashboardError(
        ShopBackendDashboardErrorType.UNKNOWN,
        "An unexpected error occurred while fetching revenue statistics",
        "getRevenueStats",
        { shopId },
        error
      );
    }
  }

  /**
   * Get employee statistics
   * @param shopId The shop ID
   * @returns Employee statistics
   */
  async getEmployeeStats(shopId: string): Promise<{
    total: number;
    online: number;
    serving: number;
  }> {
    return {
      total: 0,
      online: 0,
      serving: 0,
    };
    try {
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
        ],
      };

      // Assuming a view exists for employee statistics
      const employeeStatsData = await this.dataSource.getAdvanced<{
        total: number;
        online: number;
        serving: number;
      }>("employee_stats_view", queryOptions);

      if (!employeeStatsData || employeeStatsData.length === 0) {
        return {
          total: 0,
          online: 0,
          serving: 0,
        };
      }

      return employeeStatsData[0];
    } catch (error) {
      if (error instanceof ShopBackendDashboardError) {
        throw error;
      }

      this.logger.error("Error in getEmployeeStats", { error, shopId });
      throw new ShopBackendDashboardError(
        ShopBackendDashboardErrorType.UNKNOWN,
        "An unexpected error occurred while fetching employee statistics",
        "getEmployeeStats",
        { shopId },
        error
      );
    }
  }

  /**
   * Get shop name
   * @param shopId The shop ID
   * @returns Shop name
   */
  async getShopName(shopId: string): Promise<string> {
    try {
      const queryOptions: QueryOptions = {
        select: ["name"],
        filters: [{ field: "id", operator: FilterOperator.EQ, value: shopId }],
      };

      // Query the shops table
      const shopData = await this.dataSource.getAdvanced<{
        name: string;
      }>("shops", queryOptions);

      if (!shopData || shopData.length === 0) {
        return "Unknown Shop";
      }

      return shopData[0].name;
    } catch (error) {
      if (error instanceof ShopBackendDashboardError) {
        throw error;
      }

      this.logger.error("Error in getShopName", { error, shopId });
      throw new ShopBackendDashboardError(
        ShopBackendDashboardErrorType.UNKNOWN,
        "An unexpected error occurred while fetching shop name",
        "getShopName",
        { shopId },
        error
      );
    }
  }
}
