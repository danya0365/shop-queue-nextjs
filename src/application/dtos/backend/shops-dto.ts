import { OpeningHour } from "../shop-opening-hour-dto";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

export interface ShopDTO {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  categoryId: string;
  categoryName: string;
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

export type PaginatedShopsDTO = PaginatedResult<ShopDTO>;
