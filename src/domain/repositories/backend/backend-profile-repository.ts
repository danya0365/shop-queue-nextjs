import { PaginatedProfilesEntity, ProfileEntity, ProfileStatsEntity } from "../../entities/backend/backend-profile.entity";
import { PaginationParams } from "../../interfaces/pagination-types";

/**
 * Profile repository error types
 */
export enum BackendProfileErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for profile repository operations
 * Following Clean Architecture principles for error handling
 */
export class BackendProfileError extends Error {
  constructor(
    public readonly type: BackendProfileErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendProfileError';
  }
}

/**
 * Profile repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface BackendProfileRepository {
  /**
   * Get paginated profiles data
   * @param params Pagination parameters
   * @returns Paginated profiles data
   * @throws BackendProfileError if the operation fails
   */
  getPaginatedProfiles(params: PaginationParams): Promise<PaginatedProfilesEntity>;

  /**
   * Get profile statistics
   * @returns Profile statistics data
   * @throws BackendProfileError if the operation fails
   */
  getProfileStats(): Promise<ProfileStatsEntity>;

  /**
   * Get profile by ID
   * @param id Profile ID
   * @returns Profile entity or null if not found
   * @throws BackendProfileError if the operation fails
   */
  getProfileById(id: string): Promise<ProfileEntity | null>;

  /**
   * Create a new profile
   * @param profile Profile entity to create
   * @returns Created profile entity
   * @throws BackendProfileError if the operation fails
   */
  createProfile(profile: Omit<ProfileEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProfileEntity>;

  /**
   * Update an existing profile
   * @param id Profile ID
   * @param profile Profile data to update
   * @returns Updated profile entity
   * @throws BackendProfileError if the operation fails
   */
  updateProfile(id: string, profile: Partial<ProfileEntity>): Promise<ProfileEntity>;

  /**
   * Delete a profile
   * @param id Profile ID
   * @returns true if deleted, false if not found
   * @throws BackendProfileError if the operation fails
   */
  deleteProfile(id: string): Promise<boolean>;
}
