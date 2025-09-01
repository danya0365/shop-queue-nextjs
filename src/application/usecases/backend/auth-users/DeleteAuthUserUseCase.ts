import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { IBackendAuthUsersRepository } from '@/src/domain/repositories/backend/backend-auth-user-repository';


export class DeleteAuthUserUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly authUsersRepository: IBackendAuthUsersRepository
  ) { }

  async execute(input: string): Promise<boolean> {
    // Validate input
    if (!input || input.trim() === '') {
      throw new Error('User ID is required');
    }

    // Check if user exists before deletion
    const existingUser = await this.authUsersRepository.getAuthUserById(input);
    if (!existingUser) {
      throw new Error('User not found');
    }

    await this.authUsersRepository.deleteAuthUser(input);
    return true;
  }
}
