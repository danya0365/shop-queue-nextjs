import { AuthUserDTO } from '@/src/application/dtos/backend/auth-users-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { IBackendAuthUsersRepository } from '@/src/domain/repositories/backend/backend-auth-user-repository';
import { BackendAuthUsersMapper } from '@/src/infrastructure/mappers/backend/supabase-backend-auth-user.mapper';


export class GetAuthUserByIdUseCase implements IUseCase<string, AuthUserDTO> {
  constructor(
    private readonly authUsersRepository: IBackendAuthUsersRepository
  ) { }

  async execute(id: string): Promise<AuthUserDTO> {

    // Validate input
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }

    const user = await this.authUsersRepository.getAuthUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    const userDto = BackendAuthUsersMapper.toDTO(user);
    return userDto;
  }
}
