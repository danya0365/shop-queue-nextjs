import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface CategoryActionData {
  id?: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}

// Define state interface
export interface CategoriesPresenterState {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: string;
}

// Define actions interface
export interface CategoriesPresenterActions {
  createCategory: (data: CategoryActionData) => Promise<boolean>;
  updateCategory: (data: CategoryActionData) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<boolean>;
  updateSortOrder: (id: string, sortOrder: number) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type CategoriesPresenterHook = [
  CategoriesPresenterState,
  CategoriesPresenterActions
];

// Custom hook implementation
export const useCategoriesPresenter = (): CategoriesPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const logger = getClientService<Logger>('Logger');

  const createCategory = async (data: CategoryActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อหมวดหมู่');
      }
      if (!data.description.trim()) {
        throw new Error('กรุณาระบุคำอธิบาย');
      }
      if (!data.icon.trim()) {
        throw new Error('กรุณาระบุไอคอน');
      }
      if (!data.color.trim()) {
        throw new Error('กรุณาระบุสี');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CategoriesPresenter: Category created successfully');
      return true;
    } catch (error) {
      logger.error('CategoriesPresenter: Error creating category', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (data: CategoryActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.id) {
        throw new Error('ไม่พบรหัสหมวดหมู่');
      }
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อหมวดหมู่');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CategoriesPresenter: Category updated successfully');
      return true;
    } catch (error) {
      logger.error('CategoriesPresenter: Error updating category', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสหมวดหมู่');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CategoriesPresenter: Category deleted successfully');
      return true;
    } catch (error) {
      logger.error('CategoriesPresenter: Error deleting category', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบหมวดหมู่');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสหมวดหมู่');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CategoriesPresenter: Category status toggled successfully');
      return true;
    } catch (error) {
      logger.error('CategoriesPresenter: Error toggling category status', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะหมวดหมู่');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSortOrder = async (id: string, sortOrder: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสหมวดหมู่');
      }
      if (sortOrder < 1) {
        throw new Error('ลำดับการแสดงต้องมากกว่า 0');
      }
      
      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('CategoriesPresenter: Category sort order updated successfully');
      return true;
    } catch (error) {
      logger.error('CategoriesPresenter: Error updating category sort order', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตลำดับการแสดง');
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
    logger.info('CategoriesPresenter: Reset');
  };

  return [
    { isLoading, error, searchQuery, statusFilter },
    { 
      createCategory, 
      updateCategory, 
      deleteCategory, 
      toggleStatus, 
      updateSortOrder, 
      setSearchQuery, 
      setStatusFilter, 
      reset, 
      setError 
    },
  ];
};
