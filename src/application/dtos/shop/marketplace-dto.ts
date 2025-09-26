import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";

// Marketplace-specific DTOs
export interface MarketplaceStatsDTO {
  totalShops: number;
  activeShops: number;
  featuredShops: number;
  newShopsThisMonth: number;
}

export interface ShopListResultDTO {
  shops: ShopDTO[];
  totalCount: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ShopFiltersDTO {
  category?: string;
  location?: string;
  priceRange?: [number, number];
  rating?: number;
  page?: number;
  limit?: number;
}

// Parameter interfaces for marketplace service methods
export interface GetAllShopsParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface GetShopsByCategoryParams {
  page: number;
  limit: number;
}

export interface GetShopsByLocationParams {
  page: number;
  limit: number;
}

export interface MarketplaceCategoryDTO {
  id: string;
  name: string;
  shopCount: number;
  icon: string;
}

export interface LocationDTO {
  id: string;
  name: string;
  province: string;
  district: string;
  shopCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
