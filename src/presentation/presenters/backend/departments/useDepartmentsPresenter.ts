import type { CreateDepartmentDTO, UpdateDepartmentDTO } from '@/src/application/dtos/backend/department-dto';
import { BackendDepartmentsService } from '@/src/application/services/backend/BackendDepartmentsService';
import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface CreateDepartmentData {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateDepartmentData {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
}

export interface DeleteDepartmentData {
  id: string;
}

// Define state interface
export interface DepartmentsPresenterState {
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  selectedDepartmentId: string | null;
}

// Define actions interface
export interface DepartmentsPresenterActions {
  createDepartment: (data: CreateDepartmentData) => Promise<boolean>;
  updateDepartment: (data: UpdateDepartmentData) => Promise<boolean>;
  deleteDepartment: (data: DeleteDepartmentData) => Promise<boolean>;
  selectDepartment: (id: string | null) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type DepartmentsPresenterHook = [
  DepartmentsPresenterState,
  DepartmentsPresenterActions
];

// Custom hook implementation
export const useDepartmentsPresenter = (): DepartmentsPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  const logger = getClientService<Logger>('Logger');
  const departmentsService = new BackendDepartmentsService();

  const createDepartment = async (data: CreateDepartmentData): Promise<boolean> => {
    setIsCreating(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อแผนก');
      }
      if (!data.slug.trim()) {
        throw new Error('กรุณาระบุรหัสแผนก');
      }

      const createData: CreateDepartmentDTO = {
        shopId: 'shop-1', // In real app, this would come from context
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description?.trim() || null
      };

      await departmentsService.createDepartment(createData);

      logger.info('DepartmentsPresenter: Department created successfully');
      return true;
    } catch (error) {
      logger.error('DepartmentsPresenter: Error creating department', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างแผนก');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const updateDepartment = async (data: UpdateDepartmentData): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Validation logic
      if (data.name && !data.name.trim()) {
        throw new Error('กรุณาระบุชื่อแผนก');
      }
      if (data.slug && !data.slug.trim()) {
        throw new Error('กรุณาระบุรหัสแผนก');
      }

      const updateData: UpdateDepartmentDTO = {
        id: data.id,
        ...(data.name && { name: data.name.trim() }),
        ...(data.slug && { slug: data.slug.trim() }),
        ...(data.description !== undefined && { description: data.description?.trim() || null })
      };

      const result = await departmentsService.updateDepartment(updateData);
      if (!result) {
        throw new Error('ไม่พบแผนกที่ต้องการแก้ไข');
      }

      logger.info('DepartmentsPresenter: Department updated successfully');
      return true;
    } catch (error) {
      logger.error('DepartmentsPresenter: Error updating department', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการแก้ไขแผนก');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteDepartment = async (data: DeleteDepartmentData): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await departmentsService.deleteDepartment(data.id);
      if (!result) {
        throw new Error('ไม่พบแผนกที่ต้องการลบ');
      }

      logger.info('DepartmentsPresenter: Department deleted successfully');
      return true;
    } catch (error) {
      logger.error('DepartmentsPresenter: Error deleting department', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบแผนก');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const selectDepartment = (id: string | null) => {
    setSelectedDepartmentId(id);
    logger.info('DepartmentsPresenter: Department selected', { id });
  };

  const reset = () => {
    setIsLoading(false);
    setIsCreating(false);
    setIsUpdating(false);
    setIsDeleting(false);
    setError(null);
    setSelectedDepartmentId(null);
    logger.info('DepartmentsPresenter: Reset');
  };

  return [
    {
      isLoading,
      isCreating,
      isUpdating,
      isDeleting,
      error,
      selectedDepartmentId
    },
    {
      createDepartment,
      updateDepartment,
      deleteDepartment,
      selectDepartment,
      reset,
      setError
    },
  ];
};
