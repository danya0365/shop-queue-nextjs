import type {
  GlobalDashboardStatsEntity,
  GlobalRecentActivityEntity,
  ShopPerformanceSummaryEntity,
} from '@/src/domain/entities/dashboard/global-dashboard.entity';
import type {
  GlobalDashboardStatsSchema,
  GlobalRecentActivitySchema,
  ShopPerformanceSummarySchema,
} from '@/src/infrastructure/schemas/dashboard/global-dashboard.schema';

/**
 * Global Dashboard Mapper
 * Maps between database schemas and domain entities
 */
export class GlobalDashboardMapper {
  /**
   * Map Global Dashboard Stats Schema to Entity
   */
  static statsToEntity(schema: GlobalDashboardStatsSchema): GlobalDashboardStatsEntity {
    return {
      totalShops: schema.total_shops,
      activeShops: schema.active_shops,
      inactiveShops: schema.inactive_shops,
      totalQueuesAllTime: schema.total_queues_all_time,
      activeQueues: schema.active_queues,
      waitingQueues: schema.waiting_queues,
      confirmedQueues: schema.confirmed_queues,
      servingQueues: schema.serving_queues,
      completedQueuesToday: schema.completed_queues_today,
      cancelledQueuesToday: schema.cancelled_queues_today,
      pendingQueues: schema.pending_queues,
      todayRevenue: schema.today_revenue,
      yesterdayRevenue: schema.yesterday_revenue,
      thisWeekRevenue: schema.this_week_revenue,
      thisMonthRevenue: schema.this_month_revenue,
      revenueChange: schema.revenue_change,
      revenueChangeType: schema.revenue_change_type,
      servedToday: schema.served_today,
      servedYesterday: schema.served_yesterday,
      servedChange: schema.served_change,
      servedChangeType: schema.served_change_type,
      averageWaitTime: schema.average_wait_time,
      averageWaitTimeYesterday: schema.average_wait_time_yesterday,
      waitTimeChange: schema.wait_time_change,
      waitTimeChangeType: schema.wait_time_change_type,
      totalEmployees: schema.total_employees,
      activeEmployees: schema.active_employees,
      onlineEmployees: schema.online_employees,
      servingEmployees: schema.serving_employees,
      totalCustomers: schema.total_customers,
      newCustomersToday: schema.new_customers_today,
      returningCustomersToday: schema.returning_customers_today,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Map Global Recent Activity Schema to Entity
   */
  static activityToEntity(schema: GlobalRecentActivitySchema): GlobalRecentActivityEntity {
    return {
      id: schema.id,
      shopId: schema.shop_id,
      shopName: schema.shop_name,
      type: schema.type as GlobalRecentActivityEntity['type'],
      title: schema.title,
      description: schema.description,
      metadata: schema.metadata,
      createdAt: schema.created_at,
    };
  }

  /**
   * Map Shop Performance Summary Schema to Entity
   */
  static performanceToEntity(
    schema: ShopPerformanceSummarySchema
  ): ShopPerformanceSummaryEntity {
    return {
      shopId: schema.shop_id,
      shopName: schema.shop_name,
      todayQueues: schema.today_queues,
      todayRevenue: schema.today_revenue,
      todayServed: schema.today_served,
      averageWaitTime: schema.average_wait_time,
      activeQueues: schema.active_queues,
      completionRate: schema.completion_rate,
      status: schema.status as 'active' | 'inactive',
    };
  }
}
