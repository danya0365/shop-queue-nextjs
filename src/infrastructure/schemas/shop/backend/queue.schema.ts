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
  actual_wait_time?: number;
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
 */
export interface QueueStatsSchema {
  total_queues: number;
  waiting_queues: number;
  in_progress_queues: number;
  completed_today: number;
  cancelled_today: number;
  average_wait_time: number;
}
