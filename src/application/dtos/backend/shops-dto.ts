import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";
import { OpeningHour } from "../shop-opening-hour-dto";
import { CategoryDTO } from "./categories-dto";

export type ShopCategoryDTO = Partial<CategoryDTO> & {
  id: string;
  name: string;
}

export interface ShopDTO {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  categories: ShopCategoryDTO[];
  ownerId: string;
  ownerName: string;
  status: 'active' | 'inactive' | 'pending';
  openingHours: OpeningHour[];
  queueCount: number;
  totalServices: number;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShopStatsDTO {
  totalShops: number;
  activeShops: number;
  pendingApproval: number;
  newThisMonth: number;
}

export interface ShopsDataDTO {
  shops: ShopDTO[];
  stats: ShopStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

/**
 * Input DTO for GetShopsPaginatedUseCase
 */
export interface GetShopsPaginatedInput {
  page: number;
  limit: number;
}

export type PaginatedShopsDTO = PaginatedResult<ShopDTO>;
