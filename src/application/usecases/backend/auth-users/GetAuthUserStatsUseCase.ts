import type { AuthUserStatsEntity } from '@/src/domain/entities/backend/backend-auth-user.entity';
import type { IBackendAuthUsersRepository } from '@/src/domain/repositories/backend/backend-auth-user-repository';

export interface GetAuthUserStatsUseCaseOutput {
  stats: AuthUserStatsEntity;
}

export class GetAuthUserStatsUseCase {
  constructor(
    private readonly authUsersRepository: IBackendAuthUsersRepository
  ) { }

  async execute(): Promise<GetAuthUserStatsUseCaseOutput> {
    const stats = await this.authUsersRepository.getAuthUserStats();

    return {
      stats
    };
  }
}
