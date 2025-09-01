import type { AuthUserDTO, AuthUsersDataDTO } from '@/src/application/dtos/backend/auth-users-dto';
import type { DeleteAuthUserUseCase } from '@/src/application/usecases/backend/auth-users/DeleteAuthUserUseCase';
import type { GetAuthUserByIdUseCase } from '@/src/application/usecases/backend/auth-users/GetAuthUserByIdUseCase';
import type { GetAuthUserStatsUseCase } from '@/src/application/usecases/backend/auth-users/GetAuthUserStatsUseCase';
import type { GetAuthUsersUseCase } from '@/src/application/usecases/backend/auth-users/GetAuthUsersUseCase';
import { BackendAuthUsersMapper } from '@/src/infrastructure/mappers/backend/supabase-backend-auth-user.mapper';

export interface IBackendAuthUsersService {
  getAuthUsersData(page?: number, perPage?: number): Promise<AuthUsersDataDTO>;
  getAuthUserById(id: string): Promise<AuthUserDTO | null>;
  deleteAuthUser(id: string): Promise<boolean>;
}

export class BackendAuthUsersService implements IBackendAuthUsersService {
  constructor(
    private readonly getAuthUsersUseCase: GetAuthUsersUseCase,
    private readonly getAuthUserByIdUseCase: GetAuthUserByIdUseCase,
    private readonly getAuthUserStatsUseCase: GetAuthUserStatsUseCase,
    private readonly deleteAuthUserUseCase: DeleteAuthUserUseCase
  ) { }

  async getAuthUsersData(page: number = 1, perPage: number = 20): Promise<AuthUsersDataDTO> {
    // Get users and stats in parallel
    const [usersResult, statsResult] = await Promise.all([
      this.getAuthUsersUseCase.execute({ page, perPage }),
      this.getAuthUserStatsUseCase.execute()
    ]);

    // Map entities to DTOs
    const users = usersResult.users.map(user => BackendAuthUsersMapper.toDTO(user));
    const totalCount = usersResult.totalCount
    const stats = BackendAuthUsersMapper.statsToDTO(statsResult.stats);

    return {
      users,
      stats,
      totalCount,
      currentPage: page,
      perPage
    };
  }

  async getAuthUserById(id: string): Promise<AuthUserDTO | null> {
    const result = await this.getAuthUserByIdUseCase.execute({ id });

    if (!result.user) {
      return null;
    }

    return BackendAuthUsersMapper.toDTO(result.user);
  }

  async deleteAuthUser(id: string): Promise<boolean> {
    return this.deleteAuthUserUseCase.execute(id);
  }
}
