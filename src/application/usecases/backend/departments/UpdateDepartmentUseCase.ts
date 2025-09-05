import { DepartmentDTO, UpdateDepartmentDTO } from '@/src/application/dtos/backend/department-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { DepartmentMapper } from '@/src/application/mappers/backend/department-mapper';
import { UpdateDepartmentEntity } from '@/src/domain/entities/backend/backend-department.entity';
import type { BackendDepartmentRepository } from '@/src/domain/repositories/backend/backend-department-repository';
import { BackendDepartmentError, BackendDepartmentErrorType } from '@/src/domain/repositories/backend/backend-department-repository';

export class UpdateDepartmentUseCase implements IUseCase<UpdateDepartmentDTO, DepartmentDTO> {
  constructor(
    private readonly departmentRepository: BackendDepartmentRepository
  ) { }

  async execute(input: UpdateDepartmentDTO): Promise<DepartmentDTO> {
    try {
      // Validate required fields
      if (!input.id) {
        throw new BackendDepartmentError(
          BackendDepartmentErrorType.VALIDATION_ERROR,
          'Department ID is required for update',
          'UpdateDepartmentUseCase.execute',
          { input }
        );
      }

      // Check if department exists
      const existingDepartment = await this.departmentRepository.getDepartmentById(input.id);
      if (!existingDepartment) {
        throw new BackendDepartmentError(
          BackendDepartmentErrorType.NOT_FOUND,
          `Department with ID ${input.id} not found`,
          'UpdateDepartmentUseCase.execute',
          { input }
        );
      }

      // Prepare update data (exclude id from update)
      const updateData: Partial<Omit<UpdateDepartmentEntity, 'id' | 'createdAt' | 'updatedAt'>> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description || undefined;

      // Update department in repository
      const updatedDepartment = await this.departmentRepository.updateDepartment(input.id, updateData);

      // Use mapper to convert entity to DTO
      return DepartmentMapper.toDTO(updatedDepartment);
    } catch (error) {
      if (error instanceof BackendDepartmentError) {
        throw error;
      }

      throw new BackendDepartmentError(
        BackendDepartmentErrorType.UNKNOWN,
        'Failed to update department',
        'UpdateDepartmentUseCase.execute',
        { input },
        error
      );
    }
  }
}
