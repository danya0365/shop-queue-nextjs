import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface CreateServiceData {
  shopId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  estimatedDuration?: number;
  category?: string;
  isAvailable?: boolean;
  icon?: string;
}

export interface UpdateServiceData {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  estimatedDuration?: number;
  category?: string;
  isAvailable?: boolean;
  icon?: string;
  popularityRank?: number;
}

// Define state interface
export interface ServicesPresenterState {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  categoryFilter: string;
  availabilityFilter: string;
}

// Define actions interface
export interface ServicesPresenterActions {
  createService: (data: CreateServiceData) => Promise<boolean>;
  updateService: (data: UpdateServiceData) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  toggleServiceAvailability: (id: string, isAvailable: boolean) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setAvailabilityFilter: (availability: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type ServicesPresenterHook = [
  ServicesPresenterState,
  ServicesPresenterActions
];

// Custom hook implementation
export const useServicesPresenter = (): ServicesPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const logger = getClientService<Logger>('Logger');

  const createService = async (data: CreateServiceData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name || !data.slug || !data.shopId) {
        throw new Error('ชื่อบริการ, slug และ shop ID เป็นข้อมูลที่จำเป็น');
      }

      if (data.price < 0) {
        throw new Error('ราคาต้องไม่เป็นค่าลบ');
      }

      // Mock API call - in real implementation, this would call the backend service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('ServicesPresenter: Service created successfully', { data });
      return true;
    } catch (error) {
      logger.error('ServicesPresenter: Error creating service', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างบริการ');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateService = async (data: UpdateServiceData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (data.price !== undefined && data.price < 0) {
        throw new Error('ราคาต้องไม่เป็นค่าลบ');
      }

      // Mock API call - in real implementation, this would call the backend service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('ServicesPresenter: Service updated successfully', { data });
      return true;
    } catch (error) {
      logger.error('ServicesPresenter: Error updating service', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตบริการ');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteService = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - in real implementation, this would call the backend service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('ServicesPresenter: Service deleted successfully', { id });
      return true;
    } catch (error) {
      logger.error('ServicesPresenter: Error deleting service', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบบริการ');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleServiceAvailability = async (id: string, isAvailable: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - in real implementation, this would call the backend service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('ServicesPresenter: Service availability toggled successfully', { id, isAvailable });
      return true;
    } catch (error) {
      logger.error('ServicesPresenter: Error toggling service availability', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะบริการ');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSearchQuery('');
    setCategoryFilter('');
    setAvailabilityFilter('');
    logger.info('ServicesPresenter: Reset');
  };

  return [
    { 
      isLoading, 
      error, 
      searchQuery, 
      categoryFilter, 
      availabilityFilter 
    },
    { 
      createService,
      updateService,
      deleteService,
      toggleServiceAvailability,
      setSearchQuery,
      setCategoryFilter,
      setAvailabilityFilter,
      reset, 
      setError 
    },
  ];
};
