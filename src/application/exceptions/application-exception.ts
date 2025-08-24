/**
 * Base exception class for application layer
 * Provides consistent error handling across the application
 */
export class ApplicationException extends Error {
  /**
   * Constructor
   * @param message Error message
   * @param cause Original error that caused this exception
   */
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
