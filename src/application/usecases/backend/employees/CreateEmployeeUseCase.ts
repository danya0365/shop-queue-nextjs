import { CreateEmployeeParams, EmployeeDTO, EmployeeStatus } from '@/src/application/dtos/backend/employees-dto';
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
      if (!input.employeeCode || !input.name || !input.position || !input.hireDate) {
        throw new BackendEmployeeError(
          BackendEmployeeErrorType.VALIDATION_ERROR,
          'Missing required employee fields',
          'CreateEmployeeUseCase.execute',
          { input }
        );
      }

      // map params to entity
      const employeeEntity: Omit<CreateEmployeeEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        employeeCode: input.employeeCode,
        name: input.name,
        email: input.email,
        phone: input.phone,
        departmentId: input.departmentId,
        position: input.position,
        shopId: input.shopId,
        status: input.status,
        hireDate: input.hireDate,
        permissions: input.permissions || [],
        salary: input.salary,
        notes: input.notes
      };

      // Create employee in repository
      const createdEmployee = await this.employeeRepository.createEmployee(employeeEntity);

      // map entity to dto
      const employeeDTO: EmployeeDTO = {
        id: createdEmployee.id,
        employeeCode: createdEmployee.employeeCode,
        name: createdEmployee.name,
        email: createdEmployee.email || undefined,
        phone: createdEmployee.phone || undefined,
        departmentId: createdEmployee.departmentId || undefined,
        position: createdEmployee.position,
        shopId: createdEmployee.shopId || undefined,
        status: createdEmployee.status as EmployeeStatus,
        hireDate: createdEmployee.hireDate,
        lastLogin: createdEmployee.lastLogin || undefined,
        permissions: createdEmployee.permissions || [],
        salary: createdEmployee.salary || undefined,
        notes: createdEmployee.notes || undefined,
        createdAt: createdEmployee.createdAt,
        updatedAt: createdEmployee.updatedAt
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
