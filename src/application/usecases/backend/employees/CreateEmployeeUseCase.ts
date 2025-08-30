import { CreateEmployeeParams, EmployeeDTO, EmployeeStatus } from '@/src/application/dtos/backend/EmployeesDTO';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CreateEmployeeEntity } from '@/src/domain/entities/backend/backend-employee.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';


export class CreateEmployeeUseCase implements IUseCase<CreateEmployeeParams, EmployeeDTO> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository,
    private readonly logger: Logger
  ) { }

  async execute(input: CreateEmployeeParams): Promise<EmployeeDTO> {
    try {
      this.logger.info('CreateEmployeeUseCase: Creating new employee', { input });

      // Validate required fields
      if (!input.employee_code || !input.name || !input.position || !input.hire_date) {
        throw new BackendEmployeeError(
          BackendEmployeeErrorType.VALIDATION_ERROR,
          'Missing required employee fields',
          'CreateEmployeeUseCase.execute',
          { input }
        );
      }

      // map params to entity
      const employeeEntity: Omit<CreateEmployeeEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        employeeCode: input.employee_code,
        name: input.name,
        email: input.email,
        phone: input.phone,
        departmentId: input.department_id,
        position: input.position,
        shopId: input.shop_id,
        status: input.status,
        hireDate: input.hire_date,
        permissions: input.permissions || [],
        salary: input.salary,
        notes: input.notes
      };

      // Create employee in repository
      const createdEmployee = await this.employeeRepository.createEmployee(employeeEntity);

      // map entity to dto
      const employeeDTO: EmployeeDTO = {
        id: createdEmployee.id,
        employee_code: createdEmployee.employeeCode,
        name: createdEmployee.name,
        email: createdEmployee.email || undefined,
        phone: createdEmployee.phone || undefined,
        department_id: createdEmployee.departmentId || undefined,
        position: createdEmployee.position,
        shop_id: createdEmployee.shopId || undefined,
        status: createdEmployee.status as EmployeeStatus,
        hire_date: createdEmployee.hireDate,
        last_login: createdEmployee.lastLogin || undefined,
        permissions: createdEmployee.permissions || [],
        salary: createdEmployee.salary || undefined,
        notes: createdEmployee.notes || undefined,
        created_at: createdEmployee.createdAt,
        updated_at: createdEmployee.updatedAt
      };

      this.logger.info('CreateEmployeeUseCase: Successfully created employee', { id: employeeDTO.id });
      return employeeDTO;
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        this.logger.error(`CreateEmployeeUseCase: ${error.message}`, { error });
        throw error;
      }

      this.logger.error('CreateEmployeeUseCase: Error creating employee', { error, input });
      throw new BackendEmployeeError(
        BackendEmployeeErrorType.UNKNOWN,
        'Failed to create employee',
        'CreateEmployeeUseCase.execute',
        { input },
        error
      );
    }
  }
}
