import type { ProfileEntity, ProfileGender, ProfileVerificationStatus } from '@/src/domain/entities/backend/backend-profile.entity';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export interface UpdateProfileUseCaseInput {
  id: string;
  userId?: string;
  name?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: ProfileGender | null;
  address?: string | null;
  bio?: string | null;
  preferences?: {
    language: 'th' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  socialLinks?: {
    facebook: string | null;
    line: string | null;
    instagram: string | null;
  } | null;
  verificationStatus?: ProfileVerificationStatus;
  privacySettings?: {
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
  };
  lastLogin?: string | null;
  loginCount?: number;
  isActive?: boolean;
}

export interface UpdateProfileUseCaseOutput {
  profile: ProfileEntity;
}

export interface IUpdateProfileUseCase {
  execute(input: UpdateProfileUseCaseInput): Promise<UpdateProfileUseCaseOutput>;
}

export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: UpdateProfileUseCaseInput): Promise<UpdateProfileUseCaseOutput> {
    const { id } = input;

    // Validate input
    if (!id) {
      throw new Error('Profile ID is required');
    }

    // Create update data object - exclude id from update fields
    const updateFields = Object.fromEntries(
      Object.entries(input).filter(([key]) => key !== 'id')
    );
    
    // Check if at least one field to update is provided
    if (Object.keys(updateFields).length === 0) {
      throw new Error('At least one field to update must be provided');
    }
    
    // Fix socialLinks structure if present
    if (updateFields.socialLinks) {
      updateFields.socialLinks = {
        facebook: updateFields.socialLinks.facebook || null,
        line: updateFields.socialLinks.line || null,
        instagram: updateFields.socialLinks.instagram || null
      };
    }

    // Update profile
    const profile = await this.profileRepository.updateProfile(id, updateFields);

    return {
      profile
    };
  }
}
