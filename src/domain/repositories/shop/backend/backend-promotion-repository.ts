import type {
  CreatePromotionEntity,
  PaginatedPromotionsEntity,
  PromotionEntity,
  PromotionStatsEntity,
  UpdatePromotionEntity,
} from "@/src/domain/entities/shop/backend/backend-promotion.entity";
import { PaginationParamsWithShopId } from "@/src/domain/interfaces/pagination-types";

/**
 * Promotion repository error types
 */
export enum ShopBackendPromotionErrorType {
  NOT_FOUND = "not_found",
  OPERATION_FAILED = "operation_failed",
  VALIDATION_ERROR = "validation_error",
  UNAUTHORIZED = "unauthorized",
  UNKNOWN = "unknown",
}

/**
 * Custom error class for promotion repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendPromotionError extends Error {
  constructor(
    public readonly type: ShopBackendPromotionErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ShopBackendPromotionError";
  }
}

/**
 * Promotion repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendPromotionRepository {
  /**
   * Get paginated promotions data
   * @param params Pagination and filter parameters
   * @returns Paginated promotions data
   * @throws ShopBackendPromotionError if the operation fails
   */
  getPaginatedPromotions(
    params: PaginationParamsWithShopId & {
      filters?: {
        searchQuery?: string;
        typeFilter?: string;
        statusFilter?: string;
        dateFrom?: string;
        dateTo?: string;
      };
    }
  ): Promise<PaginatedPromotionsEntity>;

  /**
   * Get promotion statistics
   * @returns Promotion statistics data
   * @throws ShopBackendPromotionError if the operation fails
   */
  getPromotionStats(shopId: string): Promise<PromotionStatsEntity>;

  /**
   * Get promotion by ID
   * @param id Promotion ID
   * @returns Promotion entity or null if not found
   * @throws ShopBackendPromotionError if the operation fails
   */
  getPromotionById(id: string): Promise<PromotionEntity | null>;

  /**
   * Create a new promotion
   * @param promotion Promotion data to create
   * @returns Created promotion entity
   * @throws ShopBackendPromotionError if the operation fails
   */
  createPromotion(
    promotion: Omit<CreatePromotionEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<PromotionEntity>;

  /**
   * Update an existing promotion
   * @param id Promotion ID
   * @param promotion Promotion data to update
   * @returns Updated promotion entity
   * @throws ShopBackendPromotionError if the operation fails
   */
  updatePromotion(
    id: string,
    promotion: Partial<
      Omit<UpdatePromotionEntity, "id" | "createdAt" | "updatedAt">
    >
  ): Promise<PromotionEntity>;

  /**
   * Delete a promotion
   * @param id Promotion ID
   * @returns true if deleted successfully
   * @throws ShopBackendPromotionError if the operation fails
   */
  deletePromotion(id: string): Promise<boolean>;
}
