import { ProfileEntity, ProfileGender, ProfileStatsEntity, ProfileVerificationStatus } from "../../../domain/entities/backend/backend-profile.entity";
import { PaginationMeta } from "../../../domain/interfaces/pagination-types";
import { ProfileSchema, ProfileStatsSchema } from "../../schemas/backend/profile.schema";

/**
 * Mapper class for converting between profile database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseBackendProfileMapper {
  /**
   * Map database schema to domain entity
   * @param schema Profile database schema
   * @returns Profile domain entity
   */
  public static toDomain(schema: ProfileSchema): ProfileEntity {
    return {
      id: schema.id,
      userId: schema.user_id,
      name: schema.name,
      phone: schema.phone,
      email: schema.email,
      avatarUrl: schema.avatar_url,
      dateOfBirth: schema.date_of_birth,
      gender: schema.gender as ProfileGender | null,
      address: schema.address,
      bio: schema.bio,
      preferences: {
        language: schema.preferences.language,
        notifications: schema.preferences.notifications,
        theme: schema.preferences.theme,
      },
      socialLinks: schema.social_links,
      verificationStatus: schema.verification_status as ProfileVerificationStatus,
      privacySettings: {
        showPhone: schema.privacy_settings.show_phone,
        showEmail: schema.privacy_settings.show_email,
        showAddress: schema.privacy_settings.show_address,
      },
      lastLogin: schema.last_login,
      loginCount: schema.login_count,
      isActive: schema.is_active,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Profile domain entity
   * @returns Profile database schema
   */
  public static toSchema(entity: ProfileEntity): ProfileSchema {
    return {
      id: entity.id,
      user_id: entity.userId,
      name: entity.name,
      phone: entity.phone,
      email: entity.email,
      avatar_url: entity.avatarUrl,
      date_of_birth: entity.dateOfBirth,
      gender: entity.gender,
      address: entity.address,
      bio: entity.bio,
      preferences: {
        language: entity.preferences.language,
        notifications: entity.preferences.notifications,
        theme: entity.preferences.theme,
      },
      social_links: entity.socialLinks,
      verification_status: entity.verificationStatus,
      privacy_settings: {
        show_phone: entity.privacySettings.showPhone,
        show_email: entity.privacySettings.showEmail,
        show_address: entity.privacySettings.showAddress,
      },
      last_login: entity.lastLogin,
      login_count: entity.loginCount,
      is_active: entity.isActive,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }

  /**
   * Map profile stats schema to domain entity
   * @param schema Profile stats database schema
   * @returns Profile stats domain entity
   */
  public static statsToEntity(schema: ProfileStatsSchema): ProfileStatsEntity {
    return {
      totalProfiles: schema.total_profiles,
      verifiedProfiles: schema.verified_profiles,
      pendingVerification: schema.pending_verification,
      activeProfilesToday: schema.active_profiles_today,
      newProfilesThisMonth: schema.new_profiles_this_month,
      profilesByGender: {
        male: schema.profiles_by_gender_male,
        female: schema.profiles_by_gender_female,
        other: schema.profiles_by_gender_other,
        notSpecified: schema.profiles_by_gender_not_specified
      }
    };
  }

  /**
   * Create pagination metadata from database results
   * @param page Current page number
   * @param limit Items per page
   * @param totalItems Total number of items
   * @returns Pagination metadata
   */
  public static createPaginationMeta(
    page: number,
    limit: number,
    totalItems: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}
