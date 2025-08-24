import { PaginatedResultDto, PaginationParamsDto } from '@/src/application/dtos/pagination-dto';
import { VideoDto } from '@/src/application/dtos/video-dto';
import { ILogger } from '@/src/application/interfaces/logger.interface';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { IVideoRepositoryAdapter } from '@/src/application/interfaces/video-repository-adapter.interface';

/**
 * Use case for getting paginated liked videos by user
 * Following SOLID principles and Clean Architecture
 * Uses database-level pagination for efficiency
 */
export class GetPaginatedLikedVideosByUserUseCase implements IUseCase<{profileId: string, pagination: PaginationParamsDto}, PaginatedResultDto<VideoDto>> {
  /**
   * Constructor with dependency injection
   * @param videoAdapter Video repository adapter
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly videoAdapter: IVideoRepositoryAdapter,
    private readonly logger?: ILogger
  ) {}

  /**
   * Execute the use case
   * @param params Object containing profileId and pagination parameters
   * @returns Paginated result of video DTOs
   */
  async execute(params: {profileId: string, pagination: PaginationParamsDto}): Promise<PaginatedResultDto<VideoDto>> {
    const { profileId, pagination } = params;
    
    try {
      // Use database-level pagination to get liked videos by user
      return await this.videoAdapter.getPaginatedLikedByUser(profileId, pagination);
    } catch (error: unknown) {
      if (this.logger) {
        this.logger.error(`Error getting paginated liked videos for user ${profileId}:`, error as Error);
      }
      throw error;
    }
  }
}
