import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

export interface PromotionCondition {
  [key: string]: string;
}

/**
 * Promotion entity representing a promotion in the system
 * Following Clean Architecture principles - domain entity
 */
export interface PromotionEntity {
  id: string;
  shopId: string;
  shopName?: string; // Joined data
  name: string;
  description: string | null;
  type: PromotionType;
  value: number;
  minPurchaseAmount: number | null;
  maxDiscountAmount: number | null;
  startAt: string;
  endAt: string;
  usageLimit: number | null;
  status: PromotionStatus;
  conditions: PromotionCondition[] | null;
  createdBy: string;
  createdByName?: string; // Joined data
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionEntity {
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

export interface UpdatePromotionEntity {
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
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_ITEM = 'free_item'
}

/**
 * Promotion status enum
 */
export enum PromotionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled'
}

/**
 * Promotion statistics entity
 */
export interface PromotionStatsEntity {
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

/**
 * Promotion type statistics entity
 */
export interface PromotionTypeStatsEntity {
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
  totalPromotions: number;
}

/**
 * Promotion service relation entity
 */
export interface PromotionServiceEntity {
  id: string;
  promotionId: string;
  serviceId: string;
  serviceName?: string; // Joined data
}

/**
 * Promotion usage log entity
 */
export interface PromotionUsageLogEntity {
  id: string;
  promotionId: string;
  promotionName?: string; // Joined data
  customerId: string | null;
  customerName?: string; // Joined data
  queueId: string | null;
  queueNumber?: string; // Joined data
  usedAt: string;
}

/**
 * Paginated promotions result
 */
export type PaginatedPromotionsEntity = PaginatedResult<PromotionEntity>;
