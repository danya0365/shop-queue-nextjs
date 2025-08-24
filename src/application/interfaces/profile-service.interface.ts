import {
  CreateProfileDto,
  ProfileDto,
  UpdateProfileDto,
} from "../dtos/profile-dto";
import { DeleteProfileInput } from "../usecases/profile/delete-profile";

/**
 * Interface for profile service
 * Following Interface Segregation Principle by defining a clear contract
 */
export interface IProfileService {
  /**
   * Get a profile by ID
   * @param id Profile ID
   * @returns Profile DTO or null if not found
   */
  getProfileById(id: string): Promise<ProfileDto | null>;

  /**
   * Get a profile by user ID
   * @param userId User ID
   * @returns Profile DTO or null if not found
   */
  getProfileByUserId(userId: string): Promise<ProfileDto | null>;

  /**
   * Get active profile by authentication ID
   * @param authId Authentication ID from Supabase auth.users
   * @returns Active profile DTO or null if not found
   */
  getActiveProfileByAuthId(authId: string): Promise<ProfileDto | null>;

  /**
   * Set a profile as active
   * @param profileId Profile ID to set as active
   * @param authId Auth ID of the user
   * @returns Promise<void>
   */
  setActiveProfile(profileId: string, authId: string): Promise<boolean>;

  /**
   * Create a new profile
   * @param profileData Data for the new profile
   * @returns Created profile as DTO
   */
  createProfile(profileData: CreateProfileDto): Promise<ProfileDto>;

  /**
   * Update a profile
   * @param id Profile ID
   * @param profileData Data to update
   * @returns Updated profile as DTO
   */
  updateProfile(
    id: string,
    profileData: UpdateProfileDto
  ): Promise<ProfileDto | null>;

  /**
   * Get the current user's profile
   * @returns Profile DTO or null if not found or not authenticated
   */
  getCurrentUserProfile(): Promise<ProfileDto | null>;

  /**
   * Get all profiles for a user by auth ID
   * @param authId Auth ID
   * @returns Array of profile DTOs
   */
  getProfilesByAuthId(authId: string): Promise<ProfileDto[]>;

  /**
   * Delete a profile
   * @param payload Input containing profile ID
   * @throws ProfileNotFoundException if the profile is not found
   * @throws ProfileRepositoryException if there's an error in the repository
   */
  deleteProfile(payload: DeleteProfileInput): Promise<void>;
}
