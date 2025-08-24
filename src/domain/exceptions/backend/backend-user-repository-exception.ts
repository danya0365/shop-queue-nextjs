/**
 * Custom exception for backend dashboard repository operations
 * Following Clean Architecture principles by defining domain-specific exceptions
 */
export class BackendUserRepositoryException extends Error {
  /**
   * Constructor for BackendUserRepositoryException
   * @param message Error message
   * @param cause Original error that caused this exception
   */
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'BackendUserRepositoryException';
    
    // Maintain proper stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BackendUserRepositoryException);
    }
  }
}
