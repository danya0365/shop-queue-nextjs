/**
 * Database schema types for queue join
 * These types match the actual database structure
 */

/**
 * Service option database schema
 */
export interface ServiceOptionSchema {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  estimated_time: number;
  category: string;
  available: boolean;
  icon: string;
  created_at: string;
  updated_at: string;
}

/**
 * Shop queue info database schema (from shops table and queue stats)
 */
export interface ShopQueueInfoSchema {
  shop_id: string;
  shop_name: string;
  is_accepting_queues: boolean;
  max_queue_length: number;
  current_queue_length: number;
  estimated_wait_time: number;
}

/**
 * Queue join database schema
 */
export interface QueueJoinSchema {
  id?: string;
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  priority: "normal" | "urgent";
  status: "waiting" | "serving" | "completed" | "cancelled";
  queue_number?: string;
  special_requests?: string;
  estimated_wait_time?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Queue service database schema (for joining queue with services)
 */
export interface QueueServiceSchema {
  id: string;
  queue_id: string;
  service_id: string;
  service_name: string;
  price: number;
  quantity: number;
  estimated_time: number;
}

/**
 * Join queue result database schema
 */
export interface JoinQueueResultSchema {
  success: boolean;
  queue_number?: string;
  estimated_wait_time?: number;
  message?: string;
  error?: string;
}
