import { getClientService } from "@/src/di/client-container";
import { Logger } from "@/src/domain/interfaces/logger";
import localforage from "localforage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createCustomerActions } from "./customer-store.actions";
import { CustomerStore } from "./customer-store.types";

// Initialize localforage instance
localforage.config({
  name: "shop-queue",
  storeName: "customer",
});

/**
 * Creates and exports the customer store using the factory pattern
 * This approach follows dependency inversion principle by injecting dependencies
 */
export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => {
      // Get dependencies from container
      const logger = getClientService<Logger>("Logger");

      // Create actions using the factory function
      const actions = createCustomerActions(
        logger,
        get,
        set
      );

      // Return the combined state and actions
      return {
        // Initial state - customers mapped by shop ID
        customers: {},
        loading: false,
        error: null,

        // Actions
        ...actions,
      };
    },
    {
      name: "customer-storage",
      storage: createJSONStorage(() => localforage),
      partialize: (state) => ({ customers: state.customers }), // Only persist customers data
    }
  )
);
