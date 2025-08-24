import { DashboardDataEntity } from '../entities/dashboard-data.entity';
import { BaseError } from '../errors/base-error';

/**
 * Error types specific to dashboard operations
 */
export enum DashboardErrorType {
  NOT_FOUND = 'DASHBOARD_NOT_FOUND',
  OPERATION_FAILED = 'DASHBOARD_OPERATION_FAILED',
  UNKNOWN = 'DASHBOARD_UNKNOWN_ERROR'
}

/**
 * Domain error for dashboard operations
 * Following SOLID principles by encapsulating error handling for dashboard domain
 */
export class DashboardError extends BaseError {
  constructor(
    public readonly type: DashboardErrorType,
    message: string,
    operation?: string,
    context?: Record<string, unknown>,
    cause?: unknown
  ) {
    super(message, operation, context, cause);
    this.name = 'DashboardError';
  }
}

/**
 * Interface for Dashboard Repository
 * Following SOLID principles by defining a focused interface for dashboard operations
 */
export interface DashboardRepository {
  /**
   * Get dashboard data for the currently active profile
   * @returns Dashboard data or null if not found or no active profile
   * @throws DashboardError if the operation fails
   */
  getUserDashboard(): Promise<DashboardDataEntity | null>;
}
