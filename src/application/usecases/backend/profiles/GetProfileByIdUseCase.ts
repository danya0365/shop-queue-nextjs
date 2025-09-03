import { ProfileDTO } from '@/src/application/dtos/backend/profiles-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ProfileMapper } from '@/src/application/mappers/backend/profile-mapper';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export class GetProfileByIdUseCase implements IUseCase<string, ProfileDTO> {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: string): Promise<ProfileDTO> {
    const id = input;

    // Validate input
    if (!id) {
      throw new Error('Profile ID is required');
    }

    const profile = await this.profileRepository.getProfileById(id);

    if (!profile) {
      throw new Error('Profile not found');
    }

    return ProfileMapper.toDTO(profile);
  }
}
