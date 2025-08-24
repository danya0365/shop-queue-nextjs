import {
  Profile,
  ProfileCreate,
  ProfileRole,
  ProfileUpdate,
} from "../../domain/entities/profile";
import { ProfileDbSchema } from "../schemas/profile-schema";

/**
 * Mapper class for converting between database and domain profile entities
 * Following Single Responsibility Principle by focusing only on mapping
 */
export class SupabaseProfileMapper {
  /**
   * Maps a database profile entity to a domain profile entity
   * @param dbProfile The database profile entity
   * @param role The role for this profile (defaults to 'user')
   * @returns The domain profile entity
   */
  static toDomain(
    dbProfile: ProfileDbSchema,
    role: ProfileRole = "user"
  ): Profile {
    return {
      id: dbProfile.id,
      authId: dbProfile.auth_id,
      username: dbProfile.username,
      fullName: dbProfile.full_name || undefined,
      avatarUrl: dbProfile.avatar_url || undefined,
      role: role,
      isActive: dbProfile.is_active,
      createdAt: new Date(dbProfile.created_at),
      updatedAt: new Date(dbProfile.updated_at),
    };
  }

  /**
   * Maps multiple database profile entities to domain profile entities
   * @param dbProfiles The database profile entities
   * @param roleMap Optional map of profile IDs to roles
   * @returns Array of domain profile entities
   */
  static toDomainList(
    dbProfiles: ProfileDbSchema[],
    roleMap?: Map<string, ProfileRole>
  ): Profile[] {
    return dbProfiles.map((profile) =>
      this.toDomain(profile, roleMap?.get(profile.id) || "user")
    );
  }

  /**
   * Maps a domain profile create entity to a database profile entity
   * @param profile The domain profile create entity
   * @returns The database profile entity
   */
  static toDb(
    profile: ProfileCreate
  ): Omit<ProfileDbSchema, "id" | "created_at" | "updated_at"> {
    return {
      auth_id: profile.authId,
      username: profile.username,
      full_name: profile.fullName || null,
      avatar_url: profile.avatarUrl || null,
      is_active: false, // New profiles are not active by default
    };
  }

  /**
   * Maps a domain profile update entity to a database profile entity
   * @param profile The domain profile update entity
   * @returns The database profile entity (partial)
   */
  static toUpdateDb(
    profile: ProfileUpdate
  ): Partial<
    Omit<ProfileDbSchema, "id" | "auth_id" | "created_at" | "updated_at">
  > {
    const dbProfile: Partial<ProfileDbSchema> = {};

    if (profile.username !== undefined) {
      dbProfile.username = profile.username;
    }

    if (profile.fullName !== undefined) {
      dbProfile.full_name = profile.fullName || null;
    }

    if (profile.avatarUrl !== undefined) {
      dbProfile.avatar_url = profile.avatarUrl || null;
    }

    return dbProfile;
  }
}
