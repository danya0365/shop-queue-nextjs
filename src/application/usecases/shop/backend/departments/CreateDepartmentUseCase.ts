import { CreateDepartmentDTO, DepartmentDTO } from '@/src/application/dtos/shop/backend/department-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { DepartmentMapper } from '@/src/application/mappers/shop/backend/department-mapper';
import { CreateDepartmentEntity } from '@/src/domain/entities/shop/backend/backend-department.entity';
import type { ShopBackendDepartmentRepository } from '@/src/domain/repositories/shop/backend/backend-department-repository';
import { ShopBackendDepartmentError, ShopBackendDepartmentErrorType } from '@/src/domain/repositories/shop/backend/backend-department-repository';

export class CreateDepartmentUseCase implements IUseCase<CreateDepartmentDTO, DepartmentDTO> {
  constructor(
    private readonly departmentRepository: ShopBackendDepartmentRepository
  ) { }

  async execute(input: CreateDepartmentDTO): Promise<DepartmentDTO> {
    try {
      // Validate required fields
      if (!input.shopId || !input.name || !input.slug) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.VALIDATION_ERROR,
          'Missing required department fields',
          'CreateDepartmentUseCase.execute',
          { input }
        );
      }

      // map params to entity
      const departmentEntity: Omit<CreateDepartmentEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        shopId: input.shopId,
        name: input.name,
        slug: input.slug,
        description: input.description || undefined
      };

      // Create department in repository
      const createdDepartment = await this.departmentRepository.createDepartment(departmentEntity);

      // Use mapper to convert entity to DTO
      return DepartmentMapper.toDTO(createdDepartment);
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        'Failed to create department',
        'CreateDepartmentUseCase.execute',
        { input },
        error
      );
    }
  }
}
