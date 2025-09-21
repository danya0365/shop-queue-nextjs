/**
 * Database schema types for customer queue status
 * These types match the actual database structure
 */

/**
 * Customer queue status database schema
 */
export interface CustomerQueueStatusSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  queue_number: string;
  status: "waiting" | "confirmed" | "serving" | "completed" | "cancelled";
  customer_name: string;
  customer_phone: string;
  estimated_wait_time: number;
  position: number;
  special_requests: string | null;
  total_price: number;
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
  duration: number;
  category: string | null;
}

/**
 * Queue progress database schema
 */
export interface QueueProgressSchema {
  shop_id: string;
  current_number: string;
  total_ahead: number;
  average_service_time: number;
  estimated_call_time: string;
}
