import { PaginatedAuthUsersDTO } from '@/src/application/dtos/backend/auth-users-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { IBackendAuthUsersRepository } from '@/src/domain/repositories/backend/backend-auth-user-repository';
import { BackendAuthUsersMapper } from '@/src/infrastructure/mappers/backend/supabase-backend-auth-user.mapper';

export interface GetAuthUsersPaginatedUseCaseInput {
  page: number;
  perPage: number;
}

export class GetAuthUsersPaginatedUseCase implements IUseCase<GetAuthUsersPaginatedUseCaseInput, PaginatedAuthUsersDTO> {
  constructor(
    private readonly authUsersRepository: IBackendAuthUsersRepository
  ) { }

  async execute(input: GetAuthUsersPaginatedUseCaseInput): Promise<PaginatedAuthUsersDTO> {
    const { page, perPage } = input;

    // Validate input
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error('Per page must be between 1 and 100');
    }

    const result = await this.authUsersRepository.getAuthUsers(page, perPage);

    const users = result.data.map(user => BackendAuthUsersMapper.toDTO(user));

    return {
      data: users,
      pagination: result.pagination
    };
  }
}
