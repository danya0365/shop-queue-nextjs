import { Database } from "@/src/domain/types/supabase";

/**
 * Database schemas for dashboard data
 * Following Clean Architecture principles for infrastructure schemas
 */

export type DashboardStatsByShopViewSchema =
  Database["public"]["Views"]["dashboard_stats_by_shop_view"]["Row"];

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
