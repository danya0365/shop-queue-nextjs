export interface CategoryDTO {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  shopsCount: number;
  servicesCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStatsDTO {
  totalCategories: number;
  activeCategories: number;
  totalShops: number;
  totalServices: number;
  mostPopularCategory: string;
  leastPopularCategory: string;
}

export interface CategoriesDataDTO {
  categories: CategoryDTO[];
  stats: CategoryStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}
