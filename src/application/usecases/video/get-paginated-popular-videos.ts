import { Logger } from '@/src/domain/interfaces/logger';
import { PaginatedResultDto, PaginationParamsDto } from '../../dtos/pagination-dto';
import { VideoDto } from '../../dtos/video-dto';
import { IUseCase } from '../../interfaces/use-case.interface';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

/**
 * Use case for getting paginated popular videos
 * Following Single Responsibility Principle by handling only one operation
 */
export class GetPaginatedPopularVideosUseCase implements IUseCase<PaginationParamsDto, PaginatedResultDto<VideoDto>> {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(params: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>> {
    try {
      // Use the repository adapter's database-level pagination method
      return await this.videoAdapter.getPaginatedMostViewed(params);
    } catch (error) {
      this.logger?.error('Error getting paginated popular videos', error, { params });
      return {
        data: [],
        pagination: {
          currentPage: params.page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: params.limit,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  }
}
