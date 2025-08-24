
import { AuthUserDto } from '@/src/application/dtos/auth-dto';

/**
 * Represents the auth account data stored in the auth store
 * This is a presentation-layer representation of the auth user
 */
export type StoreAuthAccount = {
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
};

/**
 * Auth store state interface
 * Separates state properties from actions for better organization
 */
export interface AuthState {
  // State properties
  authAccount: StoreAuthAccount | null;
  loading: boolean;
  error: string | null;
}

/**
 * Auth store actions interface
 * Defines all the actions that can be performed on the auth state
 */
export interface AuthActions {
  // UI state actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Auth actions
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshAuthAccount: () => Promise<void>;

  // Auth listener
  initializeAuthListener: () => () => void;
}

/**
 * Combined auth store type with both state and actions
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Helper function to map AuthUser domain entity or AuthUserDto to StoreAuthAccount presentation model
 */
export const mapAuthUserToStoreAccount = (user: AuthUserDto | null): StoreAuthAccount | null => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    emailConfirmedAt: user.emailConfirmedAt,
    phone: user.phone,
    lastSignInAt: user.lastSignInAt,
    userMetadata: user.userMetadata,
    appMetadata: user.appMetadata,
    role: user.role
  };
};
