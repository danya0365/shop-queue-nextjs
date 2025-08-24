import type { AuthChangeEvent, AuthDataSource, AuthUser } from "../../domain/interfaces/datasources/auth-datasource";
import { ErrorHandlingDecorator } from "../decorators/error-handling.decorator";
import { AuthChangeEventDto, AuthUserDto } from "../dtos/auth-dto";
import { AuthUseCaseFactory } from "../factories/auth-use-case.factory";
import type { IAuthService } from "../interfaces/auth-service.interface";
import type { ILogger } from "../interfaces/logger.interface";
import type { IUseCase } from "../interfaces/use-case.interface";
import { AuthMapper } from "../mappers/auth-mapper";

/**
 * Service for handling authentication-related operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class AuthService implements IAuthService {
  private readonly onAuthStateChangeUseCase: IUseCase<(event: AuthChangeEventDto, user: AuthUserDto | null) => void, { unsubscribe: () => void }>;
  private readonly getCurrentUserUseCase: IUseCase<void, AuthUserDto | null>;
  private readonly signInWithPasswordUseCase: IUseCase<{ email: string; password: string }, AuthUserDto | null>;
  private readonly signUpUseCase: IUseCase<{ email: string; password: string; metadata?: Record<string, unknown> }, AuthUserDto | null>;
  private readonly signOutUseCase: IUseCase<void, boolean>;

  /**
   * Constructor with dependency injection
   * @param authDataSource Data source for auth operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly authDataSource: AuthDataSource,
    private readonly logger?: ILogger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.onAuthStateChangeUseCase = new ErrorHandlingDecorator(
      AuthUseCaseFactory.createOnAuthStateChangeUseCase(authDataSource),
      logger
    );

    this.getCurrentUserUseCase = new ErrorHandlingDecorator(
      AuthUseCaseFactory.createGetCurrentUserUseCase(authDataSource),
      logger
    );

    this.signInWithPasswordUseCase = new ErrorHandlingDecorator(
      AuthUseCaseFactory.createSignInWithPasswordUseCase(authDataSource),
      logger
    );

    this.signUpUseCase = new ErrorHandlingDecorator(
      AuthUseCaseFactory.createSignUpUseCase(authDataSource),
      logger
    );

    this.signOutUseCase = new ErrorHandlingDecorator(
      AuthUseCaseFactory.createSignOutUseCase(authDataSource),
      logger
    );
  }

  /**
   * Listen for auth state changes
   * @param callback Function to call when auth state changes
   * @returns Object with unsubscribe method
   */
  onAuthStateChange(
    callback: (event: AuthChangeEventDto, user: AuthUserDto | null) => void
  ): { unsubscribe: () => void } {
    // Since the use case returns a Promise but the interface requires a synchronous return,
    // we need to handle this special case differently
    // We'll create a wrapper object that will be updated when the promise resolves
    const unsubscribeWrapper = { unsubscribe: () => { } };

    // Start the async operation
    // Create a wrapper callback that maps domain entities to DTOs
    const wrappedCallback = (event: AuthChangeEvent, user: AuthUser | null) => {
      callback(AuthMapper.toEventDto(event), AuthMapper.toDto(user));
    };

    this.onAuthStateChangeUseCase.execute(wrappedCallback)
      .then(result => {
        // Update the wrapper with the real unsubscribe function
        unsubscribeWrapper.unsubscribe = result.unsubscribe;
      })
      .catch(err => {
        if (this.logger) {
          this.logger.error('Error in onAuthStateChange:', err);
        }
      });

    return unsubscribeWrapper;
  }

  /**
   * Get the current authenticated user
   * @returns The authenticated user or null if not authenticated
   */
  async getCurrentUser(): Promise<AuthUserDto | null> {
    // Error handling is now managed by the decorator
    const user = await this.getCurrentUserUseCase.execute();
    return AuthMapper.toDto(user);
  }

  /**
   * Sign in a user with email and password
   * @param email User email
   * @param password User password
   * @returns The authenticated user or null if authentication failed
   */
  async signInWithPassword(email: string, password: string): Promise<AuthUserDto | null> {
    // Error handling is now managed by the decorator
    const user = await this.signInWithPasswordUseCase.execute({ email, password });
    return AuthMapper.toDto(user);
  }

  /**
   * Sign up a new user
   * @param email User email
   * @param password User password
   * @param metadata Optional metadata for the user
   * @returns The newly created user or null if sign up failed
   */
  async signUp(email: string, password: string, metadata?: Record<string, unknown>): Promise<AuthUserDto | null> {
    // Error handling is now managed by the decorator
    const user = await this.signUpUseCase.execute({ email, password, metadata });
    return AuthMapper.toDto(user);
  }

  /**
   * Sign out the current user
   * @returns true if sign out was successful, false otherwise
   */
  async signOut(): Promise<boolean> {
    // Error handling is now managed by the decorator
    return this.signOutUseCase.execute();
  }


}
