export interface CustomerDTO {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  total_queues: number; // joined from queue history
  total_points: number; // joined from customer points
  membership_tier: 'regular' | 'bronze' | 'silver' | 'gold' | 'platinum';  // joined from customer points
  last_visit?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerStatsDTO {
  total_customers: number;
  new_customers_this_month: number;
  active_customers_today: number;
  gold_members: number;
  silver_members: number;
  bronze_members: number;
  regular_members: number;
}

export interface CustomersDataDTO {
  customers: CustomerDTO[];
  stats: CustomerStatsDTO;
  total_count: number;
  current_page: number;
  per_page: number;
}
