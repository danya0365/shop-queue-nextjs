/**
 * Database schemas for dashboard data
 * Following Clean Architecture principles for infrastructure schemas
 */

export interface DashboardStatsSchema {
  total_shops: number;
  total_queues: number;
  total_customers: number;
  total_employees: number;
  active_queues: number;
  completed_queues_today: number;
  total_revenue: number;
  average_wait_time: number;
}

export interface RecentActivitySchema {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface QueueStatusDistributionSchema {
  waiting: number;
  serving: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

export interface PopularServiceSchema {
  id: string;
  name: string;
  queue_count: number;
  revenue: number;
  category: string;
}
