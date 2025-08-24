
import { AuthDataSource } from "@/src/domain/interfaces/datasources/auth-datasource";
import { GetCurrentUserUseCase } from "../usecases/auth/get-current-user";
import { OnAuthStateChangeUseCase } from "../usecases/auth/on-auth-state-change";
import { SignInWithPasswordUseCase } from "../usecases/auth/sign-in-with-password";
import { SignOutUseCase } from "../usecases/auth/sign-out";
import { SignUpUseCase } from "../usecases/auth/sign-up";

/**
 * Factory for creating authentication use cases
 * Follows the Factory Pattern to centralize use case creation
 */
export class AuthUseCaseFactory {
  /**
   * Create a use case for handling auth state changes
   * @param authDataSource Data source for auth operations
   * @returns OnAuthStateChangeUseCase instance
   */
  static createOnAuthStateChangeUseCase(authDataSource: AuthDataSource): OnAuthStateChangeUseCase {
    return new OnAuthStateChangeUseCase(authDataSource);
  }

  /**
   * Create a use case for getting the current user
   * @param authDataSource Data source for auth operations
   * @returns GetCurrentUserUseCase instance
   */
  static createGetCurrentUserUseCase(authDataSource: AuthDataSource): GetCurrentUserUseCase {
    return new GetCurrentUserUseCase(authDataSource);
  }

  /**
   * Create a use case for signing in with password
   * @param authDataSource Data source for auth operations
   * @returns SignInWithPasswordUseCase instance
   */
  static createSignInWithPasswordUseCase(authDataSource: AuthDataSource): SignInWithPasswordUseCase {
    return new SignInWithPasswordUseCase(authDataSource);
  }

  /**
   * Create a use case for signing up
   * @param authDataSource Data source for auth operations
   * @returns SignUpUseCase instance
   */
  static createSignUpUseCase(authDataSource: AuthDataSource): SignUpUseCase {
    return new SignUpUseCase(authDataSource);
  }

  /**
   * Create a use case for signing out
   * @param authDataSource Data source for auth operations
   * @returns SignOutUseCase instance
   */
  static createSignOutUseCase(authDataSource: AuthDataSource): SignOutUseCase {
    return new SignOutUseCase(authDataSource);
  }
}
