import { Logger } from "@/src/domain/interfaces/logger";
import { SupabaseClient } from "@supabase/supabase-js";
import { Profile, ProfileCreate, ProfileRole, ProfileUpdate } from "../../domain/entities/profile";
import type { IEventDispatcher } from "../../domain/events/event-dispatcher";
import type { DatabaseDataSource } from "../../domain/interfaces/datasources/database-datasource";
import { DatabaseError, DatabaseErrorType } from "../../domain/interfaces/datasources/database-datasource";
import {
  ProfileError,
  ProfileErrorType,
  ProfileRepository
} from "../../domain/repositories/profile-repository";
import {
  DatabaseOperationException,
  EntityAlreadyExistsException,
  EntityNotFoundException
} from "../exceptions/repository-exceptions";
import { SupabaseProfileMapper } from "../mappers/supabase-profile-mapper";
import { ProfileDbSchema, ProfileRoleDbSchema } from "../schemas/profile-schema";
import { StandardRepository } from "./base/standard-repository";

/**
 * Supabase implementation of ProfileRepository
 * Following SOLID principles and Clean Architecture
 */
export class SupabaseProfileRepository extends StandardRepository implements ProfileRepository {
  private readonly tableName = "profiles";
  private readonly rolesTable = "profile_roles";
  private readonly eventDispatcher?: IEventDispatcher;

  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations
   * @param logger Abstraction for logging
   * @param eventDispatcher Optional event dispatcher for domain events
   */
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger,
    eventDispatcher?: IEventDispatcher
  ) {
    super(dataSource, logger, "Profile", false);
    this.eventDispatcher = eventDispatcher;
  }
  /**
   * Get all profiles
   * @returns Array of all profiles
   * @throws ProfileError if the operation fails
   */
  async getAll(): Promise<Profile[]> {
    try {
      // Get all profiles from the database
      const profilesData = await this.dataSource.get<ProfileDbSchema>(
        this.tableName
      );

      if (!profilesData || profilesData.length === 0) {
        return [];
      }

      const profileIds = profilesData.map((profile) => profile.id);

      // Get roles for all profiles in a single query for efficiency
      const supabaseClient = this.dataSource.getClient() as SupabaseClient;
      const { data: rolesData, error: rolesError } = await supabaseClient
        .from(this.rolesTable)
        .select("profile_id, role")
        .in("profile_id", profileIds);

      // Create a map of profile_id to role for quick lookups
      const roleMap = new Map<string, ProfileRole>();
      if (!rolesError && rolesData) {
        // Cast the role data to ensure type safety
        const typedRolesData = rolesData as unknown as Pick<
          ProfileRoleDbSchema,
          "profile_id" | "role"
        >[];
        typedRolesData.forEach((role) => {
          roleMap.set(role.profile_id, role.role as ProfileRole);
        });
      }

      // Map database entities to domain entities using the mapper
      return SupabaseProfileMapper.toDomainList(profilesData, roleMap);
    } catch (error: unknown) {
      this.logger.error("Failed to get all profiles", error);
      return this.handleError(error);
    }
  }

  async getByAuthId(authId: string): Promise<Profile[]> {
    try {
      // Get profiles from the database
      const profilesData = await this.dataSource.get<ProfileDbSchema>(
        this.tableName,
        { auth_id: authId }
      );

      if (!profilesData || profilesData.length === 0) {
        return [];
      }

      const profileIds = profilesData.map((profile) => profile.id);

      // Get roles for all profiles in a single query for efficiency
      const supabaseClient = this.dataSource.getClient() as SupabaseClient;
      const { data: rolesData, error: rolesError } = await supabaseClient
        .from(this.rolesTable)
        .select("profile_id, role")
        .in("profile_id", profileIds);

      // Create a map of profile_id to role for quick lookups
      const roleMap = new Map<string, ProfileRole>();
      if (!rolesError && rolesData) {
        // Cast the role data to ensure type safety
        const typedRolesData = rolesData as unknown as Pick<
          ProfileRoleDbSchema,
          "profile_id" | "role"
        >[];
        typedRolesData.forEach((role) => {
          roleMap.set(role.profile_id, role.role as ProfileRole);
        });
      }

      // Map database entities to domain entities using the mapper
      return SupabaseProfileMapper.toDomainList(profilesData, roleMap);
    } catch (error: unknown) {
      this.logger.error(`Failed to get profiles for auth_id ${authId}`, error);
      throw new DatabaseOperationException(
        "get by auth id",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get a profile by ID
   * @param id Profile ID
   * @returns Profile domain entity or null if not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getById(id: string): Promise<Profile | null> {
    try {
      // Get profile from database
      const profile = await this.dataSource.getById<ProfileDbSchema>(
        this.tableName,
        id
      );
      if (!profile) {
        return null;
      }

      // Get role for this profile
      const supabaseClient = this.dataSource.getClient() as SupabaseClient;
      const { data: roleData, error: roleError } = await supabaseClient
        .from(this.rolesTable)
        .select("role")
        .eq("profile_id", id)
        .single();

      // Cast the role data to ensure type safety
      const typedRoleData = roleData as unknown as Pick<
        ProfileRoleDbSchema,
        "role"
      > | null;
      const role =
        !roleError && typedRoleData
          ? (typedRoleData.role as ProfileRole)
          : ("user" as ProfileRole);

      // Use the mapper to convert to domain entity
      return SupabaseProfileMapper.toDomain(profile, role);
    } catch (error: unknown) {
      this.logger.error(`Failed to get profile by id: ${id}`, error);
      throw new DatabaseOperationException("get by id", this.entityName, error);
    }
  }

  // The mapToDomainEntity method has been removed and replaced with SupabaseProfileMapper.toDomain

  /**
   * Get the active profile for an auth ID
   * @param authId The authentication ID to find the active profile for
   * @returns The active profile if found, null otherwise
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getActiveByAuthId(authId: string): Promise<Profile | null> {
    try {
      // Get active profile using query parameters
      const profiles = await this.dataSource.get<ProfileDbSchema>(
        this.tableName,
        {
          auth_id: authId,
          is_active: true,
        }
      );

      // Return null if no active profile found
      if (!profiles || profiles.length === 0) {
        return null;
      }

      const activeProfile = profiles[0];

      // Get role for this profile
      const supabaseClient = this.dataSource.getClient() as SupabaseClient;
      const { data: roleData, error: roleError } = await supabaseClient
        .from(this.rolesTable)
        .select("role")
        .eq("profile_id", activeProfile.id)
        .single();

      // Cast the role data to ensure type safety
      const typedRoleData = roleData as unknown as Pick<
        ProfileRoleDbSchema,
        "role"
      > | null;
      const role =
        !roleError && typedRoleData
          ? (typedRoleData.role as ProfileRole)
          : ("user" as ProfileRole);

      // Use the mapper to convert to domain entity
      return SupabaseProfileMapper.toDomain(activeProfile, role);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to get active profile for auth_id ${authId}`,
        error
      );
      throw new DatabaseOperationException(
        "get active by auth id",
        this.entityName,
        error
      );
    }
  }

  /**
   * Create a new profile
   * @param profile Profile data to create
   * @returns Created profile domain entity
   * @throws EntityAlreadyExistsException if a profile with the same username already exists
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async create(profile: ProfileCreate): Promise<Profile> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const profileId = await this.dataSource.callRpc<string>("create_profile", {
        username: profile.username,
        full_name: profile.fullName || null,
        avatar_url: profile.avatarUrl || null,
      });

      if (!profileId) {
        throw new Error("Failed to create profile: No profile ID returned");
      }

      // The RPC function returns a UUID as string
      const profileCreated = await this.getById(profileId);
      if (!profileCreated) {
        throw new Error("Failed to create profile: No profile returned");
      }
      return profileCreated;
    } catch (error) {
      // Check if the error message indicates a duplicate username
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("already exists")
      ) {
        throw new EntityAlreadyExistsException(
          this.entityName,
          "username",
          profile.username
        );
      }

      this.logger.error(
        `Failed to create profile for username ${profile.username} using RPC`,
        error
      );
      throw new DatabaseOperationException(
        "create profile",
        this.entityName,
        error
      );
    }
  }

  /**
   * Update a profile
   * @param id Profile ID to update
   * @param profile Profile data to update
   * @returns Updated profile domain entity
   * @throws EntityNotFoundException if the profile doesn't exist
   * @throws EntityAlreadyExistsException if updating to a username that already exists
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async update(id: string, profile: ProfileUpdate): Promise<Profile> {
    try {
      // Check if profile exists
      const existingProfile = await this.dataSource.getById<ProfileDbSchema>(
        this.tableName,
        id
      );
      if (!existingProfile) {
        throw new EntityNotFoundException(this.entityName, id);
      }

      // If username is being updated, check if it's already taken by another profile
      if (
        profile.username !== undefined &&
        profile.username !== existingProfile.username
      ) {
        const existingProfiles = await this.dataSource.get<ProfileDbSchema>(
          this.tableName,
          { username: profile.username }
        );
        if (existingProfiles && existingProfiles.length > 0) {
          // Make sure it's not the same profile
          const conflictingProfile = existingProfiles.find((p) => p.id !== id);
          if (conflictingProfile) {
            throw new EntityAlreadyExistsException(
              this.entityName,
              "username",
              profile.username
            );
          }
        }
      }

      // Map domain entity to database entity using the mapper
      const dbProfile = SupabaseProfileMapper.toUpdateDb(profile);

      // Update profile in database
      const updatedProfile = await this.dataSource.update<ProfileDbSchema>(
        this.tableName,
        id,
        dbProfile
      );
      if (!updatedProfile) {
        throw new DatabaseOperationException("update", this.entityName);
      }

      // Get role for this profile
      const supabaseClient = this.dataSource.getClient() as SupabaseClient;
      const { data: roleData, error: roleError } = await supabaseClient
        .from(this.rolesTable)
        .select("role")
        .eq("profile_id", id)
        .single();

      // Cast the role data to ensure type safety
      const typedRoleData = roleData as unknown as Pick<
        ProfileRoleDbSchema,
        "role"
      > | null;
      const role =
        !roleError && typedRoleData
          ? (typedRoleData.role as ProfileRole)
          : ("user" as ProfileRole);

      // Use the mapper to convert to domain entity
      return SupabaseProfileMapper.toDomain(updatedProfile, role);
    } catch (error: unknown) {
      // Re-throw if it's already one of our custom exceptions
      if (
        error instanceof EntityNotFoundException ||
        error instanceof EntityAlreadyExistsException ||
        error instanceof DatabaseOperationException
      ) {
        throw error;
      }

      this.logger.error(`Failed to update profile with ID ${id}:`, error);
      throw new DatabaseOperationException("update", this.entityName, error);
    }
  }

  /**
   * Sets a profile as the active profile for an auth user
   * @param id The ID of the profile to set as active
   * @param authId The auth ID of the user to verify ownership
   * @throws ProfileError if the operation fails or profile doesn't belong to the auth user
   */
  async setActive(id: string, authId: string): Promise<void> {
    try {
      // First, verify the profile belongs to the auth user
      const profile = await this.getById(id);

      if (!profile) {
        this.logger.warn(`Profile with ID ${id} not found`);
        throw new ProfileError(
          ProfileErrorType.NOT_FOUND,
          `Profile with ID ${id} not found`,
          { profileId: id }
        );
      }

      if (profile.authId !== authId) {
        this.logger.warn(
          `Profile ${id} does not belong to auth user ${authId}`
        );
        throw new ProfileError(
          ProfileErrorType.UNAUTHORIZED,
          `Profile ${id} does not belong to auth user ${authId}`,
          { profileId: id, authId }
        );
      }

      // Use the RPC function to set the profile as active (handles setting other profiles inactive)
      const supabaseClient = this.dataSource.getClient() as SupabaseClient;
      const { data: result, error: activationError } = await supabaseClient.rpc(
        "set_profile_active",
        { profile_id: id }
      );

      if (activationError) {
        this.logger.error(
          `Error setting profile ${id} as active:`,
          activationError
        );
        throw new ProfileError(
          ProfileErrorType.OPERATION_FAILED,
          `Failed to set profile ${id} as active`,
          { profileId: id },
          activationError
        );
      }

      if (!(result as boolean)) {
        throw new ProfileError(
          ProfileErrorType.OPERATION_FAILED,
          `Failed to set profile ${id} as active`,
          { profileId: id }
        );
      }

      return;
    } catch (error: unknown) {
      if (error instanceof ProfileError) {
        throw error;
      }
      this.logger.error(`Error setting profile ${id} as active:`, error);
      this.handleError(error);
    }
  }

  /**
   * Deletes a profile by ID
   * @param id The ID of the profile to delete
   * @throws ProfileError if attempting to delete an active profile or if the operation fails
   */
  async delete(id: string): Promise<void> {
    try {
      // Get the profile first to check if it exists and if it's active
      const profile = await this.getById(id);

      if (!profile) {
        this.logger.warn(`Profile with ID ${id} not found for deletion`);
        throw new ProfileError(
          ProfileErrorType.NOT_FOUND,
          `Profile with ID ${id} not found for deletion`,
          { profileId: id }
        );
      }

      // Prevent deletion of active profiles for safety
      if (profile.isActive) {
        this.logger.warn(`Attempted to delete active profile ${id}`);
        throw new ProfileError(
          ProfileErrorType.CONSTRAINT_VIOLATION,
          "Cannot delete active profile. Set another profile as active first.",
          { profileId: id, isActive: true }
        );
      }

      // Delete the profile from the database
      await this.dataSource.delete(this.tableName, id);
      this.logger.info(`Successfully deleted profile ${id}`);
      return;
    } catch (error: unknown) {
      if (error instanceof ProfileError) {
        throw error;
      }
      this.logger.error(`Error deleting profile ${id}:`, error);
      this.handleError(error);
    }
  }

  /**
   * Get the current user's profile
   * @returns Profile domain entity or null if not found or not authenticated
   * @throws ProfileError if the operation fails
   */
  async getCurrentUserProfile(): Promise<Profile | null> {
    try {
      // Get the current user's auth ID from the Supabase client
      const supabaseClient = this.dataSource.getClient() as SupabaseClient;
      const {
        data: { user },
        error: authError,
      } = await supabaseClient.auth.getUser();

      if (authError || !user) {
        this.logger.warn(
          "No authenticated user found when getting current user profile"
        );
        return null;
      }

      // Get the active profile for the current user
      return this.getActiveByAuthId(user.id);
    } catch (error: unknown) {
      if (error instanceof ProfileError) {
        throw error;
      }
      this.logger.error("Error getting current user profile:", error);
      this.handleError(error);
    }
  }

  /**
   * Get the active profile for the current authenticated user using RPC
   * This uses the get_active_profile RPC function defined in the migrations
   * @returns Active profile for the current user or null if not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getActiveProfileRpc(): Promise<Profile | null> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const data = await this.dataSource.callRpc<ProfileDbSchema[]>("get_active_profile", {});

      if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
      }

      // Map the response to our domain entity using the mapper
      return SupabaseProfileMapper.toDomain(data[0]);
    } catch (error) {
      this.logger.error("Failed to get active profile using RPC", error);
      throw new DatabaseOperationException(
        "get active profile",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get all profiles for the current authenticated user using RPC
   * This uses the get_user_profiles RPC function defined in the migrations
   * @returns Array of profiles for the current user
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getUserProfilesRpc(): Promise<Profile[]> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const data = await this.dataSource.callRpc<ProfileDbSchema[]>("get_user_profiles", {});

      if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
      }

      // Map the response to our domain entity using the mapper
      return data.map((profile) => SupabaseProfileMapper.toDomain(profile));
    } catch (error) {
      this.logger.error("Failed to get user profiles using RPC", error);
      throw new DatabaseOperationException(
        "get user profiles",
        this.entityName,
        error
      );
    }
  }

  /**
   * Set a profile as active for the current authenticated user using RPC
   * This uses the set_profile_active RPC function defined in the migrations
   * @param profileId Profile ID to set as active
   * @returns True if successful, false otherwise
   * @throws EntityNotFoundException if the profile is not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async setProfileActiveRpc(profileId: string): Promise<boolean> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const result = await this.dataSource.callRpc<boolean>("set_profile_active", {
        profile_id: profileId,
      });

      return !!result; // RPC function returns a boolean
    } catch (error: unknown) {
      // Check if the error message indicates that the profile was not found
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("not found") ||
        errorMessage.includes("does not belong")
      ) {
        throw new EntityNotFoundException(this.entityName, profileId);
      }

      this.logger.error(
        `Failed to set profile ${profileId} as active using RPC`,
        error
      );
      throw new DatabaseOperationException(
        "set profile active",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get the active profile ID for the current authenticated user using RPC
   * This uses the get_active_profile_id RPC function defined in the migrations
   * @returns Active profile ID for the current user or null if not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getActiveProfileIdRpc(): Promise<string | null> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const result = await this.dataSource.callRpc<string | null>("get_active_profile_id", {});

      // The RPC function returns a UUID or null
      return result;
    } catch (error) {
      this.logger.error("Failed to get active profile ID using RPC", error);
      throw new DatabaseOperationException(
        "get active profile ID",
        this.entityName,
        error
      );
    }
  }

  /**
   * Create a new profile for the current authenticated user using RPC
   * This uses the create_profile RPC function defined in the migrations
   * @param profile Profile data to create
   * @returns ID of the created profile
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async createProfileRpc(profile: {
    username: string;
    fullName?: string;
    avatarUrl?: string;
  }): Promise<string> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const profileId = await this.dataSource.callRpc<string>("create_profile", {
        username: profile.username,
        full_name: profile.fullName || null,
        avatar_url: profile.avatarUrl || null,
      });

      if (!profileId) {
        throw new Error("Failed to create profile: No profile ID returned");
      }

      // The RPC function returns a UUID as string
      return profileId;
    } catch (error) {
      // Check if the error message indicates a duplicate username
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("already exists")
      ) {
        throw new EntityAlreadyExistsException(
          this.entityName,
          "username",
          profile.username
        );
      }

      this.logger.error(
        `Failed to create profile for username ${profile.username} using RPC`,
        error
      );
      throw new DatabaseOperationException(
        "create profile",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get the role for a profile using RPC
   * This uses the get_profile_role RPC function defined in the migrations
   * @param profileId Profile ID to get the role for
   * @returns Profile role
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getProfileRoleRpc(profileId: string): Promise<ProfileRole> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const role = await this.dataSource.callRpc<ProfileRole>("get_profile_role", {
        profile_id: profileId,
      });

      if (!role) {
        return "user" as ProfileRole; // Default role
      }

      return role;
    } catch (error) {
      this.logger.error(
        `Failed to get role for profile ${profileId} using RPC`,
        error
      );
      throw new DatabaseOperationException(
        "get profile role",
        this.entityName,
        error
      );
    }
  }

  /**
   * Get the role for the current authenticated user's active profile using RPC
   * This uses the get_active_profile_role RPC function defined in the migrations
   * @returns Profile role for the active profile
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async getActiveProfileRoleRpc(): Promise<ProfileRole> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const role = await this.dataSource.callRpc<ProfileRole>("get_active_profile_role", {});

      if (!role) {
        return "user" as ProfileRole; // Default role
      }

      // The RPC function returns a profile_role enum value
      return role;
    } catch (error) {
      this.logger.error("Failed to get active profile role using RPC", error);
      throw new DatabaseOperationException(
        "get active profile role",
        this.entityName,
        error
      );
    }
  }

  /**
   * Set the role for a profile using RPC (admin only)
   * This uses the set_profile_role RPC function defined in the migrations
   * @param profileId Profile ID to set the role for
   * @param role Role to set
   * @returns True if successful
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  async setProfileRoleRpc(
    profileId: string,
    role: ProfileRole
  ): Promise<boolean> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const result = await this.dataSource.callRpc<boolean>("set_profile_role", {
        target_profile_id: profileId,
        new_role: role,
      });

      return !!result; // RPC function returns a boolean
    } catch (error) {
      // Check if the error message indicates permission issue
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("administrators") ||
        errorMessage.includes("admin")
      ) {
        throw new DatabaseOperationException(
          "set profile role",
          this.entityName,
          new Error("Only administrators can change profile roles")
        );
      }

      this.logger.error(
        `Failed to set role for profile ${profileId} using RPC`,
        error
      );
      throw new DatabaseOperationException(
        "set profile role",
        this.entityName,
        error
      );
    }
  }

  /**
   * Handles repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation description
   * @param context Optional context information
   * @throws ProfileError with appropriate error type
   */
  public handleError(error: unknown, operation?: string, context?: string): never {
    // Create a proper context object for ProfileError
    const errorContext: Record<string, unknown> = {
      operation: operation || 'unknown operation',
      entityName: this.entityName,
      contextInfo: context || undefined
    };

    this.logger.error(`Error in ${this.entityName} repository: ${errorContext.operation as string}`, error, errorContext);

    // Convert database errors to domain errors
    if (error instanceof DatabaseError) {
      switch (error.type) {
        case DatabaseErrorType.NOT_FOUND:
          throw new ProfileError(
            ProfileErrorType.NOT_FOUND,
            `${operation || 'Operation'} failed: ${error.message}`,
            errorContext,
            error
          );
        case DatabaseErrorType.DUPLICATE_ENTRY:
          throw new ProfileError(
            ProfileErrorType.ALREADY_EXISTS,
            `${operation || 'Operation'} failed: ${error.message}`,
            errorContext,
            error
          );
        case DatabaseErrorType.VALIDATION_ERROR:
          throw new ProfileError(
            ProfileErrorType.VALIDATION_ERROR,
            `${operation || 'Operation'} failed: ${error.message}`,
            errorContext,
            error
          );
        case DatabaseErrorType.CONSTRAINT_VIOLATION:
          throw new ProfileError(
            ProfileErrorType.CONSTRAINT_VIOLATION,
            `${operation || 'Operation'} failed: ${error.message}`,
            errorContext,
            error
          );
        case DatabaseErrorType.PERMISSION_DENIED:
          throw new ProfileError(
            ProfileErrorType.UNAUTHORIZED,
            `${operation || 'Operation'} failed: ${error.message}`,
            errorContext,
            error
          );
        default:
          throw new ProfileError(
            ProfileErrorType.OPERATION_FAILED,
            `${operation || 'Operation'} failed: ${error.message}`,
            errorContext,
            error
          );
      }
    }

    // Handle repository exceptions
    if (error instanceof EntityNotFoundException) {
      throw new ProfileError(
        ProfileErrorType.NOT_FOUND,
        `${operation || 'Operation'} failed: ${error.message}`,
        errorContext,
        error
      );
    }

    if (error instanceof EntityAlreadyExistsException) {
      throw new ProfileError(
        ProfileErrorType.ALREADY_EXISTS,
        `${operation || 'Operation'} failed: ${error.message}`,
        errorContext,
        error
      );
    }

    if (error instanceof DatabaseOperationException) {
      throw new ProfileError(
        ProfileErrorType.OPERATION_FAILED,
        `${operation || 'Operation'} failed: ${error.message}`,
        errorContext,
        error
      );
    }

    // Handle other types of errors
    const message = error instanceof Error
      ? `${operation || 'Operation'} failed: ${error.message}`
      : `${operation || 'Unknown operation'} failed in ${context || this.entityName} repository`;

    throw new ProfileError(ProfileErrorType.UNKNOWN, message, errorContext, error);
  }
}
