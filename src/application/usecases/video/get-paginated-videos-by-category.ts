import { Logger } from '@/src/domain/interfaces/logger';
import { PaginatedResultDto, PaginationParamsDto } from '../../dtos/pagination-dto';
import { VideoDto } from '../../dtos/video-dto';
import { IUseCase } from '../../interfaces/use-case.interface';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

/**
 * Use case for getting paginated videos by category
 * Follows Single Responsibility Principle by handling only one task
 */
export class GetPaginatedVideosByCategoryUseCase implements IUseCase<{categoryId: string, pagination: PaginationParamsDto}, PaginatedResultDto<VideoDto>> {
  constructor(
    private readonly videoAdapter: IVideoRepositoryAdapter,
    private readonly logger?: Logger
  ) {}

  /**
   * Execute the use case to get paginated videos by category
   * @param params Object containing categoryId and pagination parameters
   * @returns Paginated result with videos
   */
  async execute(params: {categoryId: string, pagination: PaginationParamsDto}): Promise<PaginatedResultDto<VideoDto>> {
    try {
      const { categoryId, pagination } = params;
      
      if (this.logger) {
        this.logger.info(`Getting paginated videos for category ${categoryId}, page ${pagination.page}, limit ${pagination.limit}`);
      }
      
      return await this.videoAdapter.getPaginatedVideosByCategory(categoryId, pagination);
    } catch (error) {
      if (this.logger) {
        this.logger.error(
          `Error getting paginated videos for category: ${params.categoryId}`, 
          error instanceof Error ? error : new Error(String(error))
        );
      }
      throw error;
    }
  }
}
