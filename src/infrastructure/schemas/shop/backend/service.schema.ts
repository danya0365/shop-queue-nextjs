export interface ServiceSchemaType {
  id: string;
  shop_id: string;
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

export interface ServiceStatsSchemaType {
  total_services: number;
  available_services: number;
  unavailable_services: number;
  average_price: number;
  total_revenue: number;
  services_by_category: Record<string, number>;
  popular_services: Array<{ id: string; name: string; booking_count: number }>;
}
