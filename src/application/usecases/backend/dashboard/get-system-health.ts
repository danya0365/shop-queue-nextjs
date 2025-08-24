import { SystemHealthDto } from '../../../dtos/backend/backend-dashboard-dto';
import { IBackendDashboardRepositoryAdapter } from '../../../interfaces/backend/backend-dashboard-repository-adapter.interface';
import { IUseCase } from '../../../interfaces/use-case.interface';

/**
 * Input for GetSystemHealth use case
 * Empty object as this use case doesn't require input parameters
 */
export type GetSystemHealthInput = void;

/**
 * Output for GetSystemHealth use case
 * SystemHealthDto or null if not found
 */
export type GetSystemHealthOutput = SystemHealthDto | null;

/**
 * Use case for getting system health data
 * Following SOLID principles with single responsibility
 */
export class GetSystemHealthUseCase implements IUseCase<GetSystemHealthInput, GetSystemHealthOutput> {
  /**
   * Constructor with dependency injection
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   */
  constructor(
    private readonly backendDashboardAdapter: IBackendDashboardRepositoryAdapter
  ) {}

  /**
   * Execute the use case
   * @returns System health data or null if not available
   */
  async execute(): Promise<GetSystemHealthOutput> {
    return await this.backendDashboardAdapter.getSystemHealth();
  }
}
