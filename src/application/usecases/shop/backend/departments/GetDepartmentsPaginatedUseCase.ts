import { DepartmentDTO } from '@/src/application/dtos/shop/backend/department-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { DepartmentMapper } from '@/src/application/mappers/shop/backend/department-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { ShopBackendDepartmentRepository } from '@/src/domain/repositories/shop/backend/backend-department-repository';
import { ShopBackendDepartmentError, ShopBackendDepartmentErrorType } from '@/src/domain/repositories/shop/backend/backend-department-repository';

export interface GetDepartmentsPaginatedInput {
  page: number;
  limit: number;
}

export interface PaginatedDepartmentsDTO {
  data: DepartmentDTO[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class GetDepartmentsPaginatedUseCase implements IUseCase<GetDepartmentsPaginatedInput, PaginatedDepartmentsDTO> {
  constructor(
    private readonly departmentRepository: ShopBackendDepartmentRepository
  ) { }

  async execute(input: GetDepartmentsPaginatedInput): Promise<PaginatedDepartmentsDTO> {
    try {
      // Validate input
      if (!input.page || input.page < 1) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.VALIDATION_ERROR,
          'Page must be a positive number',
          'GetDepartmentsPaginatedUseCase.execute',
          { input }
        );
      }

      if (!input.limit || input.limit < 1) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.VALIDATION_ERROR,
          'Limit must be a positive number',
          'GetDepartmentsPaginatedUseCase.execute',
          { input }
        );
      }

      const params: PaginationParams = {
        page: input.page,
        limit: input.limit
      };

      // Get paginated departments from repository
      const paginatedDepartments = await this.departmentRepository.getPaginatedDepartments(params);

      // Map entities to DTOs
      return {
        data: paginatedDepartments.data.map(department => DepartmentMapper.toDTO(department)),
        pagination: paginatedDepartments.pagination
      };
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        'Failed to get paginated departments',
        'GetDepartmentsPaginatedUseCase.execute',
        { input },
        error
      );
    }
  }
}
