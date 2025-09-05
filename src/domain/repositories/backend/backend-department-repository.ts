import { CreateDepartmentEntity, DepartmentEntity, DepartmentStatsEntity, PaginatedDepartmentsEntity, UpdateDepartmentEntity } from "../../entities/backend/backend-department.entity";
import { PaginationParams } from "../../interfaces/pagination-types";

/**
 * Department repository error types
 */
export enum BackendDepartmentErrorType {
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
export class BackendDepartmentError extends Error {
  constructor(
    public readonly type: BackendDepartmentErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendDepartmentError';
  }
}

/**
 * Department repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface BackendDepartmentRepository {
  /**
   * Get paginated departments data
   * @param params Pagination parameters
   * @returns Paginated departments data
   * @throws BackendDepartmentError if the operation fails
   */
  getPaginatedDepartments(params: PaginationParams): Promise<PaginatedDepartmentsEntity>;

  /**
   * Get department statistics
   * @returns Department statistics data
   * @throws BackendDepartmentError if the operation fails
   */
  getDepartmentStats(): Promise<DepartmentStatsEntity>;

  /**
   * Get department by ID
   * @param id Department ID
   * @returns Department entity or null if not found
   * @throws BackendDepartmentError if the operation fails
   */
  getDepartmentById(id: string): Promise<DepartmentEntity | null>;

  /**
   * Create a new department
   * @param department Department data to create
   * @returns Created department entity
   * @throws BackendDepartmentError if the operation fails
   */
  createDepartment(department: Omit<CreateDepartmentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<DepartmentEntity>;

  /**
   * Update an existing department
   * @param id Department ID
   * @param department Department data to update
   * @returns Updated department entity
   * @throws BackendDepartmentError if the operation fails
   */
  updateDepartment(id: string, department: Partial<Omit<UpdateDepartmentEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DepartmentEntity>;

  /**
   * Delete a department
   * @param id Department ID
   * @returns true if deleted successfully
   * @throws BackendDepartmentError if the operation fails
   */
  deleteDepartment(id: string): Promise<boolean>;
}
