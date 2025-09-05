import { CreatePromotionEntity, PromotionEntity, PromotionStatsEntity, PaginatedPromotionsEntity, UpdatePromotionEntity } from "../../entities/backend/backend-promotion.entity";
import { PaginationParams } from "../../interfaces/pagination-types";

/**
 * Promotion repository error types
 */
export enum BackendPromotionErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for promotion repository operations
 * Following Clean Architecture principles for error handling
 */
export class BackendPromotionError extends Error {
  constructor(
    public readonly type: BackendPromotionErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendPromotionError';
  }
}

/**
 * Promotion repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface BackendPromotionRepository {
  /**
   * Get paginated promotions data
   * @param params Pagination parameters
   * @returns Paginated promotions data
   * @throws BackendPromotionError if the operation fails
   */
  getPaginatedPromotions(params: PaginationParams): Promise<PaginatedPromotionsEntity>;

  /**
   * Get promotion statistics
   * @returns Promotion statistics data
   * @throws BackendPromotionError if the operation fails
   */
  getPromotionStats(): Promise<PromotionStatsEntity>;

  /**
   * Get promotion by ID
   * @param id Promotion ID
   * @returns Promotion entity or null if not found
   * @throws BackendPromotionError if the operation fails
   */
  getPromotionById(id: string): Promise<PromotionEntity | null>;

  /**
   * Create a new promotion
   * @param promotion Promotion data to create
   * @returns Created promotion entity
   * @throws BackendPromotionError if the operation fails
   */
  createPromotion(promotion: Omit<CreatePromotionEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromotionEntity>;

  /**
   * Update an existing promotion
   * @param id Promotion ID
   * @param promotion Promotion data to update
   * @returns Updated promotion entity
   * @throws BackendPromotionError if the operation fails
   */
  updatePromotion(id: string, promotion: Partial<Omit<UpdatePromotionEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PromotionEntity>;

  /**
   * Delete a promotion
   * @param id Promotion ID
   * @returns true if deleted successfully
   * @throws BackendPromotionError if the operation fails
   */
  deletePromotion(id: string): Promise<boolean>;
}
