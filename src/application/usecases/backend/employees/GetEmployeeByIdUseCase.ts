import { EmployeeDTO, EmployeeStatus } from '@/src/application/dtos/backend/EmployeesDTO';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';

export class GetEmployeeByIdUseCase implements IUseCase<string, EmployeeDTO> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository,
    private readonly logger: Logger
  ) { }

  async execute(id: string): Promise<EmployeeDTO> {
    try {
      this.logger.info(`GetEmployeeByIdUseCase: Getting employee with id ${id}`);

      const employee = await this.employeeRepository.getEmployeeById(id);

      if (!employee) {
        throw new BackendEmployeeError(
          BackendEmployeeErrorType.NOT_FOUND,
          `Employee with id ${id} not found`,
          'GetEmployeeByIdUseCase.execute'
        );
      }

      // map entity to dto
      const employeeDTO: EmployeeDTO = {
        id: employee.id,
        employee_code: employee.employeeCode,
        name: employee.name,
        email: employee.email || undefined,
        phone: employee.phone || undefined,
        department_id: employee.departmentId || undefined,
        department_name: employee.departmentName || undefined,
        position: employee.position,
        shop_id: employee.shopId || undefined,
        shop_name: employee.shopName || undefined,
        status: employee.status as EmployeeStatus,
        hire_date: employee.hireDate,
        last_login: employee.lastLogin || undefined,
        permissions: employee.permissions || [],
        salary: employee.salary || undefined,
        notes: employee.notes || undefined,
        created_at: employee.createdAt,
        updated_at: employee.updatedAt
      };

      this.logger.info(`GetEmployeeByIdUseCase: Successfully retrieved employee with id ${id}`);
      return employeeDTO;
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        this.logger.error(`GetEmployeeByIdUseCase: ${error.message}`, { error });
        throw error;
      }

      this.logger.error(`GetEmployeeByIdUseCase: Error getting employee with id ${id}`, { error });
      throw new BackendEmployeeError(
        BackendEmployeeErrorType.UNKNOWN,
        `Failed to get employee with id ${id}`,
        'GetEmployeeByIdUseCase.execute',
        {},
        error
      );
    }
  }
}
