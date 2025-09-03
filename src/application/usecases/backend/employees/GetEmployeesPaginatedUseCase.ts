
import { GetEmployeesPaginatedInput } from "@/src/application/dtos/backend/employees-dto";
import { PaginatedEmployeesEntity } from "@/src/domain/entities/backend/backend-employee.entity";
import { BackendEmployeeRepository } from "@/src/domain/repositories/backend/backend-employee-repository";
import { Logger } from "../../../../domain/interfaces/logger";
import { PaginationParams } from "../../../../domain/interfaces/pagination-types";
import { IUseCase } from "../../../interfaces/use-case.interface";


/**
 * Use case for getting paginated shops data
 * Following SOLID principles and Clean Architecture
 */
export class GetEmployeesPaginatedUseCase implements IUseCase<GetEmployeesPaginatedInput, PaginatedEmployeesEntity> {
  constructor(
    private employeeRepository: BackendEmployeeRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to get paginated shops data
   * @param input Pagination parameters
   * @returns Paginated shops data
   */
  async execute(input: GetEmployeesPaginatedInput): Promise<PaginatedEmployeesEntity> {
    try {
      this.logger.info('GetEmployeesPaginatedUseCase.execute', { input });

      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      return await this.employeeRepository.getPaginatedEmployees(paginationParams);
    } catch (error) {
      this.logger.error('Error in GetEmployeesPaginatedUseCase.execute', { error });
      throw error;
    }
  }
}
