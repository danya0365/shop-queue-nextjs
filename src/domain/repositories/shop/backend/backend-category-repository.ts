import type { CategoryEntity, CategoryPaginatedEntity, CategoryStatsEntity } from '@/src/domain/entities/backend/backend-category.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Category repository error types
 */
export enum ShopBackendCategoryErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for category repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendCategoryError extends Error {
  constructor(
    public readonly type: ShopBackendCategoryErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopBackendCategoryError';
  }
}

/**
 * Category repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendCategoryRepository {
  /**
   * Get paginated categories data
   * @param params Pagination parameters
   * @returns Paginated categories data
   * @throws ShopBackendCategoryError if the operation fails
   */
  getPaginatedCategories(params: PaginationParams): Promise<CategoryPaginatedEntity>;

  /**
   * Get category statistics
   * @returns Category statistics data
   * @throws ShopBackendCategoryError if the operation fails
   */
  getCategoryStats(): Promise<CategoryStatsEntity>;

  /**
   * Get category by ID
   * @param id Category ID
   * @returns Category entity or null if not found
   * @throws ShopBackendCategoryError if the operation fails
   */
  getCategoryById(id: string): Promise<CategoryEntity | null>;

  /**
   * Create a new category
   * @param category Category data to create
   * @returns Created category entity
   * @throws ShopBackendCategoryError if the operation fails
   */
  createCategory(category: Omit<CategoryEntity, 'id' | 'createdAt' | 'updatedAt' | 'shopsCount' | 'servicesCount'>): Promise<CategoryEntity>;

  /**
   * Update an existing category
   * @param id Category ID
   * @param category Category data to update
   * @returns Updated category entity
   * @throws ShopBackendCategoryError if the operation fails
   */
  updateCategory(id: string, category: Partial<Omit<CategoryEntity, 'id' | 'createdAt' | 'updatedAt' | 'shopsCount' | 'servicesCount'>>): Promise<CategoryEntity>;

  /**
   * Delete a category
   * @param id Category ID
   * @returns true if deleted, false if not found
   * @throws ShopBackendCategoryError if the operation fails
   */
  deleteCategory(id: string): Promise<boolean>;
}
