import { EmployeeDTO, EmployeeStatus } from '@/src/application/dtos/backend/employees-dto';
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
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email || undefined,
        phone: employee.phone || undefined,
        departmentId: employee.departmentId || undefined,
        departmentName: employee.departmentName || undefined,
        position: employee.position,
        shopId: employee.shopId || undefined,
        shopName: employee.shopName || undefined,
        status: employee.status as EmployeeStatus,
        hireDate: employee.hireDate,
        lastLogin: employee.lastLogin || undefined,
        permissions: employee.permissions || [],
        salary: employee.salary || undefined,
        notes: employee.notes || undefined,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt
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
