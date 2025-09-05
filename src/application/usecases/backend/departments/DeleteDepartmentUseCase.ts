import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendDepartmentRepository } from '@/src/domain/repositories/backend/backend-department-repository';
import { BackendDepartmentError, BackendDepartmentErrorType } from '@/src/domain/repositories/backend/backend-department-repository';

export class DeleteDepartmentUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly departmentRepository: BackendDepartmentRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new BackendDepartmentError(
          BackendDepartmentErrorType.VALIDATION_ERROR,
          'Department ID is required',
          'DeleteDepartmentUseCase.execute',
          { id }
        );
      }

      // Check if department exists
      const existingDepartment = await this.departmentRepository.getDepartmentById(id);
      if (!existingDepartment) {
        throw new BackendDepartmentError(
          BackendDepartmentErrorType.NOT_FOUND,
          `Department with ID ${id} not found`,
          'DeleteDepartmentUseCase.execute',
          { id }
        );
      }

      // Delete department from repository
      const result = await this.departmentRepository.deleteDepartment(id);
      return result;
    } catch (error) {
      if (error instanceof BackendDepartmentError) {
        throw error;
      }

      throw new BackendDepartmentError(
        BackendDepartmentErrorType.UNKNOWN,
        'Failed to delete department',
        'DeleteDepartmentUseCase.execute',
        { id },
        error
      );
    }
  }
}
