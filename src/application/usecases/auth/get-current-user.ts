
import { AuthDataSource, AuthUser } from '@/src/domain/interfaces/datasources/auth-datasource';
import { Logger } from '@/src/domain/interfaces/logger';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Use case for getting the current authenticated user
 * Following the Clean Architecture pattern
 */
export class GetCurrentUserUseCase implements IUseCase<void, AuthUser | null> {
  constructor(
    private readonly authDataSource: AuthDataSource,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to get the current authenticated user
   * @returns The authenticated user or null if not authenticated
   */
  async execute(): Promise<AuthUser | null> {
    try {
      const user = await this.authDataSource.getUser();
      return user;
    } catch (err) {
      this.logger?.error('Error accessing authentication', err);
      return null;
    }
  }
}
