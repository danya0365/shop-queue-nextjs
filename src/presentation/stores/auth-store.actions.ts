import { Logger } from "@/src/domain/interfaces/logger";
import { IProfileRepositoryAdapter } from '../../application/interfaces/profile-repository-adapter.interface';
import { AuthService } from '../../application/services/auth-service';
import { AuthActions, AuthState, mapAuthUserToStoreAccount } from './auth-store.types';

// Import ProfileDto type to avoid using 'any'
import { getClientService } from '@/src/di/client-container';
import { ProfileDto } from '../../application/dtos/profile-dto';

// Define minimal ProfileState interface to avoid circular dependency
interface ProfileState {
  profiles: ProfileDto[];
  activeProfile: ProfileDto | null;
  loading: boolean;
  error: string | null;
  clearProfiles: () => void;
  fetchActiveProfile: (authId: string) => Promise<ProfileDto | null>;
  fetchProfiles: (authId: string) => Promise<ProfileDto[]>;
}

/**
 * Factory function to create auth actions
 * This separates the action logic from the store creation
 * and makes dependencies explicit
 */
export const createAuthActions = (
  authService: AuthService,
  logger: Logger,
  profileAdapter: IProfileRepositoryAdapter,
  getProfileState: () => Promise<ProfileState>,
  getState: () => AuthState,
  setState: (state: Partial<AuthState>) => void
): AuthActions => ({
  setLoading: (loading: boolean) => setState({ loading }),

  setError: (error: string | null) => setState({ error }),

  initializeAuthListener: () => {
    // First, check if the current stored auth account is still valid
    // This helps synchronize the Zustand store with Supabase Auth state
    (async () => {
      let profileState;
      try {
        profileState = await getProfileState();
      } catch (error) {
        logger.error('Error getting profile state:', error);
      }
      try {
        // Set loading to false by default for anonymous users
        setState({ loading: false, error: null });

        // Try to get the current user, but don't throw an error if session is missing
        const currentUser = await authService.getCurrentUser().catch(authError => {
          // Handle AuthSessionMissingError gracefully for anonymous users
          logger.info('No auth session found, user is anonymous', { errorMessage: authError.message });
          return null;
        });

        // If there's no current user, clear the stored auth account
        if (!currentUser) {
          setState({ authAccount: null, loading: false });
          if (profileState) {
            profileState.clearProfiles();
          }
          return;
        }

        const storedAuthAccount = getState().authAccount;

        // If there's no current auth account in Supabase but we have one in the store,
        // clear the stored auth account to avoid the mismatch
        if (storedAuthAccount && storedAuthAccount.id !== currentUser.id) {
          logger.info('Auth account mismatch between store and Supabase, updating stored auth account');
          setState({ authAccount: null, loading: false });
          if (profileState) {
            profileState.clearProfiles();
          }
        }

        // Update the store with the latest data
        const authAccount = mapAuthUserToStoreAccount(currentUser);

        if (!authAccount) {
          logger.error('Failed to map current user to store account');
          setState({ error: 'Failed to process user data', loading: false });
          return;
        }

        setState({
          authAccount,
          loading: false
        });

        // Ensure active profile exists for this auth account
        await ensureActiveProfile(currentUser.id);

      } catch (error) {
        logger.error('Error initializing auth listener:', error);
        setState({ error: 'Failed to initialize auth', loading: false });
      }
    })();

    // Set up the auth state change listener
    const subscription = authService.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed:', { event });

      if (event === 'SIGNED_IN') {
        // For SIGNED_IN event, session should contain user data
        if (!session) {
          logger.error('Session is missing after sign in event');
          return;
        }

        try {
          const user = await authService.getCurrentUser();

          if (!user) {
            setState({ error: 'Failed to get current user', loading: false });
            return;
          }

          const authAccount = mapAuthUserToStoreAccount(user);

          if (!authAccount) {
            setState({ error: 'Failed to map user data', loading: false });
            return;
          }

          setState({
            authAccount,
            loading: false,
            error: null
          });

          // Ensure active profile exists for this auth account
          await ensureActiveProfile(user.id);

        } catch (error) {
          logger.error('Error handling sign in event:', error);
          setState({ error: 'Failed to process sign in', loading: false });
        }
      } else if (event === 'SIGNED_OUT') {
        setState({ authAccount: null, loading: false });
        // Get fresh profile state to avoid stale references
        try {
          const profileState = await getProfileState();
          profileState.clearProfiles();
        } catch (error) {
          logger.error('Error clearing profiles on sign out:', error);
        }
      } else if (event === 'USER_UPDATED') {
        try {
          const user = await authService.getCurrentUser();

          if (!user) {
            logger.warn('User updated event but no user found');
            return;
          }

          const authAccount = mapAuthUserToStoreAccount(user);

          if (!authAccount) {
            logger.error('Failed to map user data after update');
            return;
          }

          setState({
            authAccount,
            loading: false,
            error: null
          });
        } catch (error) {
          logger.error('Error handling user updated event:', error);
        }
      }
    });

    // Return cleanup function
    return () => {
      subscription.unsubscribe();
    };
  },

  refreshAuthAccount: async () => {
    setState({ loading: true, error: null });
    try {
      const user = await authService.getCurrentUser();

      if (!user) {
        setState({ authAccount: null, loading: false });
        return;
      }

      setState({
        authAccount: mapAuthUserToStoreAccount(user),
        loading: false,
        error: null
      });

    } catch (error) {
      logger.error('Error refreshing auth account:', error);
      setState({
        error: error instanceof Error ? error.message : 'Failed to refresh auth account',
        loading: false
      });
    }
  },

  signIn: async (email: string, password: string) => {
    setState({ loading: true, error: null });
    try {
      const user = await authService.signInWithPassword(email, password);

      if (!user) {
        setState({ error: 'Failed to sign in', loading: false });
        return { error: new Error('Failed to sign in') };
      }

      const authAccount = mapAuthUserToStoreAccount(user);

      if (!authAccount) {
        setState({ error: 'Failed to process user data', loading: false });
        return { error: new Error('Failed to process user data') };
      }

      setState({
        authAccount,
        loading: false,
        error: null
      });

      // After successful sign in, ensure active profile exists
      await ensureActiveProfile(user.id);

      return { error: null };
    } catch (error) {
      logger.error('Error signing in:', error);
      setState({ error: 'Failed to sign in', loading: false });
      return { error: error instanceof Error ? error : new Error('Failed to sign in') };
    }
  },

  signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
    setState({ loading: true, error: null });
    try {
      const user = await authService.signUp(email, password, metadata);

      if (!user) {
        setState({ error: 'Failed to sign up', loading: false });
        return { error: new Error('Failed to sign up') };
      }

      const authAccount = mapAuthUserToStoreAccount(user);

      if (!authAccount) {
        setState({ error: 'Failed to process user data', loading: false });
        return { error: new Error('Failed to process user data') };
      }

      setState({
        authAccount,
        loading: false,
        error: null
      });

      // After successful sign up, ensure active profile exists
      // For new users, this will likely create a default profile
      await ensureActiveProfile(user.id);

      return { error: null };
    } catch (error) {
      logger.error('Error signing up:', error);
      setState({ error: 'Failed to sign up', loading: false });
      return { error: error instanceof Error ? error : new Error('Failed to sign up') };
    }
  },

  signOut: async () => {
    setState({ loading: true, error: null });
    try {
      const success = await authService.signOut();

      if (!success) {
        setState({ error: 'Failed to sign out', loading: false });
        return;
      }

      // Clear profiles in profile store
      try {
        const profileState = await getProfileState();
        profileState.clearProfiles();
      } catch (error) {
        logger.error('Error clearing profiles on sign out:', error);
      }

      setState({ authAccount: null, loading: false });
    } catch (error) {
      logger.error('Sign out error:', error);
      setState({
        error: error instanceof Error ? error.message : 'Failed to sign out',
        loading: false
      });
    }
  }
});

