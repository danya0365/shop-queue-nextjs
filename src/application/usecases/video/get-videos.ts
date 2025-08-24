import { Logger } from '@/src/domain/interfaces/logger';
import { PaginationParamsDto } from '../../dtos/pagination-dto';
import { VideoDto } from '../../dtos/video-dto';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export class GetVideosUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(): Promise<VideoDto[]> {
    try {
      return await this.videoAdapter.getAll();
    } catch (error) {
      this.logger?.error('Error getting all videos', error);
      return [];
    }
  }
}

export class GetRecentVideosUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(limit: number = 10): Promise<VideoDto[]> {
    try {
      const paginationParams: PaginationParamsDto = {
        page: 1,
        limit: limit
      };
      const result = await this.videoAdapter.getPaginatedMostRecent(paginationParams);
      return result.data;
    } catch (error) {
      this.logger?.error('Error getting recent videos', error, { limit });
      return [];
    }
  }
}

export class GetPopularVideosUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(limit: number = 10): Promise<VideoDto[]> {
    try {
      const paginationParams: PaginationParamsDto = {
        page: 1,
        limit: limit
      };
      const result = await this.videoAdapter.getPaginatedMostViewed(paginationParams);
      return result.data;
    } catch (error) {
      this.logger?.error('Error getting popular videos', error, { limit });
      return [];
    }
  }
}

export class GetMostLikedVideosUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(limit: number = 10): Promise<VideoDto[]> {
    try {
      const paginationParams: PaginationParamsDto = {
        page: 1,
        limit: limit
      };
      const result = await this.videoAdapter.getPaginatedMostViewed(paginationParams);
      return result.data;
    } catch (error) {
      this.logger?.error('Error getting most liked videos', error, { limit });
      return [];
    }
  }
}
