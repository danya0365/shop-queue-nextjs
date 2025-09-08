import { EmployeeDTO } from '@/src/application/dtos/shop/backend/employees-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { EmployeeMapper } from '@/src/application/mappers/shop/backend/employee-mapper';
import type { ShopBackendEmployeeRepository } from '@/src/domain/repositories/shop/backend/backend-employee-repository';
import { ShopBackendEmployeeError, ShopBackendEmployeeErrorType } from '@/src/domain/repositories/shop/backend/backend-employee-repository';

export class GetEmployeeByIdUseCase implements IUseCase<string, EmployeeDTO> {
  constructor(
    private readonly employeeRepository: ShopBackendEmployeeRepository
  ) { }

  async execute(id: string): Promise<EmployeeDTO> {
    // Validate input
    if (!id) {
      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.VALIDATION_ERROR,
        'Employee ID is required',
        'GetEmployeeByIdUseCase.execute'
      );
    }

    const employee = await this.employeeRepository.getEmployeeById(id);

    if (!employee) {
      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.NOT_FOUND,
        `Employee with id ${id} not found`,
        'GetEmployeeByIdUseCase.execute'
      );
    }

    return EmployeeMapper.toDTO(employee);
  }
}
