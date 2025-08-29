import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface ShopActionData {
  id?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  category_id: string;
  status: 'active' | 'inactive' | 'pending';
}

// Define state interface
export interface ShopsPresenterState {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
}

// Define actions interface
export interface ShopsPresenterActions {
  createShop: (data: ShopActionData) => Promise<boolean>;
  updateShop: (data: ShopActionData) => Promise<boolean>;
  deleteShop: (id: string) => Promise<boolean>;
  approveShop: (id: string) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type ShopsPresenterHook = [
  ShopsPresenterState,
  ShopsPresenterActions
];

// Custom hook implementation
export const useShopsPresenter = (): ShopsPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const logger = getClientService<Logger>('Logger');

  const createShop = async (data: ShopActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อร้านค้า');
      }
      if (!data.address.trim()) {
        throw new Error('กรุณาระบุที่อยู่ร้านค้า');
      }
      if (!data.phone.trim()) {
        throw new Error('กรุณาระบุเบอร์โทรศัพท์');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('ShopsPresenter: Shop created successfully');
      return true;
    } catch (error) {
      logger.error('ShopsPresenter: Error creating shop', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างร้านค้า');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateShop = async (data: ShopActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.id) {
        throw new Error('ไม่พบรหัสร้านค้า');
      }
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อร้านค้า');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('ShopsPresenter: Shop updated successfully');
      return true;
    } catch (error) {
      logger.error('ShopsPresenter: Error updating shop', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการแก้ไขร้านค้า');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteShop = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสร้านค้า');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('ShopsPresenter: Shop deleted successfully');
      return true;
    } catch (error) {
      logger.error('ShopsPresenter: Error deleting shop', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบร้านค้า');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const approveShop = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสร้านค้า');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('ShopsPresenter: Shop approved successfully');
      return true;
    } catch (error) {
      logger.error('ShopsPresenter: Error approving shop', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอนุมัติร้านค้า');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSearchQuery('');
    setStatusFilter('');
    setCategoryFilter('');
    logger.info('ShopsPresenter: Reset');
  };

  return [
    { isLoading, error, searchQuery, statusFilter, categoryFilter },
    { 
      createShop, 
      updateShop, 
      deleteShop, 
      approveShop, 
      setSearchQuery, 
      setStatusFilter, 
      setCategoryFilter, 
      reset, 
      setError 
    },
  ];
};
