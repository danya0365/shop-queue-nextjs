import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface CustomerActionData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  membership_tier: 'regular' | 'bronze' | 'silver' | 'gold' | 'platinum';
  notes?: string;
}

// Define state interface
export interface CustomersPresenterState {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  membershipFilter: string;
  genderFilter: string;
}

// Define actions interface
export interface CustomersPresenterActions {
  createCustomer: (data: CustomerActionData) => Promise<boolean>;
  updateCustomer: (data: CustomerActionData) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  updateMembership: (id: string, tier: string) => Promise<boolean>;
  addPoints: (id: string, points: number) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setMembershipFilter: (membership: string) => void;
  setGenderFilter: (gender: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type CustomersPresenterHook = [
  CustomersPresenterState,
  CustomersPresenterActions
];

// Custom hook implementation
export const useCustomersPresenter = (): CustomersPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const logger = getClientService<Logger>('Logger');

  const createCustomer = async (data: CustomerActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อลูกค้า');
      }
      if (!data.phone.trim()) {
        throw new Error('กรุณาระบุเบอร์โทรศัพท์');
      }
      if (!data.email.trim()) {
        throw new Error('กรุณาระบุอีเมล');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CustomersPresenter: Customer created successfully');
      return true;
    } catch (error) {
      logger.error('CustomersPresenter: Error creating customer', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างลูกค้า');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomer = async (data: CustomerActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.id) {
        throw new Error('ไม่พบรหัสลูกค้า');
      }
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อลูกค้า');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CustomersPresenter: Customer updated successfully');
      return true;
    } catch (error) {
      logger.error('CustomersPresenter: Error updating customer', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการแก้ไขลูกค้า');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสลูกค้า');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CustomersPresenter: Customer deleted successfully');
      return true;
    } catch (error) {
      logger.error('CustomersPresenter: Error deleting customer', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบลูกค้า');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMembership = async (id: string, tier: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสลูกค้า');
      }
      if (!tier) {
        throw new Error('กรุณาระบุระดับสมาชิก');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CustomersPresenter: Customer membership updated successfully');
      return true;
    } catch (error) {
      logger.error('CustomersPresenter: Error updating customer membership', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตระดับสมาชิก');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addPoints = async (id: string, points: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสลูกค้า');
      }
      if (points <= 0) {
        throw new Error('กรุณาระบุจำนวนคะแนนที่ถูกต้อง');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CustomersPresenter: Points added successfully');
      return true;
    } catch (error) {
      logger.error('CustomersPresenter: Error adding points', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเพิ่มคะแนน');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSearchQuery('');
    setMembershipFilter('');
    setGenderFilter('');
    logger.info('CustomersPresenter: Reset');
  };

  return [
    { isLoading, error, searchQuery, membershipFilter, genderFilter },
    { 
      createCustomer, 
      updateCustomer, 
      deleteCustomer, 
      updateMembership, 
      addPoints, 
      setSearchQuery, 
      setMembershipFilter, 
      setGenderFilter, 
      reset, 
      setError 
    },
  ];
};
