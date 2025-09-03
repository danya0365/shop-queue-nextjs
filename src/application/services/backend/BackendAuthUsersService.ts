import type { AuthUserDTO, AuthUsersDataDTO, AuthUserStatsDTO, PaginatedAuthUsersDTO } from '@/src/application/dtos/backend/auth-users-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { GetAuthUsersPaginatedUseCaseInput } from '../../usecases/backend/auth-users/GetAuthUsersPaginatedUseCase';

export interface IBackendAuthUsersService {
  getAuthUsersData(page?: number, perPage?: number): Promise<AuthUsersDataDTO>;
  getAuthUserById(id: string): Promise<AuthUserDTO | null>;
  deleteAuthUser(id: string): Promise<boolean>;
}

export class BackendAuthUsersService implements IBackendAuthUsersService {
  constructor(
    private readonly getAuthUsersPaginatedUseCase: IUseCase<GetAuthUsersPaginatedUseCaseInput, PaginatedAuthUsersDTO>,
    private readonly getAuthUserByIdUseCase: IUseCase<string, AuthUserDTO>,
    private readonly getAuthUserStatsUseCase: IUseCase<void, AuthUserStatsDTO>,
    private readonly deleteAuthUserUseCase: IUseCase<string, boolean>
  ) { }

  async getAuthUsersData(page: number = 1, perPage: number = 20): Promise<AuthUsersDataDTO> {
    // Get users and stats in parallel
    const [usersResult, stats] = await Promise.all([
      this.getAuthUsersPaginatedUseCase.execute({ page, perPage }),
      this.getAuthUserStatsUseCase.execute()
    ]);

    return {
      users: usersResult.data,
      stats,
      totalCount: usersResult.pagination.totalItems,
      currentPage: usersResult.pagination.currentPage,
      perPage: usersResult.pagination.itemsPerPage
    };
  }

  async getAuthUserById(id: string): Promise<AuthUserDTO | null> {
    const result = await this.getAuthUserByIdUseCase.execute(id);
    return result;
  }

  async deleteAuthUser(id: string): Promise<boolean> {
    return this.deleteAuthUserUseCase.execute(id);
  }
}
