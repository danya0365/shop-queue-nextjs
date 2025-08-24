import { Logger } from '@/src/domain/interfaces/logger';
import { PaginatedResultDto, PaginationParamsDto } from '../../dtos/pagination-dto';
import { VideoDto } from '../../dtos/video-dto';
import { IUseCase } from '../../interfaces/use-case.interface';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

/**
 * Use case for getting paginated videos by user
 * Following Single Responsibility Principle by handling only one operation
 */
export class GetPaginatedVideosByUserUseCase implements IUseCase<{profileId: string, pagination: PaginationParamsDto}, PaginatedResultDto<VideoDto>> {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute({ profileId, pagination }: {profileId: string, pagination: PaginationParamsDto}): Promise<PaginatedResultDto<VideoDto>> {
    try {
      // Use database-level pagination through the adapter
      const result = await this.videoAdapter.getPaginatedByUser(profileId, {
        page: pagination.page,
        limit: pagination.limit
      });
      
      return {
        data: result.data,
        pagination: result.pagination
      };
    } catch (error) {
      this.logger?.error('Error getting paginated videos by user', error, { profileId, pagination });
      return {
        data: [],
        pagination: {
          currentPage: pagination.page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: pagination.limit,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  }
}
