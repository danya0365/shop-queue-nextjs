import { Profile, ProfileCreate, ProfileUpdate } from '../entities/profile';

/**
 * Error types for profile repository operations
 */
export enum ProfileErrorType {
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  OPERATION_FAILED = 'OPERATION_FAILED',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Domain-specific error for profile repository operations
 */
export class ProfileError extends Error {
  constructor(
    public readonly type: ProfileErrorType,
    message: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ProfileError';
  }
}

/**
 * Base repository interface with common error handling
 */
export interface IBaseProfileRepository {
  /**
   * Handles repository errors in a consistent way
   * @param error The error to handle
   * @throws ProfileError with appropriate error type
   */
  handleError(error: unknown): never;
}

/**
 * Generic read repository interface
 */
export interface IReadProfileRepository<T> {
  /**
   * Get all entities
   * @returns Promise with array of entities
   * @throws ProfileError if the operation fails
   */
  getAll(): Promise<T[]>;

  /**
   * Get entity by ID
   * @param id Entity ID
   * @returns Promise with entity or null if not found
   * @throws ProfileError if the operation fails
   */
  getById(id: string): Promise<T | null>;
}

/**
 * Profile-specific read repository interface
 * Following Interface Segregation Principle by creating specialized interfaces
 */
export interface IProfileReadRepository extends IReadProfileRepository<Profile>, IBaseProfileRepository {
  /**
   * Get profiles by auth ID
   * @param authId Auth ID
   * @returns Promise with array of profiles
   * @throws RepositoryError if the operation fails
   */
  getByAuthId(authId: string): Promise<Profile[]>;
  
  /**
   * Get active profile by auth ID
   * @param authId Auth ID
   * @returns Promise with profile or null if not found
   * @throws RepositoryError if the operation fails
   */
  getActiveByAuthId(authId: string): Promise<Profile | null>;
  
  /**
   * Get the current user's profile
   * @returns Promise with profile or null if not found or not authenticated
   * @throws RepositoryError if the operation fails
   */
  getCurrentUserProfile(): Promise<Profile | null>;
}

/**
 * Generic write repository interface
 */
export interface IWriteProfileRepository<T, C, U> {
  /**
   * Create a new entity
   * @param data Entity data
   * @returns Promise with created entity
   * @throws ProfileError if the operation fails
   */
  create(data: C): Promise<T>;

  /**
   * Update an existing entity
   * @param id Entity ID
   * @param data Entity data
   * @returns Promise with updated entity
   * @throws ProfileError if the operation fails
   */
  update(id: string, data: U): Promise<T>;

  /**
   * Delete an entity
   * @param id Entity ID
   * @throws ProfileError if the operation fails
   */
  delete(id: string): Promise<void>;
}

/**
 * Profile-specific write repository interface
 * Following Interface Segregation Principle by creating specialized interfaces
 */
export interface IProfileWriteRepository extends IWriteProfileRepository<Profile, ProfileCreate, ProfileUpdate>, IBaseProfileRepository {
  /**
   * Set a profile as active for a user
   * @param id Profile ID
   * @param authId Auth ID
   * @throws RepositoryError if the operation fails
   */
  setActive(id: string, authId: string): Promise<void>;
}

/**
 * Combined profile repository interface
 * Clients should depend on more specific interfaces when possible
 */
export interface ProfileRepository extends IProfileReadRepository, IProfileWriteRepository {}

/**
 * Value object for profile username
 * Following Domain-Driven Design principles by encapsulating domain concepts
 */
export class Username {
  private readonly value: string;
  
  constructor(username: string) {
    if (!this.isValid(username)) {
      throw new ProfileError(
        ProfileErrorType.VALIDATION_ERROR,
        'Username must be between 3 and 30 characters and contain only letters, numbers, underscores, and hyphens'
      );
    }
    this.value = username;
  }
  
  private isValid(username: string): boolean {
    const pattern = /^[a-zA-Z0-9_-]{3,30}$/;
    return pattern.test(username);
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: Username): boolean {
    return this.value === other.value;
  }
}
