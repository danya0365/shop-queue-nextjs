import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

export interface PromotionCondition {
  [key: string]: string;
}

export interface PromotionDTO {
  id: string;
  shopId: string; // joined from shop
  shopName: string; // joined from shop
  name: string;
  description: string | null;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "free_item";
  value: number;
  minPurchaseAmount: number | null;
  maxDiscountAmount: number | null;
  startAt: string;
  endAt: string;
  usageLimit: number | null;
  status: "active" | "inactive" | "expired" | "scheduled";
  conditions: PromotionCondition[] | null;
  createdBy: string; // joined from profile
  createdByName: string | null; // joined from profile
  createdAt: string;
  updatedAt: string | null;
}

export interface CreatePromotionParams {
  shopId: string;
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startAt: string;
  endAt: string;
  usageLimit?: number;
  status?: PromotionStatus;
  conditions?: PromotionCondition[];
  createdBy: string;
}

export interface UpdatePromotionParams {
  id: string;
  shopId?: string;
  name?: string;
  description?: string;
  type?: PromotionType;
  value?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startAt?: string;
  endAt?: string;
  usageLimit?: number;
  status?: PromotionStatus;
  conditions?: PromotionCondition[];
}

/**
 * Promotion type enum
 */
export enum PromotionType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
  BUY_X_GET_Y = "buy_x_get_y",
  FREE_ITEM = "free_item",
}

/**
 * Promotion status enum
 */
export enum PromotionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
  SCHEDULED = "scheduled",
}

export interface PromotionStatsDTO {
  totalPromotions: number;
  activePromotions: number;
  inactivePromotions: number;
  expiredPromotions: number;
  scheduledPromotions: number;
  totalUsage: number;
  totalDiscountGiven: number;
  averageDiscountAmount: number;
  mostUsedPromotionType: string;
}

export interface PromotionTypeStatsDTO {
  percentage: {
    count: number;
    percentage: number;
    totalUsage: number;
  };
  fixed_amount: {
    count: number;
    percentage: number;
    totalUsage: number;
  };
  buy_x_get_y: {
    count: number;
    percentage: number;
    totalUsage: number;
  };
  free_item: {
    count: number;
    percentage: number;
    totalUsage: number;
  };
  totalPromotions: number;
}

export interface PromotionsDataDTO {
  promotions: PromotionDTO[];
  stats: PromotionStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

/**
 * Input DTO for GetPromotionsPaginatedUseCase
 */
export interface GetPromotionsPaginatedInput {
  shopId: string;
  page: number;
  limit: number;
  filters?: {
    searchQuery?: string;
    typeFilter?: string;
    statusFilter?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export type PaginatedPromotionsDTO = PaginatedResult<PromotionDTO>;
