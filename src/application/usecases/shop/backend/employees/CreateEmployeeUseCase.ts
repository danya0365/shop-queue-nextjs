import { CreateEmployeeParams, EmployeeDTO } from '@/src/application/dtos/shop/backend/employees-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { EmployeeMapper } from '@/src/application/mappers/shop/backend/employee-mapper';
import { CreateEmployeeEntity } from '@/src/domain/entities/shop/backend/backend-employee.entity';
import type { ShopBackendEmployeeRepository } from '@/src/domain/repositories/shop/backend/backend-employee-repository';
import { ShopBackendEmployeeError, ShopBackendEmployeeErrorType } from '@/src/domain/repositories/shop/backend/backend-employee-repository';


export class CreateEmployeeUseCase implements IUseCase<CreateEmployeeParams, EmployeeDTO> {
  constructor(
    private readonly employeeRepository: ShopBackendEmployeeRepository
  ) { }

  async execute(input: CreateEmployeeParams): Promise<EmployeeDTO> {
    try {
      // Validate required fields
      if (!input.employeeCode || !input.name || !input.position || !input.hireDate) {
        throw new ShopBackendEmployeeError(
          ShopBackendEmployeeErrorType.VALIDATION_ERROR,
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

      // Use mapper to convert entity to DTO
      return EmployeeMapper.toDTO(createdEmployee);
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        'Failed to create employee',
        'CreateEmployeeUseCase.execute',
        { input },
        error
      );
    }
  }
}
