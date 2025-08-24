/**
 * Base exception for dashboard repository errors
 * Following Clean Architecture by defining application-specific exceptions
 */
export class DashboardRepositoryException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DashboardRepositoryException';
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DashboardRepositoryException);
    }
  }
}

/**
 * Exception for when dashboard data is not found
 */
export class DashboardNotFoundException extends DashboardRepositoryException {
  constructor(message: string = 'Dashboard data not found', cause?: unknown) {
    super(message, cause);
    this.name = 'DashboardNotFoundException';
  }
}

/**
 * Exception for when user has no active profile
 */
export class NoActiveProfileException extends DashboardRepositoryException {
  constructor(message: string = 'No active profile found', cause?: unknown) {
    super(message, cause);
    this.name = 'NoActiveProfileException';
  }
}
