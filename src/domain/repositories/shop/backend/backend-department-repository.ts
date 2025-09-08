import type { CreateDepartmentEntity, DepartmentEntity, DepartmentStatsEntity, PaginatedDepartmentsEntity, UpdateDepartmentEntity } from '@/src/domain/entities/shop/backend/backend-department.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Department repository error types
 */
export enum ShopBackendDepartmentErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for department repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendDepartmentError extends Error {
  constructor(
    public readonly type: ShopBackendDepartmentErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopBackendDepartmentError';
  }
}

/**
 * Department repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendDepartmentRepository {
  /**
   * Get paginated departments data
   * @param params Pagination parameters
   * @returns Paginated departments data
   * @throws ShopBackendDepartmentError if the operation fails
   */
  getPaginatedDepartments(params: PaginationParams): Promise<PaginatedDepartmentsEntity>;

  /**
   * Get department statistics
   * @returns Department statistics data
   * @throws ShopBackendDepartmentError if the operation fails
   */
  getDepartmentStats(): Promise<DepartmentStatsEntity>;

  /**
   * Get department by ID
   * @param id Department ID
   * @returns Department entity or null if not found
   * @throws ShopBackendDepartmentError if the operation fails
   */
  getDepartmentById(id: string): Promise<DepartmentEntity | null>;

  /**
   * Create a new department
   * @param department Department data to create
   * @returns Created department entity
   * @throws ShopBackendDepartmentError if the operation fails
   */
  createDepartment(department: Omit<CreateDepartmentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<DepartmentEntity>;

  /**
   * Update an existing department
   * @param id Department ID
   * @param department Department data to update
   * @returns Updated department entity
   * @throws ShopBackendDepartmentError if the operation fails
   */
  updateDepartment(id: string, department: Partial<Omit<UpdateDepartmentEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DepartmentEntity>;

  /**
   * Delete a department
   * @param id Department ID
   * @returns true if deleted successfully
   * @throws ShopBackendDepartmentError if the operation fails
   */
  deleteDepartment(id: string): Promise<boolean>;
}
