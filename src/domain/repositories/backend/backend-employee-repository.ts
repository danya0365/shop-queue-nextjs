import { CreateEmployeeEntity, EmployeeEntity, EmployeeStatsEntity, PaginatedEmployeesEntity, UpdateEmployeeEntity } from "../../entities/backend/backend-employee.entity";
import { PaginationParams } from "../../interfaces/pagination-types";

/**
 * Employee repository error types
 */
export enum BackendEmployeeErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for employee repository operations
 * Following Clean Architecture principles for error handling
 */
export class BackendEmployeeError extends Error {
  constructor(
    public readonly type: BackendEmployeeErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendEmployeeError';
  }
}

/**
 * Employee repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface BackendEmployeeRepository {
  /**
   * Get paginated employees data
   * @param params Pagination parameters
   * @returns Paginated employees data
   * @throws BackendEmployeeError if the operation fails
   */
  getPaginatedEmployees(params: PaginationParams): Promise<PaginatedEmployeesEntity>;

  /**
   * Get employee statistics
   * @returns Employee statistics data
   * @throws BackendEmployeeError if the operation fails
   */
  getEmployeeStats(): Promise<EmployeeStatsEntity>;

  /**
   * Get employee by ID
   * @param id Employee ID
   * @returns Employee entity or null if not found
   * @throws BackendEmployeeError if the operation fails
   */
  getEmployeeById(id: string): Promise<EmployeeEntity | null>;

  /**
   * Create a new employee
   * @param employee Employee data to create
   * @returns Created employee entity
   * @throws BackendEmployeeError if the operation fails
   */
  createEmployee(employee: Omit<CreateEmployeeEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmployeeEntity>;

  /**
   * Update an existing employee
   * @param id Employee ID
   * @param employee Employee data to update
   * @returns Updated employee entity
   * @throws BackendEmployeeError if the operation fails
   */
  updateEmployee(id: string, employee: Partial<Omit<UpdateEmployeeEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<EmployeeEntity>;

  /**
   * Delete an employee
   * @param id Employee ID
   * @returns true if deleted successfully
   * @throws BackendEmployeeError if the operation fails
   */
  deleteEmployee(id: string): Promise<boolean>;
}
