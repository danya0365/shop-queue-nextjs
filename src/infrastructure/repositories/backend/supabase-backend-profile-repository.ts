import { PaginatedProfilesEntity, ProfileEntity, ProfileStatsEntity } from "../../../domain/entities/backend/backend-profile.entity";
import { DatabaseDataSource, QueryOptions, SortDirection } from "../../../domain/interfaces/datasources/database-datasource";
import { Logger } from "../../../domain/interfaces/logger";
import { PaginationParams } from "../../../domain/interfaces/pagination-types";
import { BackendProfileError, BackendProfileErrorType, BackendProfileRepository } from "../../../domain/repositories/backend/backend-profile-repository";
import { SupabaseBackendProfileMapper } from "../../mappers/backend/supabase-backend-profile.mapper";
import { ProfileSchema, ProfileStatsSchema } from "../../schemas/backend/profile.schema";
import { BackendRepository } from "../base/backend-repository";

// Extended types for joined data
type ProfileSchemaRecord = Record<string, unknown> & ProfileSchema;
type ProfileStatsSchemaRecord = Record<string, unknown> & ProfileStatsSchema;

/**
 * Supabase implementation of the profile repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseBackendProfileRepository extends BackendRepository implements BackendProfileRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendProfile");
  }

  /**
   * Get paginated profiles data from database
   * @param params Pagination parameters
   * @returns Paginated profiles data
   */
  async getPaginatedProfiles(params: PaginationParams): Promise<PaginatedProfilesEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Use getAdvanced with proper QueryOptions format
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for basic profile data
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset
        }
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const profiles = await this.dataSource.getAdvanced<ProfileSchemaRecord>(
        'profiles',
        queryOptions
      );

      // Count total items
      const totalItems = await this.dataSource.count('profiles');

      // Map database results to domain entities
      const mappedProfiles = profiles.map(profile => {
        return SupabaseBackendProfileMapper.toDomain(profile);
      });

      // Create pagination metadata
      const pagination = SupabaseBackendProfileMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: mappedProfiles,
        pagination
      };
    } catch (error) {
      if (error instanceof BackendProfileError) {
        throw error;
      }

      this.logger.error('Error in getPaginatedProfiles', { error });
      throw new BackendProfileError(
        BackendProfileErrorType.UNKNOWN,
        'An unexpected error occurred while fetching profiles',
        'getPaginatedProfiles',
        {},
        error
      );
    }
  }

  /**
   * Get profile statistics from database
   * @returns Profile statistics
   */
  async getProfileStats(): Promise<ProfileStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for profile statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData = await this.dataSource.getAdvanced<ProfileStatsSchemaRecord>(
        'profile_stats_view',
        queryOptions
      );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalProfiles: 0,
          verifiedProfiles: 0,
          pendingVerification: 0,
          activeProfilesToday: 0,
          newProfilesThisMonth: 0,
          profilesByGender: {
            male: 0,
            female: 0,
            other: 0,
            notSpecified: 0
          }
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseBackendProfileMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof BackendProfileError) {
        throw error;
      }

      this.logger.error('Error in getProfileStats', { error });
      throw new BackendProfileError(
        BackendProfileErrorType.UNKNOWN,
        'An unexpected error occurred while fetching profile statistics',
        'getProfileStats',
        {},
        error
      );
    }
  }

  /**
   * Get profile by ID
   * @param id Profile ID
   * @returns Profile entity or null if not found
   */
  async getProfileById(id: string): Promise<ProfileEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      // Use extended type that satisfies Record<string, unknown> constraint
      const profile = await this.dataSource.getById<ProfileSchemaRecord>(
        'profiles',
        id,
        {
          select: ['*']
        }
      );

      if (!profile) {
        return null;
      }

      // Map database result to domain entity
      return SupabaseBackendProfileMapper.toDomain(profile);
    } catch (error) {
      if (error instanceof BackendProfileError) {
        throw error;
      }

      this.logger.error('Error in getProfileById', { error, id });
      throw new BackendProfileError(
        BackendProfileErrorType.UNKNOWN,
        'An unexpected error occurred while fetching profile',
        'getProfileById',
        { id },
        error
      );
    }
  }

  /**
   * Create a new profile
   * @param profile Profile entity to create
   * @returns Created profile entity
   */
  async createProfile(profile: Omit<ProfileEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProfileEntity> {
    try {
      // Convert domain entity to database schema
      const profileSchema = {
        user_id: profile.userId,
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        avatar_url: profile.avatarUrl,
        date_of_birth: profile.dateOfBirth,
        gender: profile.gender,
        address: profile.address,
        bio: profile.bio,
        preferences: profile.preferences,
        social_links: profile.socialLinks,
        verification_status: profile.verificationStatus,
        privacy_settings: profile.privacySettings,
        last_login: profile.lastLogin,
        login_count: profile.loginCount,
        is_active: profile.isActive
      };

      // Insert new profile
      const createdProfile = await this.dataSource.insert<ProfileSchemaRecord>(
        'profiles',
        profileSchema
      );

      if (!createdProfile) {
        throw new BackendProfileError(
          BackendProfileErrorType.OPERATION_FAILED,
          'Failed to create profile',
          'createProfile',
          { profile }
        );
      }

      // Map database result to domain entity
      return SupabaseBackendProfileMapper.toDomain(createdProfile);
    } catch (error) {
      if (error instanceof BackendProfileError) {
        throw error;
      }

      this.logger.error('Error in createProfile', { error, profile });
      throw new BackendProfileError(
        BackendProfileErrorType.UNKNOWN,
        'An unexpected error occurred while creating profile',
        'createProfile',
        { profile },
        error
      );
    }
  }

  /**
   * Update an existing profile
   * @param id Profile ID
   * @param profile Profile data to update
   * @returns Updated profile entity
   */
  async updateProfile(id: string, profile: Partial<ProfileEntity>): Promise<ProfileEntity> {
    try {
      // Check if profile exists
      const existingProfile = await this.getProfileById(id);
      if (!existingProfile) {
        throw new BackendProfileError(
          BackendProfileErrorType.NOT_FOUND,
          `Profile with ID ${id} not found`,
          'updateProfile',
          { id, profile }
        );
      }

      // Convert domain entity to database schema
      const updateData: Partial<ProfileSchema> = {};

      // Map only the fields that are provided
      if (profile.userId !== undefined) updateData.user_id = profile.userId;
      if (profile.name !== undefined) updateData.name = profile.name;
      if (profile.phone !== undefined) updateData.phone = profile.phone;
      if (profile.email !== undefined) updateData.email = profile.email;
      if (profile.avatarUrl !== undefined) updateData.avatar_url = profile.avatarUrl;
      if (profile.dateOfBirth !== undefined) updateData.date_of_birth = profile.dateOfBirth;
      if (profile.gender !== undefined) updateData.gender = profile.gender;
      if (profile.address !== undefined) updateData.address = profile.address;
      if (profile.bio !== undefined) updateData.bio = profile.bio;
      if (profile.preferences !== undefined) updateData.preferences = profile.preferences;
      if (profile.socialLinks !== undefined) updateData.social_links = profile.socialLinks;
      if (profile.verificationStatus !== undefined) updateData.verification_status = profile.verificationStatus;
      if (profile.privacySettings !== undefined) {
        updateData.privacy_settings = {
          show_phone: profile.privacySettings.showPhone,
          show_email: profile.privacySettings.showEmail,
          show_address: profile.privacySettings.showAddress
        };
      }
      if (profile.lastLogin !== undefined) updateData.last_login = profile.lastLogin;
      if (profile.loginCount !== undefined) updateData.login_count = profile.loginCount;
      if (profile.isActive !== undefined) updateData.is_active = profile.isActive;

      // Update profile
      const updatedProfile = await this.dataSource.update<ProfileSchemaRecord>(
        'profiles',
        id,
        updateData
      );

      if (!updatedProfile) {
        throw new BackendProfileError(
          BackendProfileErrorType.OPERATION_FAILED,
          `Failed to update profile with ID ${id}`,
          'updateProfile',
          { id, profile }
        );
      }

      // Map database result to domain entity
      return SupabaseBackendProfileMapper.toDomain(updatedProfile);
    } catch (error) {
      if (error instanceof BackendProfileError) {
        throw error;
      }

      this.logger.error('Error in updateProfile', { error, id, profile });
      throw new BackendProfileError(
        BackendProfileErrorType.UNKNOWN,
        'An unexpected error occurred while updating profile',
        'updateProfile',
        { id, profile },
        error
      );
    }
  }

  /**
   * Delete a profile
   * @param id Profile ID
   * @returns true if deleted, false if not found
   */
  async deleteProfile(id: string): Promise<boolean> {
    try {
      // Check if profile exists
      const existingProfile = await this.getProfileById(id);
      if (!existingProfile) {
        return false;
      }

      // Delete profile
      const result = await this.dataSource.delete(
        'profiles',
        id
      );

      return result !== null;
    } catch (error) {
      if (error instanceof BackendProfileError) {
        throw error;
      }

      this.logger.error('Error in deleteProfile', { error, id });
      throw new BackendProfileError(
        BackendProfileErrorType.UNKNOWN,
        'An unexpected error occurred while deleting profile',
        'deleteProfile',
        { id },
        error
      );
    }
  }
}
