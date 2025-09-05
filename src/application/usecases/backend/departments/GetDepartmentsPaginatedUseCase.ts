import { DepartmentDTO } from '@/src/application/dtos/backend/department-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { DepartmentMapper } from '@/src/application/mappers/backend/department-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { BackendDepartmentRepository } from '@/src/domain/repositories/backend/backend-department-repository';
import { BackendDepartmentError, BackendDepartmentErrorType } from '@/src/domain/repositories/backend/backend-department-repository';

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
    private readonly departmentRepository: BackendDepartmentRepository
  ) { }

  async execute(input: GetDepartmentsPaginatedInput): Promise<PaginatedDepartmentsDTO> {
    try {
      // Validate input
      if (!input.page || input.page < 1) {
        throw new BackendDepartmentError(
          BackendDepartmentErrorType.VALIDATION_ERROR,
          'Page must be a positive number',
          'GetDepartmentsPaginatedUseCase.execute',
          { input }
        );
      }

      if (!input.limit || input.limit < 1) {
        throw new BackendDepartmentError(
          BackendDepartmentErrorType.VALIDATION_ERROR,
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
      if (error instanceof BackendDepartmentError) {
        throw error;
      }

      throw new BackendDepartmentError(
        BackendDepartmentErrorType.UNKNOWN,
        'Failed to get paginated departments',
        'GetDepartmentsPaginatedUseCase.execute',
        { input },
        error
      );
    }
  }
}
