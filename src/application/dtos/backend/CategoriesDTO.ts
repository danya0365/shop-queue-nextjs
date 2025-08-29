export interface CategoryDTO {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  shops_count: number;
  services_count: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryStatsDTO {
  total_categories: number;
  active_categories: number;
  total_shops: number;
  total_services: number;
  most_popular_category: string;
  least_popular_category: string;
}

export interface CategoriesDataDTO {
  categories: CategoryDTO[];
  stats: CategoryStatsDTO;
  total_count: number;
  current_page: number;
  per_page: number;
}
