
import type { CreateEmployeeParams, EmployeeDTO, EmployeesDataDTO, EmployeeStatsDTO, UpdateEmployeeParams } from '@/src/application/dtos/backend/employees-dto';
import { GetEmployeesPaginatedInput } from '@/src/application/dtos/backend/employees-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaginatedEmployeesEntity } from '@/src/domain/entities/backend/backend-employee.entity';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendEmployeesService {
  getEmployeesData(page?: number, perPage?: number): Promise<EmployeesDataDTO>;
  getEmployeeStats(): Promise<EmployeeStatsDTO>;
  getEmployeeById(id: string): Promise<EmployeeDTO>;
  createEmployee(params: CreateEmployeeParams): Promise<EmployeeDTO>;
  updateEmployee(id: string, params: UpdateEmployeeParams): Promise<EmployeeDTO>;
  deleteEmployee(id: string): Promise<boolean>;
}

export class BackendEmployeesService implements IBackendEmployeesService {
  constructor(
    private readonly getEmployeesPaginatedUseCase: IUseCase<GetEmployeesPaginatedInput, PaginatedEmployeesEntity>,
    private readonly getEmployeeStatsUseCase: IUseCase<void, EmployeeStatsDTO>,
    private readonly getEmployeeByIdUseCase: IUseCase<string, EmployeeDTO>,
    private readonly createEmployeeUseCase: IUseCase<CreateEmployeeParams, EmployeeDTO>,
    private readonly updateEmployeeUseCase: IUseCase<UpdateEmployeeParams, EmployeeDTO>,
    private readonly deleteEmployeeUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  async getEmployeesData(page: number = 1, perPage: number = 10): Promise<EmployeesDataDTO> {
    try {
      this.logger.info('BackendEmployeesService: Getting employees data');

      const employeesData = await this.getEmployeesPaginatedUseCase.execute({ page, limit: perPage });
      const employeeStats = await this.getEmployeeStatsUseCase.execute();

      const employees = employeesData.data.map((employee) => ({
        ...employee,
        email: employee.email || undefined,
        phone: employee.phone || undefined,
        departmentId: employee.departmentId || undefined,
        departmentName: employee.departmentName || undefined,
        shopId: employee.shopId || undefined,
        shopName: employee.shopName || undefined,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
        lastLogin: employee.lastLogin || undefined,
        permissions: employee.permissions || [],
        salary: employee.salary || undefined,
        notes: employee.notes || undefined,
      }));

      this.logger.info('BackendEmployeesService: Successfully retrieved employees data');
      return {
        employees,
        stats: employeeStats,
        totalCount: employeesData.pagination.totalItems,
        currentPage: employeesData.pagination.currentPage,
        perPage: employeesData.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('BackendEmployeesService: Error getting employees data', error);
      throw error;
    }
  }

  async getEmployeeStats(): Promise<EmployeeStatsDTO> {
    try {
      this.logger.info('BackendEmployeesService: Getting employee stats');

      const employeeStats = await this.getEmployeeStatsUseCase.execute();

      this.logger.info('BackendEmployeesService: Successfully retrieved employee stats');
      return employeeStats;
    } catch (error) {
      this.logger.error('BackendEmployeesService: Error getting employee stats', error);
      throw error;
    }
  }

  async getEmployeeById(id: string): Promise<EmployeeDTO> {
    try {
      this.logger.info(`BackendEmployeesService: Getting employee with id ${id}`);

      const employee = await this.getEmployeeByIdUseCase.execute(id);

      this.logger.info(`BackendEmployeesService: Successfully retrieved employee with id ${id}`);
      return employee;
    } catch (error) {
      this.logger.error(`BackendEmployeesService: Error getting employee with id ${id}`, error);
      throw error;
    }
  }

  async createEmployee(params: CreateEmployeeParams): Promise<EmployeeDTO> {
    try {
      this.logger.info('BackendEmployeesService: Creating employee');

      const employee = await this.createEmployeeUseCase.execute(params);

      this.logger.info('BackendEmployeesService: Successfully created employee');
      return employee;
    } catch (error) {
      this.logger.error('BackendEmployeesService: Error creating employee', error);
      throw error;
    }
  }

  async updateEmployee(id: string, params: UpdateEmployeeParams): Promise<EmployeeDTO> {
    try {
      this.logger.info(`BackendEmployeesService: Updating employee with id ${id}`);

      const employee = await this.updateEmployeeUseCase.execute({ ...params, id });

      this.logger.info(`BackendEmployeesService: Successfully updated employee with id ${id}`);
      return employee;
    } catch (error) {
      this.logger.error(`BackendEmployeesService: Error updating employee with id ${id}`, error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      this.logger.info(`BackendEmployeesService: Deleting employee with id ${id}`);

      const result = await this.deleteEmployeeUseCase.execute(id);

      this.logger.info(`BackendEmployeesService: Successfully deleted employee with id ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`BackendEmployeesService: Error deleting employee with id ${id}`, error);
      throw error;
    }
  }
}
