import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';

export class DeleteEmployeeUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository,
    private readonly logger: Logger
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      this.logger.info(`DeleteEmployeeUseCase: Deleting employee with id ${id}`);

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
      const result = await this.employeeRepository.deleteEmployee(id);

      this.logger.info(`DeleteEmployeeUseCase: Successfully deleted employee with id ${id}`);
      return result;
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        this.logger.error(`DeleteEmployeeUseCase: ${error.message}`, { error });
        throw error;
      }

      this.logger.error(`DeleteEmployeeUseCase: Error deleting employee with id ${id}`, { error });
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
