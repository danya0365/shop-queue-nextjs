
import { GetEmployeesPaginatedInput, PaginatedEmployeesDTO } from "@/src/application/dtos/shop/backend/employees-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { EmployeeMapper } from "@/src/application/mappers/shop/backend/employee-mapper";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { ShopBackendEmployeeError, ShopBackendEmployeeErrorType, ShopBackendEmployeeRepository } from "@/src/domain/repositories/shop/backend/backend-employee-repository";


/**
 * Use case for getting paginated shops data
 * Following SOLID principles and Clean Architecture
 */
export class GetEmployeesPaginatedUseCase implements IUseCase<GetEmployeesPaginatedInput, PaginatedEmployeesDTO> {
  constructor(
    private employeeRepository: ShopBackendEmployeeRepository
  ) { }

  /**
   * Execute the use case to get paginated shops data
   * @param input Pagination and filter parameters
   * @returns Paginated shops data
   */
  async execute(input: GetEmployeesPaginatedInput): Promise<PaginatedEmployeesDTO> {
    try {
      const paginationParams: PaginationParams & {
        filters?: {
          searchQuery?: string;
          departmentFilter?: string;
          positionFilter?: string;
          statusFilter?: string;
          dateFrom?: string;
          dateTo?: string;
          minSalary?: number;
          maxSalary?: number;
        };
      } = {
        page: input.page || 1,
        limit: input.limit || 10,
        filters: input.filters
      };

      const paginatedEmployees = await this.employeeRepository.getPaginatedEmployees(paginationParams);
      return EmployeeMapper.toPaginatedDTO(paginatedEmployees);
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        'Failed to get paginated employees',
        'GetEmployeesPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
