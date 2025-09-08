import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";
import { ServiceEntity } from "./backend-service.entity";

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
  categories: ShopCategoryEntity[];
  services: Partial<ServiceEntity>[];
  ownerId: string;
  ownerName?: string; // Join from profiles table
  status: ShopStatus;
  openingHours: OpeningHourEntity[]; // Join from shop_opening_hours table
  queueCount: number;
  totalServices: number;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopEntity {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
  status: ShopStatus;
  openingHours?: OpeningHourEntity[];
}

export interface UpdateShopEntity {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: ShopStatus;
  openingHours?: OpeningHourEntity[];
}

export interface ShopCategoryEntity {
  id: string;
  name: string;
}

export interface OpeningHourEntity {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  breakStart: string;
  breakEnd: string;
  isOpen: boolean;
}

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
