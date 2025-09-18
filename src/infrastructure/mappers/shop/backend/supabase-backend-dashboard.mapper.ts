import {
  DashboardStatsEntity,
  PopularServiceEntity,
  QueueStatusDistributionEntity,
  RecentActivityEntity,
} from "@/src/domain/entities/shop/backend/backend-dashboard.entity";
import {
  DashboardStatsByShopViewSchema,
  PopularServiceSchema,
  QueueStatusDistributionSchema,
  RecentActivitySchema,
} from "@/src/infrastructure/schemas/shop/backend/dashboard.schema";

/**
 * Mapper for dashboard data between domain entities and database schemas
 * Following Clean Architecture principles for infrastructure mappers
 */
export class SupabaseShopBackendDashboardMapper {
  /**
   * Map dashboard stats schema to domain entity
   * @param schema Dashboard stats schema from database
   * @returns Dashboard stats domain entity
   */
  static statsToEntity(
    schema: DashboardStatsByShopViewSchema
  ): DashboardStatsEntity {
    return {
      shopId: schema.shop_id,
      shopName: schema.shop_name,
      shopSlug: schema.shop_slug,
      shopStatus: schema.shop_status,
      totalQueues: schema.total_queues ?? 0,
      totalCustomers: schema.total_customers ?? 0,
      totalEmployees: schema.total_employees ?? 0,
      totalServices: schema.total_services ?? 0,
      totalRevenue: schema.total_revenue ?? 0,
      totalReviews: schema.total_reviews ?? 0,
      totalPointsEarned: schema.total_points_earned ?? 0,
      totalPointsRedeemed: schema.total_points_redeemed ?? 0,
      activeCustomers: schema.active_customers ?? 0,
      activeEmployees: schema.active_employees ?? 0,
      activeQueues: schema.active_queues ?? 0,
      activePromotions: schema.active_promotions ?? 0,
      activeRewards: schema.active_rewards ?? 0,
      availableServices: schema.available_services ?? 0,
      employeesOnDuty: schema.employees_on_duty ?? 0,
      waitingQueues: schema.waiting_queues ?? 0,
      servingQueues: schema.serving_queues ?? 0,
      completedQueuesToday: schema.completed_queues_today ?? 0,
      customersVisitedToday: schema.customers_visited_today ?? 0,
      revenueToday: schema.revenue_today ?? 0,
      promotionsUsedToday: schema.promotions_used_today ?? 0,
      rewardUsagesToday: schema.reward_usages_today ?? 0,
      paidPayments: schema.paid_payments ?? 0,
      pendingPayments: schema.pending_payments ?? 0,
      averageRating: schema.average_rating ?? 0,
      averageWaitTime: schema.average_wait_time_minutes ?? 0,
      averageServiceTime: schema.average_service_time_minutes ?? 0,
      statsGeneratedAt: schema.stats_generated_at,
    };
  }

  /**
   * Map queue distribution schema to domain entity
   * @param schema Queue distribution schema from database
   * @returns Queue distribution domain entity
   */
  static queueDistributionToEntity(
    schema: QueueStatusDistributionSchema
  ): QueueStatusDistributionEntity {
    return {
      waiting: schema.waiting,
      serving: schema.serving,
      completed: schema.completed,
      cancelled: schema.cancelled,
      noShow: schema.no_show,
    };
  }

  /**
   * Map popular service schema to domain entity
   * @param schema Popular service schema from database
   * @returns Popular service domain entity
   */
  static popularServiceToEntity(
    schema: PopularServiceSchema
  ): PopularServiceEntity {
    return {
      id: schema.id,
      name: schema.name,
      queueCount: schema.queue_count,
      revenue: schema.revenue,
      category: schema.category,
    };
  }

  /**
   * Map recent activity schema to domain entity
   * @param schema Recent activity schema from database
   * @returns Recent activity domain entity
   */
  static recentActivityToEntity(
    schema: RecentActivitySchema
  ): RecentActivityEntity {
    return {
      id: schema.id,
      type: schema.type as RecentActivityEntity["type"],
      title: schema.title,
      description: schema.description,
      created_at: schema.created_at,
      metadata: schema.metadata,
    };
  }
}
