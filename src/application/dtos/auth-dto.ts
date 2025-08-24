/**
 * DTO for authentication user data
 * Following Clean Architecture by isolating domain entities from application layer
 */
export interface AuthUserDto {
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
 * Auth change event types
 */
export type AuthChangeEventDto = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'TOKEN_REFRESHED' | 'PASSWORD_RECOVERY' | 'INITIAL_SESSION' | 'MFA_CHALLENGE_VERIFIED';

/**
 * Auth error types for application error handling
 */
export enum AuthErrorTypeDto {
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
