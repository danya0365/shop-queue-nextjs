import { EmployeeStatsDTO } from '@/src/application/dtos/backend/employees-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { EmployeeMapper } from '@/src/application/mappers/backend/employee-mapper';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';

export class GetEmployeeStatsUseCase implements IUseCase<void, EmployeeStatsDTO> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository
  ) { }

  async execute(): Promise<EmployeeStatsDTO> {
    try {
      const stats = await this.employeeRepository.getEmployeeStats();
      return EmployeeMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        throw error;
      }

      throw new BackendEmployeeError(
        BackendEmployeeErrorType.UNKNOWN,
        'Failed to get employee statistics',
        'GetEmployeeStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
