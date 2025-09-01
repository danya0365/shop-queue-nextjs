import type { ProfileEntity } from '@/src/domain/entities/backend/backend-profile.entity';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export interface GetProfileByIdUseCaseInput {
  id: string;
}

export interface GetProfileByIdUseCaseOutput {
  profile: ProfileEntity | null;
}

export interface IGetProfileByIdUseCase {
  execute(input: GetProfileByIdUseCaseInput): Promise<GetProfileByIdUseCaseOutput>;
}

export class GetProfileByIdUseCase implements IGetProfileByIdUseCase {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: GetProfileByIdUseCaseInput): Promise<GetProfileByIdUseCaseOutput> {
    const { id } = input;

    // Validate input
    if (!id) {
      throw new Error('Profile ID is required');
    }

    const profile = await this.profileRepository.getProfileById(id);

    return {
      profile
    };
  }
}
