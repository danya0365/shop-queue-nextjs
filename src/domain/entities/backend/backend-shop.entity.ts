import { PaginatedResult } from "../../interfaces/pagination-types";
import { CategoryEntity } from "./backend-category.entity";

/**
 * Shop entity representing a business in the system
 * Following Clean Architecture principles - domain entity
 */
export interface ShopEntity {
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
  status: ShopStatus;
  ownerId: string;
  ownerName?: string; // Joined data
  createdAt: string;
  updatedAt: string;
  categories: ShopCategoryEntity[];
}

export type ShopCategoryEntity = Partial<CategoryEntity> & {
  id: string;
  name: string;
};

/**
 * Shop status enum
 */
export enum ShopStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

/**
 * Shop statistics entity
 */
export interface ShopStatsEntity {
  totalShops: number;
  activeShops: number;
  pendingApproval: number;
  newThisMonth: number;
}

/**
 * Paginated shops result
 */
export type PaginatedShopsEntity = PaginatedResult<ShopEntity>;
