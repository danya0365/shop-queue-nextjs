import { CustomerEntity } from '@/src/domain/entities/shop/backend/backend-customer.entity';

/**
 * Represents the customer data stored in the customer store
 * This is a presentation-layer representation for unauthenticated customers
 */
export type StoreCustomer = {
  id: string;
  name: string;
  phone: string;
  shopId: string;
};

/**
 * Customer store state interface
 * Separates state properties from actions for better organization
 * Now supports multiple customers separated by shop ID
 */
export interface CustomerState {
  // State properties - customers mapped by shop ID
  customers: Record<string, StoreCustomer>;
  loading: boolean;
  error: string | null;
}

/**
 * Customer store actions interface
 * Defines all the actions that can be performed on the customer state
 * Updated to support multiple customers by shop ID
 */
export interface CustomerActions {
  // UI state actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Customer actions
  setCustomer: (shopId: string, customer: StoreCustomer | null) => void;
  getCustomer: (shopId: string) => StoreCustomer | null;
  clearCustomer: (shopId: string) => void;
  clearAllCustomers: () => void;
  loadCustomerFromStorage: (shopId: string) => Promise<void>;
  hasCustomer: (shopId: string) => boolean;
}

/**
 * Combined customer store type with both state and actions
 */
export type CustomerStore = CustomerState & CustomerActions;

/**
 * Helper function to map Customer domain entity to StoreCustomer presentation model
 */
export const mapCustomerToStoreCustomer = (customer: CustomerEntity | null): StoreCustomer | null => {
  if (!customer) return null;
  
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone || '',
    shopId: customer.shopId,
  };
};
