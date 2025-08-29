import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface EmployeeActionData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  department: 'management' | 'customer_service' | 'technical' | 'sales' | 'other';
  position: string;
  shop_id?: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  salary?: number;
  notes?: string;
}

// Define state interface
export interface EmployeesPresenterState {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  departmentFilter: string;
  statusFilter: string;
}

// Define actions interface
export interface EmployeesPresenterActions {
  createEmployee: (data: EmployeeActionData) => Promise<boolean>;
  updateEmployee: (data: EmployeeActionData) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  updateStatus: (id: string, status: string) => Promise<boolean>;
  updatePermissions: (id: string, permissions: string[]) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setDepartmentFilter: (department: string) => void;
  setStatusFilter: (status: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type EmployeesPresenterHook = [
  EmployeesPresenterState,
  EmployeesPresenterActions
];

// Custom hook implementation
export const useEmployeesPresenter = (): EmployeesPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const logger = getClientService<Logger>('Logger');

  const createEmployee = async (data: EmployeeActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อพนักงาน');
      }
      if (!data.email.trim()) {
        throw new Error('กรุณาระบุอีเมล');
      }
      if (!data.phone.trim()) {
        throw new Error('กรุณาระบุเบอร์โทรศัพท์');
      }
      if (!data.position.trim()) {
        throw new Error('กรุณาระบุตำแหน่ง');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('EmployeesPresenter: Employee created successfully');
      return true;
    } catch (error) {
      logger.error('EmployeesPresenter: Error creating employee', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างพนักงาน');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (data: EmployeeActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.id) {
        throw new Error('ไม่พบรหัสพนักงาน');
      }
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อพนักงาน');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('EmployeesPresenter: Employee updated successfully');
      return true;
    } catch (error) {
      logger.error('EmployeesPresenter: Error updating employee', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการแก้ไขพนักงาน');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสพนักงาน');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('EmployeesPresenter: Employee deleted successfully');
      return true;
    } catch (error) {
      logger.error('EmployeesPresenter: Error deleting employee', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบพนักงาน');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสพนักงาน');
      }
      if (!status) {
        throw new Error('กรุณาระบุสถานะ');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('EmployeesPresenter: Employee status updated successfully');
      return true;
    } catch (error) {
      logger.error('EmployeesPresenter: Error updating employee status', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตสถานะพนักงาน');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermissions = async (id: string, permissions: string[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสพนักงาน');
      }
      if (!permissions || permissions.length === 0) {
        throw new Error('กรุณาระบุสิทธิ์การเข้าถึง');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('EmployeesPresenter: Employee permissions updated successfully');
      return true;
    } catch (error) {
      logger.error('EmployeesPresenter: Error updating employee permissions', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตสิทธิ์การเข้าถึง');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSearchQuery('');
    setDepartmentFilter('');
    setStatusFilter('');
    logger.info('EmployeesPresenter: Reset');
  };

  return [
    { isLoading, error, searchQuery, departmentFilter, statusFilter },
    { 
      createEmployee, 
      updateEmployee, 
      deleteEmployee, 
      updateStatus, 
      updatePermissions, 
      setSearchQuery, 
      setDepartmentFilter, 
      setStatusFilter, 
      reset, 
      setError 
    },
  ];
};
