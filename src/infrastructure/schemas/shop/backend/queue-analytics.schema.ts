/**
 * Database schema types for queue analytics
 * These types match the actual database structure
 */

/**
 * Queue analytics database schema
 */
export interface QueueAnalyticsSchema {
  id: string;
  shop_id: string;
  total_queues: number;
  completed_queues: number;
  cancelled_queues: number;
  no_show_queues: number;
  in_progress_queues: number;
  waiting_queues: number;
  average_wait_time: number; // in minutes
  average_service_time: number; // in minutes
  completion_rate: number; // percentage
  cancellation_rate: number; // percentage
  no_show_rate: number; // percentage
  date_from: string;
  date_to: string;
  created_at: string;
  updated_at: string;
}

/**
 * Queue time analytics database schema
 */
export interface QueueTimeAnalyticsSchema {
  id: string;
  shop_id: string;
  average_wait_time: number; // in minutes
  median_wait_time: number; // in minutes
  min_wait_time: number; // in minutes
  max_wait_time: number; // in minutes
  average_service_time: number; // in minutes
  median_service_time: number; // in minutes
  min_service_time: number; // in minutes
  max_service_time: number; // in minutes
  total_service_time: number; // in minutes
  date_from: string;
  date_to: string;
  created_at: string;
  updated_at: string;
}

/**
 * Queue peak hours database schema
 */
export interface QueuePeakHoursSchema {
  id: string;
  shop_id: string;
  hour: number; // 0-23
  total_queues: number;
  completed_queues: number;
  average_wait_time: number; // in minutes
  completion_rate: number; // percentage
  is_peak_hour: boolean;
  staffing_recommendation: string;
  date_from: string;
  date_to: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // Index signature to satisfy Record<string, unknown> constraint
}

/**
 * Queue service analytics database schema
 */
export interface QueueServiceAnalyticsSchema {
  id: string;
  shop_id: string;
  service_id: string;
  service_name: string;
  total_queues: number;
  completed_queues: number;
  average_wait_time: number; // in minutes
  average_service_time: number; // in minutes
  total_revenue: number;
  popularity_score: number; // calculated based on demand and completion rate
  date_from: string;
  date_to: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // Index signature to satisfy Record<string, unknown> constraint
}

/**
 * Queue analytics cache schema
 */
export interface QueueAnalyticsCacheSchema {
  id: string;
  shop_id: string;
  analytics_data: Record<string, unknown>; // JSON stored analytics data
  cache_key: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}
