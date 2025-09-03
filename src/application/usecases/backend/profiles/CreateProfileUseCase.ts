import { CreateProfileUseCaseInput, ProfileDTO } from '@/src/application/dtos/backend/profiles-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ProfileMapper } from '@/src/application/mappers/backend/profile-mapper';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export class CreateProfileUseCase implements IUseCase<CreateProfileUseCaseInput, ProfileDTO> {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: CreateProfileUseCaseInput): Promise<ProfileDTO> {
    // Validate required fields
    if (!input.userId) {
      throw new Error('User ID is required');
    }
    if (!input.name) {
      throw new Error('Name is required');
    }
    if (!input.phone) {
      throw new Error('Phone is required');
    }
    if (!input.email) {
      throw new Error('Email is required');
    }

    // Create profile with default values for optional fields
    const profileData = {
      authId: input.userId,
      username: input.name,
      fullName: input.name,
      phone: input.phone,
      email: input.email,
      avatarUrl: input.avatarUrl || null,
      dateOfBirth: input.dateOfBirth || null,
      gender: input.gender || null,
      address: input.address || null,
      bio: input.bio || null,
      preferences: input.preferences,
      socialLinks: input.socialLinks ? {
        facebook: input.socialLinks.facebook || null,
        line: input.socialLinks.line || null,
        instagram: input.socialLinks.instagram || null
      } : null,
      verificationStatus: input.verificationStatus,
      privacySettings: input.privacySettings,
      lastLogin: input.lastLogin || null,
      loginCount: input.loginCount || 0,
      isActive: input.isActive !== undefined ? input.isActive : true
    };

    const profile = await this.profileRepository.createProfile(profileData);

    return ProfileMapper.toDTO(profile);
  }
}
