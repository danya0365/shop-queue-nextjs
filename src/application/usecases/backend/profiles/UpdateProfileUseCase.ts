import { ProfileDTO, UpdateProfileUseCaseInput } from '@/src/application/dtos/backend/profiles-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ProfileMapper } from '@/src/application/mappers/backend/profile-mapper';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';


export class UpdateProfileUseCase implements IUseCase<UpdateProfileUseCaseInput, ProfileDTO> {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: UpdateProfileUseCaseInput): Promise<ProfileDTO> {
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

    return ProfileMapper.toDTO(profile);
  }
}
