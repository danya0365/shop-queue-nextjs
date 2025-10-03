import { Logger } from "@/src/domain/interfaces/logger";
import { CustomerActions, CustomerState, CustomerStore } from "./customer-store.types";

/**
 * Factory function to create customer store actions
 * This follows the factory pattern for better testability and dependency injection
 * Updated to support multiple customers by shop ID
 */
export const createCustomerActions = (
  logger: Logger,
  get: () => CustomerState,
  set: (partial: Partial<CustomerState> | ((state: CustomerState) => Partial<CustomerState>)) => void
): CustomerActions => {
  // UI state actions
  const setLoading = (loading: boolean) => {
    set({ loading });
  };

  const setError = (error: string | null) => {
    set({ error });
  };

  // Customer actions
  const setCustomer = (shopId: string, customer: CustomerStore['customers'][string] | null) => {
    set((state) => {
      const newCustomers = { ...state.customers };
      if (customer) {
        newCustomers[shopId] = customer;
      } else {
        delete newCustomers[shopId];
      }
      return { customers: newCustomers, error: null };
    });
  };

  const getCustomer = (shopId: string) => {
    const state = get();
    return state.customers[shopId] || null;
  };

  const clearCustomer = (shopId: string) => {
    set((state) => {
      const newCustomers = { ...state.customers };
      delete newCustomers[shopId];
      return { customers: newCustomers, error: null };
    });
  };

  const clearAllCustomers = () => {
    set({ customers: {}, error: null });
  };

  const hasCustomer = (shopId: string) => {
    const state = get();
    return shopId in state.customers;
  };

  const loadCustomerFromStorage = async (shopId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // The customer data will be automatically loaded from storage
      // by the persist middleware, so we just need to ensure it's available
      const currentState = get();
      const customer = currentState.customers[shopId];
      
      logger.info('Customer loaded from storage', { 
        customerId: customer?.id,
        shopId: shopId,
        hasCustomer: !!customer
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load customer from storage';
      setError(errorMessage);
      logger.error('Failed to load customer from storage', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    // UI state actions
    setLoading,
    setError,
    
    // Customer actions
    setCustomer,
    getCustomer,
    clearCustomer,
    clearAllCustomers,
    loadCustomerFromStorage,
    hasCustomer,
  };
};
