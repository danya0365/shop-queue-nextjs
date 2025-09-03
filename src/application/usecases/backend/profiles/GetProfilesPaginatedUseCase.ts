import type { PaginatedProfilesDTO } from '@/src/application/dtos/backend/profiles-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ProfileMapper } from '@/src/application/mappers/backend/profile-mapper';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export interface GetProfilesPaginatedUseCaseInput {
  page: number;
  perPage: number;
}

export class GetProfilesPaginatedUseCase implements IUseCase<GetProfilesPaginatedUseCaseInput, PaginatedProfilesDTO> {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(input: GetProfilesPaginatedUseCaseInput): Promise<PaginatedProfilesDTO> {
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
    const profilesDTO = profiles.data.map(profile => ProfileMapper.toDTO(profile));

    return {
      data: profilesDTO,
      pagination: profiles.pagination
    };
  }
}
