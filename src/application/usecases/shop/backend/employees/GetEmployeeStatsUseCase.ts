import { EmployeeStatsDTO } from '@/src/application/dtos/shop/backend/employees-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { EmployeeMapper } from '@/src/application/mappers/shop/backend/employee-mapper';
import type { ShopBackendEmployeeRepository } from '@/src/domain/repositories/shop/backend/backend-employee-repository';
import { ShopBackendEmployeeError, ShopBackendEmployeeErrorType } from '@/src/domain/repositories/shop/backend/backend-employee-repository';

export class GetEmployeeStatsUseCase implements IUseCase<void, EmployeeStatsDTO> {
  constructor(
    private readonly employeeRepository: ShopBackendEmployeeRepository
  ) { }

  async execute(): Promise<EmployeeStatsDTO> {
    try {
      const stats = await this.employeeRepository.getEmployeeStats();
      return EmployeeMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        'Failed to get employee statistics',
        'GetEmployeeStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
