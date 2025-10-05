/**
 * Global Dashboard Schema Types
 * Schema definitions for database queries
 */

/**
 * Global Dashboard Stats Schema
 * Return type from get_global_dashboard_stats RPC function
 */
export interface GlobalDashboardStatsSchema {
  total_shops: number;
  active_shops: number;
  inactive_shops: number;
  total_queues_all_time: number;
  active_queues: number;
  waiting_queues: number;
  confirmed_queues: number;
  serving_queues: number;
  completed_queues_today: number;
  cancelled_queues_today: number;
  pending_queues: number;
  today_revenue: number;
  yesterday_revenue: number;
  this_week_revenue: number;
  this_month_revenue: number;
  revenue_change: number;
  revenue_change_type: 'increase' | 'decrease' | 'stable';
  served_today: number;
  served_yesterday: number;
  served_change: number;
  served_change_type: 'increase' | 'decrease' | 'stable';
  average_wait_time: number;
  average_wait_time_yesterday: number;
  wait_time_change: number;
  wait_time_change_type: 'increase' | 'decrease' | 'stable';
  total_employees: number;
  active_employees: number;
  online_employees: number;
  serving_employees: number;
  total_customers: number;
  new_customers_today: number;
  returning_customers_today: number;
}

/**
 * Global Recent Activity Schema
 * Return type from get_global_recent_activities RPC function
 */
export interface GlobalRecentActivitySchema {
  id: string;
  shop_id: string;
  shop_name: string;
  type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Shop Performance Summary Schema
 * Return type from get_shop_performances RPC function
 */
export interface ShopPerformanceSummarySchema {
  shop_id: string;
  shop_name: string;
  today_queues: number;
  today_revenue: number;
  today_served: number;
  average_wait_time: number;
  active_queues: number;
  completion_rate: number;
  status: string;
}
