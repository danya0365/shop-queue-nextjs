export interface QueueDTO {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  shop_id: string;
  shop_name: string;
  service_id: string;
  service_name: string;
  queue_number: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'normal' | 'high' | 'urgent';
  estimated_wait_time: number; // in minutes
  actual_wait_time?: number; // in minutes
  notes?: string;
  created_at: string;
  updated_at: string;
  called_at?: string;
  completed_at?: string;
}

export interface QueueStatsDTO {
  total_queues: number;
  waiting_queues: number;
  in_progress_queues: number;
  completed_today: number;
  cancelled_today: number;
  average_wait_time: number;
}

export interface QueuesDataDTO {
  queues: QueueDTO[];
  stats: QueueStatsDTO;
  total_count: number;
  current_page: number;
  per_page: number;
}
