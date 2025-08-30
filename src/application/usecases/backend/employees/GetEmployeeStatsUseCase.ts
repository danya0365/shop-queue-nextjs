import { EmployeeStatsDTO } from '@/src/application/dtos/backend/EmployeesDTO';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendEmployeeRepository } from '@/src/domain/repositories/backend/backend-employee-repository';
import { BackendEmployeeError, BackendEmployeeErrorType } from '@/src/domain/repositories/backend/backend-employee-repository';

export class GetEmployeeStatsUseCase implements IUseCase<void, EmployeeStatsDTO> {
  constructor(
    private readonly employeeRepository: BackendEmployeeRepository,
    private readonly logger: Logger
  ) { }

  async execute(): Promise<EmployeeStatsDTO> {
    try {
      this.logger.info('GetEmployeeStatsUseCase: Getting employee statistics');

      const stats = await this.employeeRepository.getEmployeeStats();

      // map entity to dto
      const statsDTO: EmployeeStatsDTO = {
        total_employees: stats.totalEmployees,
        active_employees: stats.activeEmployees,
        logged_in_today: stats.loggedInToday,
        new_employees_this_month: stats.newEmployeesThisMonth,
        by_department: {
          management: stats.byDepartment.management,
          customer_service: stats.byDepartment.customerService,
          technical: stats.byDepartment.technical,
          sales: stats.byDepartment.sales,
          other: stats.byDepartment.other
        }
      };

      this.logger.info('GetEmployeeStatsUseCase: Successfully retrieved employee statistics');
      return statsDTO;
    } catch (error) {
      if (error instanceof BackendEmployeeError) {
        this.logger.error(`GetEmployeeStatsUseCase: ${error.message}`, { error });
        throw error;
      }

      this.logger.error('GetEmployeeStatsUseCase: Error getting employee statistics', { error });
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
