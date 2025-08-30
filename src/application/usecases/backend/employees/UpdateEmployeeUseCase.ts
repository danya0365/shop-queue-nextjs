import { EmployeeDTO, EmployeeStatus, UpdateEmployeeParams } from '@/src/application/dtos/backend/EmployeesDTO';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { UpdateEmployeeEntity } from '@/src/domain/entities/backend/backend-employee.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';


export class UpdateEmployeeUseCase implements IUseCase<UpdateEmployeeParams, EmployeeDTO> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository,
    private readonly logger: Logger
  ) { }

  async execute(input: UpdateEmployeeParams): Promise<EmployeeDTO> {
    try {
      this.logger.info(`UpdateEmployeeUseCase: Updating employee with id ${input.id}`, { input });

      // Validate ID
      if (!input.id) {
        throw new BackendEmployeeError(
          BackendEmployeeErrorType.VALIDATION_ERROR,
          'Employee ID is required',
          'UpdateEmployeeUseCase.execute',
          { input }
        );
      }

      // Check if employee exists
      const existingEmployee = await this.employeeRepository.getEmployeeById(input.id);
      if (!existingEmployee) {
        throw new BackendEmployeeError(
          BackendEmployeeErrorType.NOT_FOUND,
          `Employee with id ${input.id} not found`,
          'UpdateEmployeeUseCase.execute',
          { input }
        );
      }

      // Map DTO to domain entity
      const employeeEntity: Partial<Omit<UpdateEmployeeEntity, 'id' | 'createdAt' | 'updatedAt'>> = {};

      if (input.employee_code !== undefined) employeeEntity.employeeCode = input.employee_code;
      if (input.name !== undefined) employeeEntity.name = input.name;
      if (input.email !== undefined) employeeEntity.email = input.email;
      if (input.phone !== undefined) employeeEntity.phone = input.phone;
      if (input.department_id !== undefined) employeeEntity.departmentId = input.department_id;
      if (input.position !== undefined) employeeEntity.position = input.position;
      if (input.shop_id !== undefined) employeeEntity.shopId = input.shop_id;
      if (input.status !== undefined) employeeEntity.status = input.status;
      if (input.hire_date !== undefined) employeeEntity.hireDate = input.hire_date;
      if (input.permissions !== undefined) employeeEntity.permissions = input.permissions;
      if (input.salary !== undefined) employeeEntity.salary = input.salary;
      if (input.notes !== undefined) employeeEntity.notes = input.notes;

      // Update employee in repository
      const updatedEmployee = await this.employeeRepository.updateEmployee(input.id, employeeEntity);

      // Map domain entity back to DTO
      const employeeDTO: EmployeeDTO = {
        id: updatedEmployee.id,
        employee_code: updatedEmployee.employeeCode,
        name: updatedEmployee.name,
        email: updatedEmployee.email || undefined,
        phone: updatedEmployee.phone || undefined,
        department_id: updatedEmployee.departmentId || undefined,
        department_name: updatedEmployee.departmentName || undefined,
        position: updatedEmployee.position,
        shop_id: updatedEmployee.shopId || undefined,
        shop_name: updatedEmployee.shopName || undefined,
        status: updatedEmployee.status as EmployeeStatus,
        hire_date: updatedEmployee.hireDate,
        last_login: updatedEmployee.lastLogin || undefined,
        permissions: updatedEmployee.permissions || [],
        salary: updatedEmployee.salary || undefined,
        notes: updatedEmployee.notes || undefined,
        created_at: updatedEmployee.createdAt,
        updated_at: updatedEmployee.updatedAt
      };

      this.logger.info(`UpdateEmployeeUseCase: Successfully updated employee with id ${input.id}`);
      return employeeDTO;
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        this.logger.error(`UpdateEmployeeUseCase: ${error.message}`, { error });
        throw error;
      }

      this.logger.error(`UpdateEmployeeUseCase: Error updating employee with id ${input.id}`, { error, input });
      throw new BackendEmployeeError(
        BackendEmployeeErrorType.UNKNOWN,
        `Failed to update employee with id ${input.id}`,
        'UpdateEmployeeUseCase.execute',
        { input },
        error
      );
    }
  }
}
