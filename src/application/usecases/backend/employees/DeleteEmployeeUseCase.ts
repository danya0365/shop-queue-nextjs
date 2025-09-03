import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';

export class DeleteEmployeeUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      // Validate ID
      if (!id) {
        throw new BackendEmployeeError(
          BackendEmployeeErrorType.VALIDATION_ERROR,
          'Employee ID is required',
          'DeleteEmployeeUseCase.execute'
        );
      }

      // Check if employee exists
      const existingEmployee = await this.employeeRepository.getEmployeeById(id);
      if (!existingEmployee) {
        throw new BackendEmployeeError(
          BackendEmployeeErrorType.NOT_FOUND,
          `Employee with id ${id} not found`,
          'DeleteEmployeeUseCase.execute'
        );
      }

      // Delete employee
      return await this.employeeRepository.deleteEmployee(id);
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        throw error;
      }

      throw new BackendEmployeeError(
        BackendEmployeeErrorType.UNKNOWN,
        `Failed to delete employee with id ${id}`,
        'DeleteEmployeeUseCase.execute',
        {},
        error
      );
    }
  }
}
