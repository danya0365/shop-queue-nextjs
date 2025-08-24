import { DashboardStatsDto } from '../../../dtos/backend/backend-dashboard-dto';
import { IBackendDashboardRepositoryAdapter } from '../../../interfaces/backend/backend-dashboard-repository-adapter.interface';
import { IUseCase } from '../../../interfaces/use-case.interface';

/**
 * Input for GetDashboardStats use case
 * Empty object as this use case doesn't require input parameters
 */
export type GetDashboardStatsInput = void;

/**
 * Output for GetDashboardStats use case
 * DashboardStatsDto with statistics data
 */
export type GetDashboardStatsOutput = DashboardStatsDto;

/**
 * Use case for getting dashboard statistics
 * Following SOLID principles with single responsibility
 */
export class GetDashboardStatsUseCase implements IUseCase<GetDashboardStatsInput, GetDashboardStatsOutput> {
  /**
   * Constructor with dependency injection
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   */
  constructor(
    private readonly backendDashboardAdapter: IBackendDashboardRepositoryAdapter
  ) {}

  /**
   * Execute the use case
   * @returns Dashboard statistics data
   */
  async execute(): Promise<GetDashboardStatsOutput> {
    return await this.backendDashboardAdapter.getDashboardStats();
  }
}
