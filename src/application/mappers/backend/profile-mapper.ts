import { ProfileDTO, ProfileStatsDTO } from '@/src/application/dtos/backend/profiles-dto';
import { ProfileEntity, ProfileStatsEntity } from '@/src/domain/entities/backend/backend-profile.entity';

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class ProfileMapper {
  /**
   * Map domain entity to DTO
   * @param entity Profile domain entity
   * @returns Profile DTO
   */
  public static toDTO(entity: ProfileEntity): ProfileDTO {
    return {
      id: entity.id,
      authId: entity.authId,
      username: entity.username,
      fullName: entity.fullName,
      phone: entity.phone,
      email: entity.email,
      avatarUrl: entity.avatarUrl || undefined,
      dateOfBirth: entity.dateOfBirth || undefined,
      gender: entity.gender || undefined,
      address: entity.address || undefined,
      bio: entity.bio || undefined,
      preferences: {
        language: entity.preferences.language,
        notifications: entity.preferences.notifications,
        theme: entity.preferences.theme,
      },
      socialLinks: entity.socialLinks ? {
        facebook: entity.socialLinks.facebook || undefined,
        line: entity.socialLinks.line || undefined,
        instagram: entity.socialLinks.instagram || undefined
      } : undefined,
      verificationStatus: entity.verificationStatus,
      privacySettings: entity.privacySettings,
      lastLogin: entity.lastLogin || undefined,
      loginCount: entity.loginCount,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Profile stats domain entity
   * @returns Profile stats DTO
   */
  public static statsToDTO(entity: ProfileStatsEntity): ProfileStatsDTO {
    return {
      totalProfiles: entity.totalProfiles,
      verifiedProfiles: entity.verifiedProfiles,
      pendingVerification: entity.pendingVerification,
      activeProfilesToday: entity.activeProfilesToday,
      newProfilesThisMonth: entity.newProfilesThisMonth,
      profilesByGender: {
        male: entity.profilesByGender.male || 0,
        female: entity.profilesByGender.female || 0,
        other: entity.profilesByGender.other || 0,
        notSpecified: entity.profilesByGender.notSpecified || 0
      }
    };
  }
}
