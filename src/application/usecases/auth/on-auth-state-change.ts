import { AuthDataSource, AuthUser } from '@/src/domain/interfaces/datasources/auth-datasource';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Type for the callback function
 */
export type AuthStateChangeCallback = (event: string, user: AuthUser | null) => void;

/**
 * Use case for handling auth state changes
 * Following the Clean Architecture pattern
 */
export class OnAuthStateChangeUseCase implements IUseCase<AuthStateChangeCallback, { unsubscribe: () => void }> {
  constructor(private readonly authDataSource: AuthDataSource) {}

  /**
   * Execute the use case to listen for auth state changes
   * @param callback Function to call when auth state changes
   * @returns Promise that resolves to an object with unsubscribe method
   */
  async execute(callback: AuthStateChangeCallback): Promise<{ unsubscribe: () => void }> {
    // Wrap the synchronous call in a Promise to conform to the IUseCase interface
    return Promise.resolve(this.authDataSource.onAuthStateChange(callback));
  }
}
