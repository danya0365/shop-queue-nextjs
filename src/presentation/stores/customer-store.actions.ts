import { Logger } from "@/src/domain/interfaces/logger";
import { CustomerActions, CustomerState, CustomerStore } from "./customer-store.types";

/**
 * Factory function to create customer store actions
 * This follows the factory pattern for better testability and dependency injection
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
  const setCustomer = (customer: CustomerStore['customer']) => {
    set({ customer, error: null });
  };

  const clearCustomer = () => {
    set({ customer: null, error: null });
  };

  const loadCustomerFromStorage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // The customer data will be automatically loaded from storage
      // by the persist middleware, so we just need to ensure it's available
      const currentState = get();
      logger.info('Customer loaded from storage', { 
        customerId: currentState.customer?.id,
        shopId: currentState.customer?.shopId 
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
    clearCustomer,
    loadCustomerFromStorage,
  };
};
