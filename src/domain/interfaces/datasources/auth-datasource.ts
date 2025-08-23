/**
 * Base interface for auth operations with common error handling
 */
export interface IBaseAuthDataSource {
  /**
   * Handles authentication errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation description
   * @param context Optional context information
   * @throws AuthError with appropriate error type
   */
  handleError(error: unknown, operation?: string, context?: string): never;
}

/**
 * Interface for authentication operations
 * Following Single Responsibility Principle by separating authentication concerns
 */
export interface IAuthenticationDataSource extends IBaseAuthDataSource {
  /**
   * Sign in a user with email and password
   * @param email User email
   * @param password User password
   * @returns Promise with user data or error
   * @throws AuthError if the operation fails
   */
  signInWithPassword(email: string, password: string): Promise<AuthResult>;

  /**
   * Sign up a new user with email and password and optional metadata
   * @param email User email
   * @param password User password
   * @param metadata Optional metadata to store with the user (e.g., username, full_name)
   * @returns Promise with user data or error
   * @throws AuthError if the operation fails
   */
  signUp(email: string, password: string, metadata?: Record<string, unknown>): Promise<AuthResult>;

  /**
   * Sign out the current user
   * @returns Promise with success status
   * @throws AuthError if the operation fails
   */
  signOut(): Promise<void>;
}

/**
 * Interface for session management
 * Following Single Responsibility Principle by separating session concerns
 */
export interface ISessionDataSource extends IBaseAuthDataSource {
  /**
   * Get the current user session
   * @returns Promise with user data or null if no session
   * @throws AuthError if the operation fails
   */
  getSession(): Promise<AuthUser | null>;

  /**
   * Get the current user
   * @returns Promise with user data or null if no user
   * @throws AuthError if the operation fails
   */
  getUser(): Promise<AuthUser | null>;

  /**
   * Listen for auth state changes
   * @param callback Function to call when auth state changes
   * @returns Object with unsubscribe method
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, user: AuthUser | null) => void
  ): { unsubscribe: () => void };
}

/**
 * Combined interface for authentication data source
 * This follows the Clean Architecture pattern by defining an interface in the domain layer
 * that will be implemented by the infrastructure layer
 */
export interface AuthDataSource extends IAuthenticationDataSource, ISessionDataSource {}

/**
 * Auth user interface that is independent of any external library
 */
export interface AuthUser {
  id: string;
  email: string;
  emailConfirmedAt?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
  lastSignInAt?: string | null;
  userMetadata?: Record<string, unknown>;
  appMetadata?: Record<string, unknown>;
  role?: string;
  aud?: string;
}

/**
 * Result of authentication operations
 */
export type AuthResult = AuthUser;

/**
 * Auth change event types
 */
export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'TOKEN_REFRESHED' | 'PASSWORD_RECOVERY' | 'INITIAL_SESSION' | 'MFA_CHALLENGE_VERIFIED';

/**
 * Auth error types for domain error handling
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_IN_USE = 'EMAIL_IN_USE',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_MFA_CODE = 'INVALID_MFA_CODE',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  OPERATION_FAILED = 'OPERATION_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Domain error for authentication operations
 */
export class AuthError extends Error {
  constructor(
    public readonly type: AuthErrorType,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
