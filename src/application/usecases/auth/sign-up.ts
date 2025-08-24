import { AuthDataSource, AuthUser } from '@/src/domain/interfaces/datasources/auth-datasource';
import { Logger } from '@/src/domain/interfaces/logger';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Input DTO for sign up use case
 */
export interface SignUpInput {
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
}

/**
 * Use case for signing up a new user
 * Following the Clean Architecture pattern
 */
export class SignUpUseCase implements IUseCase<SignUpInput, AuthUser | null> {
  constructor(
    private readonly authDataSource: AuthDataSource,
    private logger?: Logger
  ) {}

  /**
   * Execute the use case to sign up a new user
   * @param input Object containing email, password, and optional metadata
   * @returns The newly created user or null if sign up failed
   */
  async execute(input: SignUpInput): Promise<AuthUser | null> {
    try {
      const { email, password, metadata } = input;
      const user = await this.authDataSource.signUp(email, password, metadata);
      return user;
    } catch (err) {
      this.logger?.error('Error during sign up', err, { email: input.email });
      return null;
    }
  }
}
