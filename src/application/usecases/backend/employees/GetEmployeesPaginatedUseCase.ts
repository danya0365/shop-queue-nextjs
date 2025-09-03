
import { GetEmployeesPaginatedInput, PaginatedEmployeesDTO } from "@/src/application/dtos/backend/employees-dto";
import { EmployeeMapper } from "@/src/application/mappers/backend/employee-mapper";
import { BackendEmployeeRepository, BackendEmployeeError, BackendEmployeeErrorType } from "@/src/domain/repositories/backend/backend-employee-repository";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";


/**
 * Use case for getting paginated shops data
 * Following SOLID principles and Clean Architecture
 */
export class GetEmployeesPaginatedUseCase implements IUseCase<GetEmployeesPaginatedInput, PaginatedEmployeesDTO> {
  constructor(
    private employeeRepository: BackendEmployeeRepository
  ) { }

  /**
   * Execute the use case to get paginated shops data
   * @param input Pagination parameters
   * @returns Paginated shops data
   */
  async execute(input: GetEmployeesPaginatedInput): Promise<PaginatedEmployeesDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      const paginatedEmployees = await this.employeeRepository.getPaginatedEmployees(paginationParams);
      return EmployeeMapper.toPaginatedDTO(paginatedEmployees);
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        throw error;
      }
      
      throw new BackendEmployeeError(
        BackendEmployeeErrorType.UNKNOWN,
        'Failed to get paginated employees',
        'GetEmployeesPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
