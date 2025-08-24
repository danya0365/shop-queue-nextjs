import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { Logger } from "@/src/domain/interfaces/logger";
import localforage from 'localforage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getClientService } from '../../di/client-container';
import { createProfileActions } from './profile-store.actions';
import { ProfileState } from './profile-store.types';

/**
 * Factory function to create the profile store
 * Following SOLID principles with dependency injection
 */
export const createProfileStore = () => {
  // Get dependencies from container
  const profileService = getClientService<IProfileService>('ProfileService');
  const logger = getClientService<Logger>('Logger');

  return create<ProfileState>()(
    persist(
      (set, get) => {
        // Initial state
        const initialState: Omit<ProfileState, keyof ReturnType<typeof createProfileActions>> = {
          profiles: [],
          activeProfile: null,
          loading: false,
          error: null,
        };

        // Create actions with injected dependencies
        const actions = createProfileActions(
          profileService,
          logger,
          get,
          set
        );

        // Return combined state and actions
        return {
          ...initialState,
          ...actions,
        };
      },
      {
        name: 'profile-storage',
        storage: {
          getItem: async (name) => {
            return JSON.parse(await localforage.getItem(name) || '{}');
          },
          setItem: async (name, value) => {
            await localforage.setItem(name, JSON.stringify(value));
          },
          removeItem: async (name) => {
            await localforage.removeItem(name);
          },
        },
      }
    )
  );
};

/**
 * Create and export the profile store instance
 * This maintains backward compatibility with existing components
 * while still allowing for dependency injection in new code
 */
export const useProfileStore = createProfileStore();
