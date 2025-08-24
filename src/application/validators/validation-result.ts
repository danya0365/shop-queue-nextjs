/**
 * ValidationResult interface
 * 
 * Represents the result of a validation operation
 */
export interface ValidationResult {
  /**
   * Whether the validation passed
   */
  isValid: boolean;
  
  /**
   * List of validation error messages
   */
  errors: string[];
}
