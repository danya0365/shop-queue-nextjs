import type { Database } from "@/src/domain/types/supabase";

/**
 * Database schema types for customer queue status
 * These types match the RPC function return types
 */

/**
 * Customer queue status database schema from get_customer_queue_by_number RPC
 */
export interface CustomerQueueStatusSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  queue_number: string;
  status: Database["public"]["Enums"]["queue_status"];
  priority: Database["public"]["Enums"]["queue_priority"];
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
  cancelled_at: string | null;
  cancelled_reason: string | null;
  cancelled_note: string | null;
  customer_name: string;
  customer_phone: string | null;
  services: CustomerQueueServiceSchema[];
}

/**
 * Customer queue service database schema from RPC response
 */
export interface CustomerQueueServiceSchema {
  id: string;
  queue_id: string;
  service_id: string;
  service_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * Queue progress database schema from get_customer_queue_progress RPC
 */
export interface QueueProgressSchema {
  shop_id: string;
  current_number: string;
  total_ahead: number;
  average_service_time: number;
  estimated_call_time: string;
}
