import { AuthDataSource, AuthUser } from '@/src/domain/interfaces/datasources/auth-datasource';
import { Logger } from '@/src/domain/interfaces/logger';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Input DTO for sign in with password use case
 */
export interface SignInWithPasswordInput {
  email: string;
  password: string;
}

/**
 * Use case for signing in a user with email and password
 * Following the Clean Architecture pattern
 */
export class SignInWithPasswordUseCase implements IUseCase<SignInWithPasswordInput, AuthUser | null> {
  constructor(
    private readonly authDataSource: AuthDataSource,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to sign in a user with email and password
   * @param input Object containing email and password
   * @returns The authenticated user or null if authentication failed
   */
  async execute(input: SignInWithPasswordInput): Promise<AuthUser | null> {
    try {
      const { email, password } = input;
      const user = await this.authDataSource.signInWithPassword(email, password);
      return user;
    } catch (err) {
      this.logger?.error('Error during sign in', err, { email: input.email });
      return null;
    }
  }
}
