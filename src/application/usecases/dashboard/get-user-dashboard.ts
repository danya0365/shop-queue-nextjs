import { IDashboardDataRepositoryAdapter } from '../../interfaces/dashboard-data-repository-adapter.interface';
import { DashboardDataDto } from '../../dtos/dashboard-dto';
import { IUseCase } from '../../interfaces/use-case.interface';

/**
 * Use case for getting user dashboard data
 * Following Single Responsibility Principle by handling only one specific operation
 */
export class GetUserDashboardUseCase implements IUseCase<void, DashboardDataDto | null> {
  constructor(private readonly dashboardAdapter: IDashboardDataRepositoryAdapter) {}

  /**
   * Execute the use case to get user dashboard data
   * @returns Dashboard data DTO or null if not found
   */
  async execute(): Promise<DashboardDataDto | null> {
    return await this.dashboardAdapter.getUserDashboard();
  }
}
