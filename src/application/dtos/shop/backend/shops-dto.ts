import { ShopStatus } from "@/src/domain/entities/backend/backend-shop.entity";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";
import { CategoryDTO } from "./categories-dto";
import { OpeningHourDTO } from "./opening-hour-dto";
import { ServiceDTO } from "./services-dto";

export type ShopCategoryDTO = Partial<CategoryDTO> & {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export interface ShopDTO {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  qrCodeUrl: string | null;
  timezone: string;
  currency: string;
  language: string;
  categories: ShopCategoryDTO[];
  ownerId: string;
  ownerName: string;
  status: "active" | "inactive" | "suspended" | "draft";
  openingHours: OpeningHourDTO[];
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
  website?: string;
  ownerId: string;
  logo?: string;
  qrCodeUrl?: string;
  timezone?: string;
  currency?: string;
  language?: string;
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
  website?: string;
  status?: ShopStatus;
  logo?: string;
  qrCodeUrl?: string;
  timezone?: string;
  currency?: string;
  language?: string;
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

/**
 * Input DTO for updating shop status specifically
 */
export interface UpdateShopStatusInputDTO {
  id: string;
  status: ShopStatus;
}
