/**
 * Custom exceptions for repository operations
 * Following SOLID principles by creating specific exceptions for different error cases
 */

/**
 * Base class for all repository exceptions
 */
export class RepositoryException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'RepositoryException';
  }
}

/**
 * Thrown when an entity is not found in the repository
 */
export class EntityNotFoundException extends RepositoryException {
  constructor(entityName: string, identifier: string, cause?: unknown) {
    super(`${entityName} with identifier ${identifier} not found`, cause);
    this.name = 'EntityNotFoundException';
  }
}

/**
 * Thrown when there's an error during a database operation
 */
export class DatabaseOperationException extends RepositoryException {
  constructor(operation: string, entityName: string, cause?: unknown) {
    super(`Failed to ${operation} ${entityName}`, cause);
    this.name = 'DatabaseOperationException';
  }
}

/**
 * Thrown when an entity with the same unique identifier already exists
 */
export class EntityAlreadyExistsException extends RepositoryException {
  constructor(entityName: string, field: string, value: string, cause?: unknown) {
    super(`${entityName} with ${field} '${value}' already exists`, cause);
    this.name = 'EntityAlreadyExistsException';
  }
}
