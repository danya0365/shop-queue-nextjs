import { OpeningHour } from "@/src/application/dtos/shop/backend/shop-opening-hour-dto";
import { ShopStatus } from "@/src/domain/entities/backend/backend-shop.entity";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";
import { CategoryDTO } from "./categories-dto";
import { ServiceDTO } from "./services-dto";

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
  services: Partial<ServiceDTO>[];
  queueCount: number;
  totalServices: number;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopInputDTO {
  name: string;
  description?: string;
  address: string;
  phone: string;
  email?: string;
  ownerId: string;
  categoryIds: string[];
  openingHours: Array<{
    dayOfWeek: string;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    breakStart?: string;
    breakEnd?: string;
  }>;
}

export interface UpdateShopInputDTO {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: ShopStatus;
  openingHours?: Array<{
    dayOfWeek: string;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    breakStart?: string;
    breakEnd?: string;
  }>;
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
