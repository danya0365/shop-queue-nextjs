export interface CategoryDTO {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  shopsCount: number; // joined from category_shops
  servicesCount: number; // joined from services
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

export interface PaginationMetadata {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface GetCategoriesPaginatedInputDTO {
  page: number;
  perPage: number;
}

export interface PaginatedCategoriesDTO {
  data: CategoryDTO[];
  pagination: PaginationMetadata;
}
