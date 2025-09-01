import type { AuthUserEntity } from '@/src/domain/entities/backend/backend-auth-user.entity';
import type { IBackendAuthUsersRepository } from '@/src/domain/repositories/backend/backend-auth-user-repository';

export interface GetAuthUserByIdUseCaseInput {
  id: string;
}

export interface GetAuthUserByIdUseCaseOutput {
  user: AuthUserEntity | null;
}

export class GetAuthUserByIdUseCase {
  constructor(
    private readonly authUsersRepository: IBackendAuthUsersRepository
  ) { }

  async execute(input: GetAuthUserByIdUseCaseInput): Promise<GetAuthUserByIdUseCaseOutput> {
    const { id } = input;

    // Validate input
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }

    const user = await this.authUsersRepository.getAuthUserById(id);

    return {
      user
    };
  }
}
