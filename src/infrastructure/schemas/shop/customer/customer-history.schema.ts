/**
 * Database schema types for customer history
 * These types match the actual database structure
 */

/**
 * Customer queue history database schema
 */
export interface CustomerQueueHistorySchema {
  id: string;
  shop_id: string;
  customer_id: string;
  queue_number: string;
  shop_name: string;
  status: "completed" | "cancelled" | "no_show";
  queue_date: string;
  queue_time: string;
  completed_at: string | null;
  wait_time: number | null;
  service_time: number | null;
  total_amount: number;
  rating: number | null;
  feedback: string | null;
  employee_name: string | null;
  payment_method: "cash" | "card" | "qr" | "transfer" | null;
  created_at: string;
  updated_at: string;
  // Joined data
  services?: CustomerQueueServiceSchema[];
}

/**
 * Customer queue service database schema
 */
export interface CustomerQueueServiceSchema {
  id: string;
  queue_id: string;
  service_id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Customer stats database schema
 */
export interface CustomerStatsSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  total_queues: number;
  completed_queues: number;
  cancelled_queues: number;
  total_spent: number;
  average_rating: number;
  favorite_service: string;
  member_since: string;
  created_at: string;
  updated_at: string;
}

/**
 * Customer info database schema
 */
export interface CustomerInfoSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  customer_name: string;
  member_since: string;
  created_at: string;
  updated_at: string;
}
