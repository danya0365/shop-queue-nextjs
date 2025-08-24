import { ApplicationError } from './application-error';

/**
 * NotFoundError
 * 
 * Thrown when a requested resource is not found
 */
export class NotFoundError extends ApplicationError {
  /**
   * Type of resource that was not found
   */
  resourceType: string;
  
  /**
   * ID of the resource that was not found
   */
  resourceId: string;

  constructor(resourceType: string, resourceId: string) {
    super(`${resourceType} with id ${resourceId} not found`, 404, 'NOT_FOUND');
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    
    // This is necessary for proper instanceof checks with extended Error classes
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
