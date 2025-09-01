import type { ProfileEntity, ProfileGender, ProfileVerificationStatus } from '@/src/domain/entities/backend/backend-profile.entity';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export interface CreateProfileUseCaseInput {
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: ProfileGender | null;
  address?: string | null;
  bio?: string | null;
  preferences: {
    language: 'th' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  socialLinks?: {
    facebook: string | null;
    line: string | null;
    instagram: string | null;
  } | null;
  verificationStatus: ProfileVerificationStatus;
  privacySettings: {
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
  };
  lastLogin?: string | null;
  loginCount?: number;
  isActive?: boolean;
}

export interface CreateProfileUseCaseOutput {
  profile: ProfileEntity;
}

export interface ICreateProfileUseCase {
  execute(input: CreateProfileUseCaseInput): Promise<CreateProfileUseCaseOutput>;
}

export class CreateProfileUseCase implements ICreateProfileUseCase {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: CreateProfileUseCaseInput): Promise<CreateProfileUseCaseOutput> {
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

    return {
      profile
    };
  }
}
