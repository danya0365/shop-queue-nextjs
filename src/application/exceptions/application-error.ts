/**
 * Base class for all application-specific errors
 * Extends the standard Error class with additional properties
 */
export class ApplicationError extends Error {
  /**
   * HTTP status code associated with this error
   */
  statusCode: number;
  
  /**
   * Error code for client-side error handling
   */
  code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    
    // This is necessary for proper instanceof checks with extended Error classes
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
