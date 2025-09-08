import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendEmployeeRepository } from '@/src/domain/repositories/shop/backend/backend-employee-repository';
import { ShopBackendEmployeeError, ShopBackendEmployeeErrorType } from '@/src/domain/repositories/shop/backend/backend-employee-repository';

export class DeleteEmployeeUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly employeeRepository: ShopBackendEmployeeRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      // Validate ID
      if (!id) {
        throw new ShopBackendEmployeeError(
          ShopBackendEmployeeErrorType.VALIDATION_ERROR,
          'Employee ID is required',
          'DeleteEmployeeUseCase.execute'
        );
      }

      // Check if employee exists
      const existingEmployee = await this.employeeRepository.getEmployeeById(id);
      if (!existingEmployee) {
        throw new ShopBackendEmployeeError(
          ShopBackendEmployeeErrorType.NOT_FOUND,
          `Employee with id ${id} not found`,
          'DeleteEmployeeUseCase.execute'
        );
      }

      // Delete employee
      return await this.employeeRepository.deleteEmployee(id);
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        `Failed to delete employee with id ${id}`,
        'DeleteEmployeeUseCase.execute',
        {},
        error
      );
    }
  }
}
