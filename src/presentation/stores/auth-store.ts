import { getClientService } from "@/src/di/client-container";
import { Logger } from "@/src/domain/interfaces/logger";
import localforage from "localforage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AuthService } from "../../application/services/auth-service";
import { createAuthActions } from "./auth-store.actions";
import { AuthStore } from "./auth-store.types";

// Initialize localforage instance
localforage.config({
  name: "shop-queue",
  storeName: "auth",
});

/**
 * Creates and exports the auth store using the factory pattern
 * This approach follows dependency inversion principle by injecting dependencies
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      // Get dependencies from container
      const authService = getClientService<AuthService>("AuthService");
      const logger = getClientService<Logger>("Logger");

      // Create a function to get the profile store
      // This avoids circular dependencies by deferring the import
      const getProfileState = () => {
        // Dynamic import to avoid circular dependency
        // Using dynamic import() for ESM compatibility
        const profileStoreModule = import("./profile-store");
        return profileStoreModule.then((module) =>
          module.useProfileStore.getState()
        );
      };

      // Create actions using the factory function
      const actions = createAuthActions(
        authService,
        logger,
        getProfileState,
        get,
        set
      );

      // Return the combined state and actions
      return {
        // Initial state
        authAccount: null,
        loading: true,
        error: null,

        // Actions
        ...actions,
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localforage),
      partialize: (state) => ({ authAccount: state.authAccount }), // Only persist auth account data
    }
  )
);
