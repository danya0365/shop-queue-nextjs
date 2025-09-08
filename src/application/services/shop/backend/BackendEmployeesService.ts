import type { CreateEmployeeParams, EmployeeDTO, EmployeesDataDTO, EmployeeStatsDTO, PaginatedEmployeesDTO, UpdateEmployeeParams } from '@/src/application/dtos/shop/backend/employees-dto';
import { GetEmployeesPaginatedInput } from '@/src/application/dtos/shop/backend/employees-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IShopBackendEmployeesService {
  getEmployeesData(page?: number, perPage?: number): Promise<EmployeesDataDTO>;
  getEmployeeStats(): Promise<EmployeeStatsDTO>;
  getEmployeeById(id: string): Promise<EmployeeDTO>;
  createEmployee(params: CreateEmployeeParams): Promise<EmployeeDTO>;
  updateEmployee(id: string, params: UpdateEmployeeParams): Promise<EmployeeDTO>;
  deleteEmployee(id: string): Promise<boolean>;
}

export class ShopBackendEmployeesService implements IShopBackendEmployeesService {
  constructor(
    private readonly getEmployeesPaginatedUseCase: IUseCase<GetEmployeesPaginatedInput, PaginatedEmployeesDTO>,
    private readonly getEmployeeStatsUseCase: IUseCase<void, EmployeeStatsDTO>,
    private readonly getEmployeeByIdUseCase: IUseCase<string, EmployeeDTO>,
    private readonly createEmployeeUseCase: IUseCase<CreateEmployeeParams, EmployeeDTO>,
    private readonly updateEmployeeUseCase: IUseCase<UpdateEmployeeParams, EmployeeDTO>,
    private readonly deleteEmployeeUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get employees data including paginated employees and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Employees data DTO
   */
  async getEmployeesData(page: number = 1, perPage: number = 10): Promise<EmployeesDataDTO> {
    try {
      this.logger.info('Getting employees data', { page, perPage });

      // Get employees and stats in parallel
      const [employeesResult, stats] = await Promise.all([
        this.getEmployeesPaginatedUseCase.execute({ page, limit: perPage }),
        this.getEmployeeStatsUseCase.execute()
      ]);

      return {
        employees: employeesResult.data,
        stats,
        totalCount: employeesResult.pagination.totalItems,
        currentPage: employeesResult.pagination.currentPage,
        perPage: employeesResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting employees data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get employee statistics
   * @returns Employee stats DTO
   */
  async getEmployeeStats(): Promise<EmployeeStatsDTO> {
    try {
      this.logger.info('Getting employee stats');

      const stats = await this.getEmployeeStatsUseCase.execute();
      return stats;
    } catch (error) {
      this.logger.error('Error getting employee stats', { error });
      throw error;
    }
  }

  /**
   * Get an employee by ID
   * @param id Employee ID
   * @returns Employee DTO
   */
  async getEmployeeById(id: string): Promise<EmployeeDTO> {
    try {
      this.logger.info('Getting employee by ID', { id });

      const result = await this.getEmployeeByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting employee by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new employee
   * @param params Employee creation parameters
   * @returns Created employee DTO
   */
  async createEmployee(params: CreateEmployeeParams): Promise<EmployeeDTO> {
    try {
      this.logger.info('Creating employee', { params });

      const result = await this.createEmployeeUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating employee', { error, params });
      throw error;
    }
  }

  /**
   * Update an existing employee
   * @param id Employee ID
   * @param params Employee update parameters
   * @returns Updated employee DTO
   */
  async updateEmployee(id: string, params: UpdateEmployeeParams): Promise<EmployeeDTO> {
    try {
      this.logger.info('Updating employee', { id, params });

      const updateData = { ...params, id };
      const result = await this.updateEmployeeUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error('Error updating employee', { error, id, params });
      throw error;
    }
  }

  /**
   * Delete an employee
   * @param id Employee ID
   * @returns Success flag
   */
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting employee', { id });

      const result = await this.deleteEmployeeUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting employee', { error, id });
      throw error;
    }
  }
}
