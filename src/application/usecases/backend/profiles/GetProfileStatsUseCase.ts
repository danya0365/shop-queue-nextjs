import type { ProfileStatsEntity } from '@/src/domain/entities/backend/backend-profile.entity';
import type { BackendProfileRepository } from '@/src/domain/repositories/backend/backend-profile-repository';

export interface GetProfileStatsUseCaseOutput {
  stats: ProfileStatsEntity;
}

export interface IGetProfileStatsUseCase {
  execute(): Promise<GetProfileStatsUseCaseOutput>;
}

export class GetProfileStatsUseCase implements IGetProfileStatsUseCase {
  constructor(
    private readonly profileRepository: BackendProfileRepository
  ) { }

  async execute(): Promise<GetProfileStatsUseCaseOutput> {
    const stats = await this.profileRepository.getProfileStats();

    return {
      stats
    };
  }
}
