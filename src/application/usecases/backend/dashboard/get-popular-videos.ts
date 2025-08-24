import { PopularVideoDto } from '../../../dtos/backend/backend-dashboard-dto';
import { IBackendDashboardRepositoryAdapter } from '../../../interfaces/backend/backend-dashboard-repository-adapter.interface';
import { IUseCase } from '../../../interfaces/use-case.interface';
import { z } from 'zod';

/**
 * Input schema for GetPopularVideos use case
 */
const getPopularVideosInputSchema = z.object({
  limit: z.number().optional()
});

/**
 * Input for GetPopularVideos use case
 */
export type GetPopularVideosInput = z.infer<typeof getPopularVideosInputSchema>;

/**
 * Output for GetPopularVideos use case
 * Array of PopularVideoDto
 */
export type GetPopularVideosOutput = PopularVideoDto[];

/**
 * Use case for getting popular videos
 * Following SOLID principles with single responsibility
 */
export class GetPopularVideosUseCase implements IUseCase<GetPopularVideosInput, GetPopularVideosOutput> {
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
   * @returns Array of popular videos
   */
  async execute(input?: GetPopularVideosInput): Promise<GetPopularVideosOutput> {
    // Validate input if provided
    if (input) {
      getPopularVideosInputSchema.parse(input);
    }
    
    return await this.backendDashboardAdapter.getPopularVideos(input?.limit);
  }
}
