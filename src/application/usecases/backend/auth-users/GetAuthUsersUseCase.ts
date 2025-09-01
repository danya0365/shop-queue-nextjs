import type { AuthUserEntity } from '@/src/domain/entities/backend/backend-auth-user.entity';
import type { IBackendAuthUsersRepository } from '@/src/domain/repositories/backend/backend-auth-user-repository';

export interface GetAuthUsersUseCaseInput {
  page: number;
  perPage: number;
}

export interface GetAuthUsersUseCaseOutput {
  users: AuthUserEntity[];
  totalCount: number;
}

export class GetAuthUsersUseCase {
  constructor(
    private readonly authUsersRepository: IBackendAuthUsersRepository
  ) { }

  async execute(input: GetAuthUsersUseCaseInput): Promise<GetAuthUsersUseCaseOutput> {
    const { page, perPage } = input;

    // Validate input
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error('Per page must be between 1 and 100');
    }

    const result = await this.authUsersRepository.getAuthUsers(page, perPage);

    return {
      users: result.data,
      totalCount: result.pagination.totalItems
    };
  }
}
