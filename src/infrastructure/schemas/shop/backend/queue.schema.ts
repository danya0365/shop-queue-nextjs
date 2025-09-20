/**
 * Database schema types for queues
 * These types match the actual database structure
 */

/**
 * Queue database schema
 */
export interface QueueSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  queue_number: string;
  status: string;
  priority: string;
  estimated_duration: number;
  estimated_call_time: string | null;
  served_by_employee_id: string | null;
  actual_wait_time: number | null;
  note: string | null;
  feedback: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
  served_at: string | null;
  completed_at: string | null;
  // Joined data
  customer_name?: string;
  customer_phone?: string;
  shop_name?: string;
  // Calculated fields
  queue_services?: QueueServiceSchema[];
}

/**
 * Queue service database schema
 */
export interface QueueServiceSchema {
  id: string;
  queue_id: string;
  service_id: string;
  quantity: number;
  price: number;
  // Joined data
  services?: ServiceSchema;
}

/**
 * Service database schema
 */
export interface ServiceSchema {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  estimated_duration: number | null;
  category: string | null;
  is_available: boolean | null;
  icon: string | null;
  popularity_rank: number | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Queue stats database schema
 * Matches the queue_stats_by_shop_view database view structure
 */
export interface QueueStatsSchema {
  // Today's statistics
  total_queue_today: number;
  waiting_queue_today: number;
  confirmed_queue_today: number;
  serving_queue_today: number;
  in_progress_queue_today: number;
  total_completed_today: number;
  total_cancelled_today: number;

  // All-time statistics
  all_queue_total: number;
  all_waiting_queue: number;
  all_confirmed_queue: number;
  all_serving_queue: number;
  all_in_progress_queue: number;
  all_completed_total: number;
  all_cancelled_total: number;

  // Performance metrics
  avg_wait_time_minutes: number;

  // Shop-specific data (optional)
  shop_id?: string;
}
