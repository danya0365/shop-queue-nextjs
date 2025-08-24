import { RecentProfileDto } from '../../../dtos/backend/backend-dashboard-dto';
import { IBackendDashboardRepositoryAdapter } from '../../../interfaces/backend/backend-dashboard-repository-adapter.interface';
import { IUseCase } from '../../../interfaces/use-case.interface';
import { z } from 'zod';

/**
 * Input schema for GetRecentProfiles use case
 */
const getRecentProfilesInputSchema = z.object({
  limit: z.number().optional()
});

/**
 * Input for GetRecentProfiles use case
 */
export type GetRecentProfilesInput = z.infer<typeof getRecentProfilesInputSchema>;

/**
 * Output for GetRecentProfiles use case
 * Array of RecentProfileDto
 */
export type GetRecentProfilesOutput = RecentProfileDto[];

/**
 * Use case for getting recent user profiles
 * Following SOLID principles with single responsibility
 */
export class GetRecentProfilesUseCase implements IUseCase<GetRecentProfilesInput, GetRecentProfilesOutput> {
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
   * @returns Array of recent user profiles
   */
  async execute(input?: GetRecentProfilesInput): Promise<GetRecentProfilesOutput> {
    // Validate input if provided
    if (input) {
      getRecentProfilesInputSchema.parse(input);
    }
    
    return await this.backendDashboardAdapter.getRecentProfiles(input?.limit);
  }
}
