import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface EmployeeStats {
  total: number;
  online: number;
  serving: number;
}

export interface IGetEmployeeStatsUseCase {
  execute(shopId: string): Promise<EmployeeStats>;
}

export class GetEmployeeStatsUseCase implements IGetEmployeeStatsUseCase {
  constructor(
    private readonly repository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(shopId: string): Promise<EmployeeStats> {
    try {
      this.logger.info('GetEmployeeStatsUseCase: Getting employee stats for shop', { shopId });

      const employeeStats = await this.repository.getEmployeeStats(shopId);

      this.logger.info('GetEmployeeStatsUseCase: Successfully retrieved employee stats', { shopId, employeeStats });
      return employeeStats;
    } catch (error) {
      this.logger.error('GetEmployeeStatsUseCase: Error getting employee stats', error);
      throw error;
    }
  }
}
