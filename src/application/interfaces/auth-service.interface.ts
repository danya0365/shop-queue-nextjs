import { AuthUserDto, AuthChangeEventDto } from "../dtos/auth-dto";

/**
 * Interface for authentication service
 * Follows the Interface Segregation Principle by defining a clear contract
 */
export interface IAuthService {
  /**
   * Listen for auth state changes
   * @param callback Function to call when auth state changes
   * @returns Object with unsubscribe method
   */
  onAuthStateChange(
    callback: (event: AuthChangeEventDto, user: AuthUserDto | null) => void
  ): { unsubscribe: () => void };

  /**
   * Get the current authenticated user
   * @returns The authenticated user or null if not authenticated
   */
  getCurrentUser(): Promise<AuthUserDto | null>;

  /**
   * Sign in a user with email and password
   * @param email User email
   * @param password User password
   * @returns The authenticated user or null if authentication failed
   */
  signInWithPassword(email: string, password: string): Promise<AuthUserDto | null>;

  /**
   * Sign up a new user
   * @param email User email
   * @param password User password
   * @param metadata Optional metadata for the user
   * @returns The newly created user or null if sign up failed
   */
  signUp(email: string, password: string, metadata?: Record<string, unknown>): Promise<AuthUserDto | null>;

  /**
   * Sign out the current user
   * @returns true if sign out was successful, false otherwise
   */
  signOut(): Promise<boolean>;
  

}
