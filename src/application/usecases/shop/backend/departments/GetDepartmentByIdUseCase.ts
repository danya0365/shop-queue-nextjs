import { DepartmentDTO } from '@/src/application/dtos/shop/backend/department-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { DepartmentMapper } from '@/src/application/mappers/shop/backend/department-mapper';
import type { ShopBackendDepartmentRepository } from '@/src/domain/repositories/shop/backend/backend-department-repository';
import { ShopBackendDepartmentError, ShopBackendDepartmentErrorType } from '@/src/domain/repositories/shop/backend/backend-department-repository';

export class GetDepartmentByIdUseCase implements IUseCase<string, DepartmentDTO> {
  constructor(
    private readonly departmentRepository: ShopBackendDepartmentRepository
  ) { }

  async execute(id: string): Promise<DepartmentDTO> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.VALIDATION_ERROR,
          'Department ID is required',
          'GetDepartmentByIdUseCase.execute',
          { id }
        );
      }

      // Get department from repository
      const department = await this.departmentRepository.getDepartmentById(id);

      if (!department) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.NOT_FOUND,
          `Department with ID ${id} not found`,
          'GetDepartmentByIdUseCase.execute',
          { id }
        );
      }

      // Use mapper to convert entity to DTO
      return DepartmentMapper.toDTO(department);
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        'Failed to get department by ID',
        'GetDepartmentByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
