import { AuthDataSource } from '@/src/domain/interfaces/datasources/auth-datasource';
import { Logger } from '@/src/domain/interfaces/logger';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Use case for signing out the current user
 * Following the Clean Architecture pattern
 */
export class SignOutUseCase implements IUseCase<void, boolean> {
  constructor(
    private readonly authDataSource: AuthDataSource,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to sign out the current user
   * @returns true if sign out was successful, false otherwise
   */
  async execute(): Promise<boolean> {
    try {
      await this.authDataSource.signOut();
      return true;
    } catch (err) {
      this.logger?.error('Error during sign out', err);
      return false;
    }
  }
}
