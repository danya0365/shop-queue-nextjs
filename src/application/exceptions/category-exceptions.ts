/**
 * Custom exceptions for category operations
 * Following SOLID principles by creating specific exceptions for different error cases
 */

/**
 * Thrown when a category validation fails
 */
export class CategoryValidationException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'CategoryValidationException';
  }
}

/**
 * Thrown when a category is not found
 */
export class CategoryNotFoundException extends Error {
  constructor(identifier: string, public readonly cause?: unknown) {
    super(`Category with identifier ${identifier} not found`);
    this.name = 'CategoryNotFoundException';
  }
}

/**
 * Thrown when there's an error in the category repository
 */
export class CategoryRepositoryException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'CategoryRepositoryException';
  }
}

/**
 * Thrown when a category with the same slug already exists
 */
export class CategoryAlreadyExistsException extends Error {
  constructor(slug: string, public readonly cause?: unknown) {
    super(`Category with slug '${slug}' already exists`);
    this.name = 'CategoryAlreadyExistsException';
  }
}
