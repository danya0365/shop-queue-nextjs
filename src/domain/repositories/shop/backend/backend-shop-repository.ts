import type { CreateShopEntity, PaginatedShopsEntity, ShopEntity, ShopStatsEntity, UpdateShopEntity } from '@/src/domain/entities/shop/backend/backend-shop.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Shop repository error types
 */
export enum ShopBackendShopErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for shop repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendShopError extends Error {
  constructor(
    public readonly type: ShopBackendShopErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopBackendShopError';
  }
}

/**
 * Shop repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendShopRepository {
  /**
   * Get paginated shops data
   * @param params Pagination parameters
   * @returns Paginated shops data
   * @throws ShopBackendShopError if the operation fails
   */
  getPaginatedShops(params: PaginationParams): Promise<PaginatedShopsEntity>;

  /**
   * Get shop statistics
   * @returns Shop statistics data
   * @throws ShopBackendShopError if the operation fails
   */
  getShopStats(): Promise<ShopStatsEntity>;

  /**
   * Get shop by ID
   * @param id Shop ID
   * @returns Shop entity or null if not found
   * @throws ShopBackendShopError if the operation fails
   */
  getShopById(id: string): Promise<ShopEntity | null>;

  /**
   * Create a new shop
   * @param shop Shop data to create
   * @returns Created shop entity
   * @throws ShopBackendShopError if the operation fails
   */
  createShop(shop: Omit<CreateShopEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShopEntity>;

  /**
   * Update an existing shop
   * @param id Shop ID
   * @param shop Shop data to update
   * @returns Updated shop entity
   * @throws ShopBackendShopError if the operation fails
   */
  updateShop(id: string, shop: Partial<Omit<UpdateShopEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ShopEntity>;

  /**
   * Delete a shop
   * @param id Shop ID
   * @returns true if deleted successfully
   * @throws ShopBackendShopError if the operation fails
   */
  deleteShop(id: string): Promise<boolean>;
}
