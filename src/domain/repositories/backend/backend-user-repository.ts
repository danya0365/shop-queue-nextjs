import { UserEntity } from "../../entities/backend/backend-dashboard.entity";
import { BaseError } from "../../errors/base-error";
import { PaginatedResult, PaginationParams } from "../../interfaces/pagination-types";

/**
 * Error types specific to backend dashboard operations
 */
export enum BackendUserErrorType {
  NOT_FOUND = "BACKEND_USER_NOT_FOUND",
  OPERATION_FAILED = "BACKEND_USER_OPERATION_FAILED",
  UNKNOWN = "BACKEND_USER_UNKNOWN_ERROR",
}

/**
 * Domain error for backend dashboard operations
 * Following SOLID principles by encapsulating error handling for backend dashboard domain
 */
export class BackendUserError extends BaseError {
  constructor(
    public readonly type: BackendUserErrorType,
    message: string,
    operation?: string,
    context?: Record<string, unknown>,
    cause?: unknown
  ) {
    super(message, operation, context, cause);
    this.name = "BackendDashboardError";
  }
}

/**
 * Interface for Backend Dashboard Repository
 * Following SOLID principles by defining a focused interface for backend dashboard operations
 */
export interface BackendUserRepository {
  /**
   * Get system health status
   * @returns System health data or null if not available
   * @throws BackendUserError if the operation fails
   */
  getUsers(params: PaginationParams): Promise<PaginatedResult<UserEntity>>;
}
