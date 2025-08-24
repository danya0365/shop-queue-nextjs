import { Logger } from '@/src/domain/interfaces/logger';
import { VideoDto } from '../../dtos/video-dto';
import { IVideoRepositoryAdapter } from '../../interfaces/video-repository-adapter.interface';

export class GetVideosByCategoryUseCase {
  constructor(
    private videoAdapter: IVideoRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute(categoryId: string): Promise<VideoDto[]> {
    try {
      const result = await this.videoAdapter.getPaginatedVideosByCategory(categoryId, { limit: 10, page: 1 });
      return result.data;
    } catch (error) {
      this.logger?.error('Error getting videos by category', error, { categoryId });
      return [];
    }
  }
}
