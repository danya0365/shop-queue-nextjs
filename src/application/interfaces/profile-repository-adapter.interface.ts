import { ProfileDto, CreateProfileInputDto, UpdateProfileInputDto } from '../dtos/profile-dto';

/**
 * Interface for ProfileRepositoryAdapter
 * Following the Adapter pattern in Clean Architecture
 * This interface defines the contract for adapters that convert between domain entities and DTOs
 */
export interface IProfileRepositoryAdapter {
  /**
   * Get profiles by auth ID as DTOs
   * @param authId Auth ID
   * @returns Array of profile DTOs
   */
  getByAuthId(authId: string): Promise<ProfileDto[]>;

  /**
   * Get a profile by ID as DTO
   * @param id Profile ID
   * @returns Profile DTO or null if not found
   */
  getById(id: string): Promise<ProfileDto | null>;
  
  /**
   * Get a profile by user ID as DTO
   * @param userId User ID (auth ID)
   * @returns Profile DTO or null if not found
   */
  getByUserId(userId: string): Promise<ProfileDto | null>;

  /**
   * Get active profile by auth ID as DTO
   * @param authId Auth ID
   * @returns Profile DTO or null if not found
   */
  getActiveByAuthId(authId: string): Promise<ProfileDto | null>;

  /**
   * Create a new profile
   * @param profileDto Profile data to create
   * @returns Created profile as DTO
   */
  create(profileDto: CreateProfileInputDto): Promise<ProfileDto>;

  /**
   * Update an existing profile
   * @param id Profile ID
   * @param profileDto Updated profile data
   * @returns Updated profile as DTO
   */
  update(id: string, profileDto: UpdateProfileInputDto): Promise<ProfileDto>;

  /**
   * Set a profile as active
   * @param id Profile ID
   * @param authId Auth ID
   */
  setActive(id: string, authId: string): Promise<void>;

  /**
   * Delete a profile
   * @param id Profile ID
   */
  delete(id: string): Promise<void>;
  
  /**
   * Get the current user's profile
   * @returns Profile DTO or null if not found or not authenticated
   */
  getCurrentUserProfile(): Promise<ProfileDto | null>;
}
