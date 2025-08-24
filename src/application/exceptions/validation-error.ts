import { ApplicationError } from './application-error';

/**
 * ValidationError
 * 
 * Thrown when validation fails for input data
 * Contains a list of validation errors
 */
export class ValidationError extends ApplicationError {
  /**
   * List of validation error messages
   */
  validationErrors: string[];

  constructor(errors: string[] | string) {
    const errorMessages = Array.isArray(errors) ? errors : [errors];
    super('Validation failed', 400, 'VALIDATION_ERROR');
    this.validationErrors = errorMessages;
    
    // This is necessary for proper instanceof checks with extended Error classes
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
