/**
 * Global Dashboard Error
 * Custom error class for global dashboard operations
 */

export enum GlobalDashboardErrorType {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class GlobalDashboardError extends Error {
  constructor(
    public readonly type: GlobalDashboardErrorType,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'GlobalDashboardError';
    Object.setPrototypeOf(this, GlobalDashboardError.prototype);
  }

  static notFound(message: string): GlobalDashboardError {
    return new GlobalDashboardError(GlobalDashboardErrorType.NOT_FOUND, message);
  }

  static validationError(message: string): GlobalDashboardError {
    return new GlobalDashboardError(GlobalDashboardErrorType.VALIDATION_ERROR, message);
  }

  static databaseError(message: string, originalError?: unknown): GlobalDashboardError {
    return new GlobalDashboardError(GlobalDashboardErrorType.DATABASE_ERROR, message, originalError);
  }

  static unauthorized(message: string): GlobalDashboardError {
    return new GlobalDashboardError(GlobalDashboardErrorType.UNAUTHORIZED, message);
  }

  static unknown(message: string, originalError?: unknown): GlobalDashboardError {
    return new GlobalDashboardError(GlobalDashboardErrorType.UNKNOWN_ERROR, message, originalError);
  }
}
