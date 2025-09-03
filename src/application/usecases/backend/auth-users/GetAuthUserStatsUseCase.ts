import { AuthUserStatsDTO } from '@/src/application/dtos/backend/auth-users-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { IBackendAuthUsersRepository } from '@/src/domain/repositories/backend/backend-auth-user-repository';
import { BackendAuthUsersMapper } from '@/src/infrastructure/mappers/backend/supabase-backend-auth-user.mapper';

export class GetAuthUserStatsUseCase implements IUseCase<void, AuthUserStatsDTO> {
  constructor(
    private readonly authUsersRepository: IBackendAuthUsersRepository
  ) { }

  async execute(): Promise<AuthUserStatsDTO> {
    const stats = await this.authUsersRepository.getAuthUserStats();
    const statsDto = BackendAuthUsersMapper.statsToDTO(stats);
    return statsDto
  }
}
