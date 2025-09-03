import { ProfileStatsDTO } from '@/src/application/dtos/backend/profiles-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ProfileMapper } from '@/src/application/mappers/backend/profile-mapper';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export class GetProfileStatsUseCase implements IUseCase<void, ProfileStatsDTO> {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(): Promise<ProfileStatsDTO> {
    const stats = await this.profileRepository.getProfileStats();
    const statsDTO = ProfileMapper.statsToDTO(stats);
    return statsDTO;
  }
}
