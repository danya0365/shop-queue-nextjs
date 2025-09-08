import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendDepartmentRepository } from '@/src/domain/repositories/shop/backend/backend-department-repository';
import { ShopBackendDepartmentError, ShopBackendDepartmentErrorType } from '@/src/domain/repositories/shop/backend/backend-department-repository';

export class DeleteDepartmentUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly departmentRepository: ShopBackendDepartmentRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.VALIDATION_ERROR,
          'Department ID is required',
          'DeleteDepartmentUseCase.execute',
          { id }
        );
      }

      // Check if department exists
      const existingDepartment = await this.departmentRepository.getDepartmentById(id);
      if (!existingDepartment) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.NOT_FOUND,
          `Department with ID ${id} not found`,
          'DeleteDepartmentUseCase.execute',
          { id }
        );
      }

      // Delete department from repository
      const result = await this.departmentRepository.deleteDepartment(id);
      return result;
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        'Failed to delete department',
        'DeleteDepartmentUseCase.execute',
        { id },
        error
      );
    }
  }
}
