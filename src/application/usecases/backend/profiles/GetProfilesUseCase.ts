import type { PaginatedProfilesEntity } from '@/src/domain/entities/backend/backend-profile.entity';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export interface GetProfilesUseCaseInput {
  page: number;
  perPage: number;
}

export interface GetProfilesUseCaseOutput {
  profiles: PaginatedProfilesEntity;
}

export interface IGetProfilesUseCase {
  execute(input: GetProfilesUseCaseInput): Promise<GetProfilesUseCaseOutput>;
}

export class GetProfilesUseCase implements IGetProfilesUseCase {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: GetProfilesUseCaseInput): Promise<GetProfilesUseCaseOutput> {
    const { page, perPage } = input;

    // Validate input
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error('Per page must be between 1 and 100');
    }

    const profiles = await this.profileRepository.getPaginatedProfiles({
      page,
      limit: perPage
    });

    return {
      profiles
    };
  }
}
