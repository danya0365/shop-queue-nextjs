import { DepartmentDTO } from '@/src/application/dtos/backend/department-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { DepartmentMapper } from '@/src/application/mappers/backend/department-mapper';
import type { BackendDepartmentRepository } from '@/src/domain/repositories/backend/backend-department-repository';
import { BackendDepartmentError, BackendDepartmentErrorType } from '@/src/domain/repositories/backend/backend-department-repository';

export class GetDepartmentByIdUseCase implements IUseCase<string, DepartmentDTO> {
  constructor(
    private readonly departmentRepository: BackendDepartmentRepository
  ) { }

  async execute(id: string): Promise<DepartmentDTO> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new BackendDepartmentError(
          BackendDepartmentErrorType.VALIDATION_ERROR,
          'Department ID is required',
          'GetDepartmentByIdUseCase.execute',
          { id }
        );
      }

      // Get department from repository
      const department = await this.departmentRepository.getDepartmentById(id);

      if (!department) {
        throw new BackendDepartmentError(
          BackendDepartmentErrorType.NOT_FOUND,
          `Department with ID ${id} not found`,
          'GetDepartmentByIdUseCase.execute',
          { id }
        );
      }

      // Use mapper to convert entity to DTO
      return DepartmentMapper.toDTO(department);
    } catch (error) {
      if (error instanceof BackendDepartmentError) {
        throw error;
      }

      throw new BackendDepartmentError(
        BackendDepartmentErrorType.UNKNOWN,
        'Failed to get department by ID',
        'GetDepartmentByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