/**
 * Helper function to ensure active profile exists
 * This is extracted from the store to avoid code duplication
 * Following SOLID principles by having a single responsibility
 */
async function ensureActiveProfile(authId: string): Promise<boolean> {
  try {
    // These would normally be injected, but for this helper function we'll get them directly
    // In a more complex application, this should be moved to a dedicated service
    const logger = getClientService<Logger>('Logger');
    const profileAdapter = getClientService<IProfileRepositoryAdapter>('ProfileRepositoryAdapter');

    // Dynamic import to avoid circular dependency
    const profileStoreModule = await import('./profile-store');
    // Get the profile store instance directly from the module
    const profileStore = profileStoreModule.useProfileStore.getState();

    // Check if there's an active profile
    const activeProfile = await profileAdapter.getActiveByAuthId(authId);

    // If active profile exists, fetch it and return true
    if (activeProfile) {
      await profileStore.fetchActiveProfile(authId);
      return true;
    }

    // If no active profile, check if there are any profiles
    const profiles = await profileAdapter.getByAuthId(authId);

    // If there are profiles, set the first one as active
    if (profiles && profiles.length > 0) {
      logger.info('No active profile found, setting first profile as active', { profileId: profiles[0].id });
      // setActive returns void, so we just await it and continue
      await profileAdapter.setActive(profiles[0].id, authId);
      await profileStore.fetchActiveProfile(authId);
      return true;
    }

    // If no profiles at all, we'll need to create one on the account page
    logger.info('No profiles found for auth account', { authId });
    return false;
  } catch (error) {
    const logger = getClientService<Logger>('Logger');
    logger.error('Error ensuring active profile:', error);
    return false;
  }
}
