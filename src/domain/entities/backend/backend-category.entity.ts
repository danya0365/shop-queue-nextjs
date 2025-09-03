import { PaginatedResult } from "../../interfaces/pagination-types";

export interface CategoryEntity {
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

export interface CategoryStatsEntity {
  totalCategories: number;
  activeCategories: number;
  totalShops: number;
  totalServices: number;
  mostPopularCategory: string;
  leastPopularCategory: string;
}

export interface CategoriesDataEntity {
  categories: CategoryEntity[];
  stats: CategoryStatsEntity;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

export type CategoryPaginatedEntity = PaginatedResult<CategoryEntity>;

