import { EmployeeDTO } from '@/src/application/dtos/backend/employees-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { EmployeeMapper } from '@/src/application/mappers/backend/employee-mapper';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';

export class GetEmployeeByIdUseCase implements IUseCase<string, EmployeeDTO> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository
  ) { }

  async execute(id: string): Promise<EmployeeDTO> {
    // Validate input
    if (!id) {
      throw new BackendEmployeeError(
        BackendEmployeeErrorType.VALIDATION_ERROR,
        'Employee ID is required',
        'GetEmployeeByIdUseCase.execute'
      );
    }

    const employee = await this.employeeRepository.getEmployeeById(id);

    if (!employee) {
      throw new BackendEmployeeError(
        BackendEmployeeErrorType.NOT_FOUND,
        `Employee with id ${id} not found`,
        'GetEmployeeByIdUseCase.execute'
      );
    }

    return EmployeeMapper.toDTO(employee);
  }
}
