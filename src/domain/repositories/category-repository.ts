import { Category, CategoryCreate } from '../entities/category';
import { IDomainEvent } from '../events/event-dispatcher';
import { v4 as uuidv4 } from 'uuid';

/**
 * Category repository error types
 * Following domain-driven design principles by defining domain-specific errors
 */
export enum CategoryErrorType {
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  OPERATION_FAILED = 'OPERATION_FAILED',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Domain-specific category repository error
 */
export class CategoryError extends Error {
  constructor(
    public readonly type: CategoryErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'CategoryError';
  }
}

/**
 * Base category repository interface with common functionality
 * Following Interface Segregation Principle by creating specialized interfaces
 */
export interface IBaseCategoryRepository {
  /**
   * Handle repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation name for better error context
   * @param context Optional additional context for the error
   * @throws CategoryError with appropriate type and message
   */
  handleError(error: unknown, operation?: string, context?: Record<string, unknown>): never;
}

/**
 * Category-specific read repository interface
 * Following Interface Segregation Principle by creating specialized interfaces
 */
export interface ICategoryReadRepository extends IBaseCategoryRepository {
  /**
   * Get all categories
   * @returns Promise with array of categories
   * @throws CategoryError if the operation fails
   */
  getAll(): Promise<Category[]>;
  
  /**
   * Get category by ID
   * @param id Category ID
   * @returns Promise with category or null if not found
   * @throws CategoryError if the operation fails
   */
  getById(id: string): Promise<Category | null>;
  
  /**
   * Get category by slug
   * @param slug Category slug
   * @returns Promise with category or null if not found
   * @throws CategoryError if the operation fails
   */
  getBySlug(slug: string): Promise<Category | null>;
}

/**
 * Category-specific write repository interface
 * Following Interface Segregation Principle by creating specialized interfaces
 */
export interface ICategoryWriteRepository extends IBaseCategoryRepository {
  /**
   * Create a new category
   * @param category The category to create
   * @returns Promise with the created category
   * @throws CategoryError if the operation fails
   * @emits CategoryCreatedEvent
   */
  create(category: CategoryCreate): Promise<Category>;
  
  /**
   * Update an existing category
   * @param id The ID of the category to update
   * @param category The category data to update
   * @returns Promise with the updated category
   * @throws CategoryError if the operation fails
   * @emits CategoryUpdatedEvent
   */
  update(id: string, category: Partial<CategoryCreate>): Promise<Category>;
  
  /**
   * Delete a category by ID
   * @param id The ID of the category to delete
   * @returns Promise with void
   * @throws CategoryError if the operation fails
   * @emits CategoryDeletedEvent
   */
  delete(id: string): Promise<void>;
}

/**
 * Combined category repository interface
 * Clients should depend on more specific interfaces when possible
 */
export interface CategoryRepository extends ICategoryReadRepository, ICategoryWriteRepository {}

/**
 * Domain event for category creation
 * Following Domain-Driven Design principles by using domain events
 */
export class CategoryCreatedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly category: Category,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}

/**
 * Domain event for category update
 * Following Domain-Driven Design principles by using domain events
 */
export class CategoryUpdatedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly category: Category,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}

/**
 * Domain event for category deletion
 * Following Domain-Driven Design principles by using domain events
 */
export class CategoryDeletedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly categoryId: string,
    public readonly slug: string,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}

/**
 * Value object for category slug
 * Following Domain-Driven Design principles by encapsulating domain concepts
 */
export class CategorySlug {
  private readonly value: string;
  
  constructor(slug: string) {
    if (!this.isValid(slug)) {
      throw new CategoryError(
        CategoryErrorType.VALIDATION_ERROR,
        'Slug must be between 3 and 50 characters, lowercase, and contain only letters, numbers, and hyphens',
        'CategorySlug.constructor',
        { slug }
      );
    }
    this.value = slug;
  }
  
  private isValid(slug: string): boolean {
    const pattern = /^[a-z0-9-]{3,50}$/;
    return pattern.test(slug);
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: CategorySlug): boolean {
    return this.value === other.value;
  }
  
  /**
   * Create a slug from a category name
   * @param name Category name
   * @returns A valid category slug
   */
  static fromName(name: string): CategorySlug {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
      
    return new CategorySlug(slug);
  }
}
