import { AuthDataSource, AuthUser } from '@/src/domain/interfaces/datasources/auth-datasource';
import { Logger } from '@/src/domain/interfaces/logger';
import { IUseCase } from '../../interfaces/use-case.interface';

export interface UpdatePasswordInput {
  newPassword: string;
}

export class UpdatePasswordUseCase implements IUseCase<UpdatePasswordInput, AuthUser | null> {
  constructor(
    private readonly authDataSource: AuthDataSource,
    private readonly logger?: Logger
  ) {}

  async execute(input: UpdatePasswordInput): Promise<AuthUser | null> {
    try {
      const { newPassword } = input;
      const user = await this.authDataSource.updatePassword(newPassword);
      return user;
    } catch (error) {
      this.logger?.error('Error updating password', error);
      return null;
    }
  }
}
