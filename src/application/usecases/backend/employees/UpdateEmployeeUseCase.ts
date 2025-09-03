import { EmployeeDTO, UpdateEmployeeParams } from '@/src/application/dtos/backend/employees-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { EmployeeMapper } from '@/src/application/mappers/backend/employee-mapper';
import { UpdateEmployeeEntity } from '@/src/domain/entities/backend/backend-employee.entity';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';


export class UpdateEmployeeUseCase implements IUseCase<UpdateEmployeeParams, EmployeeDTO> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository
  ) { }

  async execute(input: UpdateEmployeeParams): Promise<EmployeeDTO> {
    try {
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

      if (input.employeeCode !== undefined) employeeEntity.employeeCode = input.employeeCode;
      if (input.name !== undefined) employeeEntity.name = input.name;
      if (input.email !== undefined) employeeEntity.email = input.email;
      if (input.phone !== undefined) employeeEntity.phone = input.phone;
      if (input.departmentId !== undefined) employeeEntity.departmentId = input.departmentId;
      if (input.position !== undefined) employeeEntity.position = input.position;
      if (input.shopId !== undefined) employeeEntity.shopId = input.shopId;
      if (input.status !== undefined) employeeEntity.status = input.status;
      if (input.hireDate !== undefined) employeeEntity.hireDate = input.hireDate;
      if (input.permissions !== undefined) employeeEntity.permissions = input.permissions;
      if (input.salary !== undefined) employeeEntity.salary = input.salary;
      if (input.notes !== undefined) employeeEntity.notes = input.notes;

      // Update employee in repository
      const updatedEmployee = await this.employeeRepository.updateEmployee(input.id, employeeEntity);

      // Use mapper to convert entity to DTO
      return EmployeeMapper.toDTO(updatedEmployee);
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        throw error;
      }

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
