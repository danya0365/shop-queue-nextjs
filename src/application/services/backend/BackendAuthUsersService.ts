import type { AuthUserDTO, AuthUsersDataDTO, AuthUserStatsDTO, PaginatedAuthUsersDTO } from '@/src/application/dtos/backend/auth-users-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { Logger } from '@/src/domain/interfaces/logger';
import { SupabaseBackendAuthUsersRepository } from '@/src/infrastructure/repositories/backend/supabase-backend-auth-users-repository';
import { DeleteAuthUserUseCase } from '../../usecases/backend/auth-users/DeleteAuthUserUseCase';
import { GetAuthUserByIdUseCase } from '../../usecases/backend/auth-users/GetAuthUserByIdUseCase';
import { GetAuthUsersPaginatedUseCase, GetAuthUsersPaginatedUseCaseInput } from '../../usecases/backend/auth-users/GetAuthUsersPaginatedUseCase';
import { GetAuthUserStatsUseCase } from '../../usecases/backend/auth-users/GetAuthUserStatsUseCase';

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
    private readonly deleteAuthUserUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  async getAuthUsersData(page: number = 1, perPage: number = 20): Promise<AuthUsersDataDTO> {

    try {
      this.logger.info('Getting auth users data', { page, perPage });
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
    } catch (error) {
      this.logger.error('Error getting auth users data', { error, page, perPage });
      throw error;
    }
  }

  async getAuthUserById(id: string): Promise<AuthUserDTO | null> {
    try {
      this.logger.info('Getting auth user by ID', { id });
      const result = await this.getAuthUserByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting auth user by ID', { error, id });
      throw error;
    }
  }

  async deleteAuthUser(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting auth user', { id });
      return this.deleteAuthUserUseCase.execute(id);
    } catch (error) {
      this.logger.error('Error deleting auth user', { error, id });
      throw error;
    }
  }
}

export class BackendAuthUsersServiceFactory {
  static create(repository: SupabaseBackendAuthUsersRepository, logger: Logger): BackendAuthUsersService {
    const getAuthUsersPaginatedUseCase = new GetAuthUsersPaginatedUseCase(repository);
    const getAuthUserStatsUseCase = new GetAuthUserStatsUseCase(repository);
    const getAuthUserByIdUseCase = new GetAuthUserByIdUseCase(repository);
    const deleteAuthUserUseCase = new DeleteAuthUserUseCase(repository);
    return new BackendAuthUsersService(getAuthUsersPaginatedUseCase, getAuthUserByIdUseCase, getAuthUserStatsUseCase, deleteAuthUserUseCase, logger);
  }
}
