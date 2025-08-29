export interface ShopDTO {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  category_id: string;
  category_name: string;
  owner_id: string;
  owner_name: string;
  status: 'active' | 'inactive' | 'pending';
  opening_hours: Record<string, { open: string; close: string; is_open: boolean }>;
  queue_count: number;
  total_services: number;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface ShopStatsDTO {
  total_shops: number;
  active_shops: number;
  pending_approval: number;
  new_this_month: number;
}

export interface ShopsDataDTO {
  shops: ShopDTO[];
  stats: ShopStatsDTO;
  total_count: number;
  current_page: number;
  per_page: number;
}
