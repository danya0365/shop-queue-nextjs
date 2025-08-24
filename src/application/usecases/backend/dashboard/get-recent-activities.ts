import { BackendActivityDto } from '../../../dtos/backend/backend-dashboard-dto';
import { IBackendDashboardRepositoryAdapter } from '../../../interfaces/backend/backend-dashboard-repository-adapter.interface';
import { IUseCase } from '../../../interfaces/use-case.interface';
import { z } from 'zod';

/**
 * Input schema for GetRecentActivities use case
 */
const getRecentActivitiesInputSchema = z.object({
  limit: z.number().optional()
});

/**
 * Input for GetRecentActivities use case
 */
export type GetRecentActivitiesInput = z.infer<typeof getRecentActivitiesInputSchema>;

/**
 * Output for GetRecentActivities use case
 * Array of BackendActivityDto
 */
export type GetRecentActivitiesOutput = BackendActivityDto[];

/**
 * Use case for getting recent backend activities
 * Following SOLID principles with single responsibility
 */
export class GetRecentActivitiesUseCase implements IUseCase<GetRecentActivitiesInput, GetRecentActivitiesOutput> {
  /**
   * Constructor with dependency injection
   * @param backendDashboardAdapter Adapter for backend dashboard operations
   */
  constructor(
    private readonly backendDashboardAdapter: IBackendDashboardRepositoryAdapter
  ) {}

  /**
   * Execute the use case
   * @param input Input parameters with optional limit
   * @returns Array of recent activities
   */
  async execute(input?: GetRecentActivitiesInput): Promise<GetRecentActivitiesOutput> {
    // Validate input if provided
    if (input) {
      getRecentActivitiesInputSchema.parse(input);
    }
    
    return await this.backendDashboardAdapter.getRecentActivities(input?.limit);
  }
}
